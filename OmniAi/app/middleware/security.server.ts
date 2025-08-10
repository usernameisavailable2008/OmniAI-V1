import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';
import { Logger } from '~/utils/logger.server';

const logger = new Logger('security-middleware');

// Rate limiting configuration
export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: options.message || 'Too many requests from this IP',
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round(options.windowMs! / 1000),
      });
    },
  });
};

// API-specific rate limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'API rate limit exceeded',
});

export const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 chat requests per minute
  message: 'Chat rate limit exceeded',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 auth attempts per 15 minutes
  message: 'Authentication rate limit exceeded',
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.shopify.com"],
      scriptSrc: ["'self'", "https://cdn.shopify.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://*.myshopify.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://*.myshopify.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Shopify app bridge compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Allow Shopify domains
    if (origin.endsWith('.myshopify.com') || origin.endsWith('.shopify.com')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow configured origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    logger.warn('CORS origin blocked', { origin });
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Input validation schemas
export const chatInputSchema = z.object({
  command: z.string().min(1, 'Command is required').max(1000, 'Command too long'),
  tier: z.coerce.number().min(1).max(3),
  shop: z.string().optional(),
});

export const authInputSchema = z.object({
  shop: z.string().regex(/^[a-zA-Z0-9-]+\.myshopify\.com$/, 'Invalid shop domain'),
  code: z.string().min(1, 'Authorization code is required').optional(),
});

// Input sanitization
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Request validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (req: any, res: any, next: any) => {
    try {
      const data = req.method === 'GET' ? req.query : req.body;
      const validated = schema.parse(data);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Request validation failed', {
          path: req.path,
          errors: error.errors,
          ip: req.ip,
        });
        
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      logger.error('Validation middleware error', error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
}

// Security audit logging
export function auditLog(action: string, details: any) {
  logger.info('Security audit', {
    action,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

// IP whitelist middleware
export function ipWhitelist(allowedIPs: string[]) {
  return (req: any, res: any, next: any) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      logger.warn('IP blocked', { ip: clientIP, path: req.path });
      res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address is not allowed',
      });
    }
  };
}

// Request size limiter
export const requestSizeLimiter = (maxSize: number = 1024 * 1024) => { // 1MB default
  return (req: any, res: any, next: any) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      logger.warn('Request size exceeded', {
        size: contentLength,
        maxSize,
        ip: req.ip,
        path: req.path,
      });
      
      return res.status(413).json({
        error: 'Request too large',
        message: `Request size ${contentLength} exceeds maximum ${maxSize}`,
      });
    }
    
    next();
  };
};

// Shopify webhook verification
export function verifyShopifyWebhook(secret: string) {
  return (req: any, res: any, next: any) => {
    const crypto = require('crypto');
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const body = req.body;
    
    if (!hmac) {
      logger.warn('Missing Shopify webhook signature', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({ error: 'Missing webhook signature' });
    }
    
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('base64');
    
    if (hash !== hmac) {
      logger.warn('Invalid Shopify webhook signature', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
    
    next();
  };
}

// Export security middleware bundle
export const securityMiddleware = {
  rateLimit: {
    api: apiRateLimiter,
    chat: chatRateLimiter,
    auth: authRateLimiter,
  },
  headers: securityHeaders,
  cors: corsOptions,
  validation: {
    chat: validateRequest(chatInputSchema),
    auth: validateRequest(authInputSchema),
  },
  audit: auditLog,
  ipWhitelist,
  requestSizeLimit: requestSizeLimiter(),
  shopifyWebhook: verifyShopifyWebhook,
}; 
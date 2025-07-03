import winston from 'winston';
import { env } from '~/config/env.server';

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      stack,
      ...meta,
    });
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Additional console transport for errors in production
if (env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({
    level: 'error',
    format: winston.format.combine(
      winston.format.printf(({ message, level, stack, ...meta }) => {
        // Additional error handling can be added here
        return '';
      })
    ),
  }));
}

// Enhanced logger with context
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: string, message: string, meta?: any) {
    logger.log(level, message, {
      context: this.context,
      ...meta,
    });
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | any, meta?: any) {
    const errorMeta = {
      ...meta,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    this.log('error', message, errorMeta);

    // Additional error handling can be added here in production
    if (env.NODE_ENV === 'production' && error instanceof Error) {
      // External error tracking service integration can be added here
    }
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

// Performance monitoring
export class PerformanceLogger {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string): void {
    this.timers.set(label, Date.now());
  }

  static endTimer(label: string, context?: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      throw new Error(`Timer '${label}' not found`);
    }

    const duration = Date.now() - startTime;
    this.timers.delete(label);

    const logger = new Logger(context || 'performance');
    logger.info(`Timer '${label}' completed`, { duration });

    return duration;
  }
}

// Request logging middleware
export function createRequestLogger(context: string) {
  const requestLogger = new Logger(context);

  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const { method, url, headers } = req;

    requestLogger.info('Request started', {
      method,
      url,
      userAgent: headers['user-agent'],
      ip: req.ip,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      requestLogger.info('Request completed', {
        method,
        url,
        statusCode,
        duration,
      });

      // Log errors for 4xx and 5xx responses
      if (statusCode >= 400) {
        requestLogger.error('Request failed', undefined, {
          method,
          url,
          statusCode,
          duration,
        });
      }
    });

    next();
  };
}

// Error boundary for React components
export function logComponentError(error: Error, errorInfo: any) {
  const logger = new Logger('react-error-boundary');
  logger.error('Component error caught', error, {
    componentStack: errorInfo.componentStack,
  });
}

// Unhandled error handlers
if (env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    const logger = new Logger('unhandled-rejection');
    logger.error('Unhandled promise rejection', reason as Error, {
      promise: promise.toString(),
    });
  });

  process.on('uncaughtException', (error) => {
    const logger = new Logger('uncaught-exception');
    logger.error('Uncaught exception', error);
    process.exit(1);
  });
}

export default logger; 
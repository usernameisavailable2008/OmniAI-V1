import { Redis } from 'ioredis';
import { env } from '~/config/env.server';
import winston from 'winston';

interface PerformanceMetrics {
  executionTime: number;
  apiCalls: number;
  memoryUsage: number;
  timestamp: number;
}

interface CommandStats {
  totalCalls: number;
  averageExecutionTime: number;
  errorRate: number;
  lastUpdated: number;
}

interface RateLimitConfig {
  timeWindow: number; // in seconds
  maxRequests: number;
}

interface CacheConfig {
  ttl: number; // in seconds
  maxSize: number; // in bytes
}

export class PerformanceService {
  private static instance: PerformanceService;
  private redis: Redis;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private commandStats: Map<string, CommandStats> = new Map();

  private readonly RATE_LIMITS: Record<string, RateLimitConfig> = {
    product: { timeWindow: 60, maxRequests: 50 },
    order: { timeWindow: 60, maxRequests: 30 },
    customer: { timeWindow: 60, maxRequests: 20 },
    theme: { timeWindow: 300, maxRequests: 10 },
    code: { timeWindow: 300, maxRequests: 5 },
    store: { timeWindow: 300, maxRequests: 3 },
  };

  private readonly CACHE_CONFIG: Record<string, CacheConfig> = {
    product: { ttl: 300, maxSize: 1024 * 1024 }, // 1MB
    order: { ttl: 60, maxSize: 512 * 1024 }, // 512KB
    customer: { ttl: 600, maxSize: 256 * 1024 }, // 256KB
    theme: { ttl: 3600, maxSize: 2 * 1024 * 1024 }, // 2MB
    store: { ttl: 3600, maxSize: 5 * 1024 * 1024 }, // 5MB
  };

  private constructor() {
    this.redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.setupRedisErrorHandling();
  }

  private setupRedisErrorHandling() {
    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected');
    });

    this.redis.on('ready', () => {
      logger.info('Redis ready');
    });
  }

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  async getCachedData(key: string, type: string): Promise<any | null> {
    const cacheConfig = this.CACHE_CONFIG[type];
    if (!cacheConfig) return null;

    try {
      const cached = await this.redis.get(`cache:${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > cacheConfig.ttl * 1000) {
        await this.redis.del(`cache:${key}`);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Cache retrieval error:', error);
      return null;
    }
  }

  async setCachedData(key: string, type: string, data: any): Promise<void> {
    const cacheConfig = this.CACHE_CONFIG[type];
    if (!cacheConfig) return;

    try {
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
      });

      if (Buffer.from(serialized).length > cacheConfig.maxSize) {
        logger.warn('Cache entry exceeds size limit', {
          type,
          size: Buffer.from(serialized).length,
          limit: cacheConfig.maxSize,
        });
        return;
      }

      await this.redis.set(
        `cache:${key}`,
        serialized,
        'EX',
        cacheConfig.ttl
      );
    } catch (error) {
      logger.error('Cache storage error:', error);
    }
  }

  async checkRateLimit(commandType: string, shop: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = `rate_limit:${commandType}:${shop}`;
    const config = this.RATE_LIMITS[commandType];

    if (!config) {
      return { allowed: true, remaining: 0, resetTime: 0 };
    }

    const multi = this.redis.multi();
    multi.incr(key);
    multi.ttl(key);

    try {
      const [count, ttl] = await multi.exec() as [number, number][];
      const currentCount = count[1];
      const currentTtl = ttl[1];

      if (currentCount === 1) {
        await this.redis.expire(key, config.timeWindow);
      }

      const remaining = Math.max(0, config.maxRequests - currentCount);
      const resetTime = Date.now() + (currentTtl > 0 ? currentTtl : config.timeWindow) * 1000;

      return {
        allowed: currentCount <= config.maxRequests,
        remaining,
        resetTime,
      };
    } catch (error) {
      logger.error('Rate limit check error:', error);
      return { allowed: true, remaining: 0, resetTime: 0 };
    }
  }

  async trackCommandExecution(metrics: {
    commandType: string;
    executionTime: number;
    success: boolean;
    error?: string;
    timestamp: number;
    shop: string;
    tier: number;
    apiCalls: number;
    memoryUsage: number;
  }): Promise<void> {
    const key = `metrics:${metrics.shop}:${metrics.commandType}`;

    try {
      // Update real-time metrics
      const shopMetrics = this.metrics.get(metrics.shop) || [];
      shopMetrics.push({
        executionTime: metrics.executionTime,
        apiCalls: metrics.apiCalls,
        memoryUsage: metrics.memoryUsage,
        timestamp: metrics.timestamp,
      });

      // Keep only last hour of metrics
      const oneHourAgo = Date.now() - 3600000;
      const filteredMetrics = shopMetrics.filter(m => m.timestamp > oneHourAgo);
      this.metrics.set(metrics.shop, filteredMetrics);

      // Update command stats
      const stats = this.commandStats.get(key) || {
        totalCalls: 0,
        averageExecutionTime: 0,
        errorRate: 0,
        lastUpdated: 0,
      };

      stats.totalCalls++;
      stats.averageExecutionTime = (
        (stats.averageExecutionTime * (stats.totalCalls - 1) + metrics.executionTime) /
        stats.totalCalls
      );
      stats.errorRate = (
        (stats.errorRate * (stats.totalCalls - 1) + (metrics.success ? 0 : 1)) /
        stats.totalCalls
      );
      stats.lastUpdated = Date.now();

      this.commandStats.set(key, stats);

      // Store in Redis for persistence
      await this.redis.hset(
        `stats:${metrics.shop}`,
        metrics.commandType,
        JSON.stringify(stats)
      );

      // Log if execution time is high
      if (metrics.executionTime > 5000) {
        logger.warn('High execution time detected', {
          shop: metrics.shop,
          commandType: metrics.commandType,
          executionTime: metrics.executionTime,
          tier: metrics.tier,
        });
      }
    } catch (error) {
      logger.error('Error tracking command execution:', error);
    }
  }

  async getErrorRates(): Promise<Record<string, number>> {
    const errorRates: Record<string, number> = {};
    
    for (const [key, stats] of this.commandStats.entries()) {
      const [shop, commandType] = key.split(':');
      errorRates[`${shop}:${commandType}`] = stats.errorRate;
    }

    return errorRates;
  }

  async getPerformanceStats(shop: string): Promise<{
    commandStats: Record<string, CommandStats>;
    recentMetrics: PerformanceMetrics[];
  }> {
    const stats = await this.redis.hgetall(`stats:${shop}`);
    const commandStats: Record<string, CommandStats> = {};

    for (const [type, value] of Object.entries(stats)) {
      commandStats[type] = JSON.parse(value);
    }

    return {
      commandStats,
      recentMetrics: this.metrics.get(shop) || [],
    };
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
}); 
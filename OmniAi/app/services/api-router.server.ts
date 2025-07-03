import { OpenAI } from 'openai';
import { env } from '~/config/env.server';
import { shopifyApi } from '@shopify/shopify-api';
import type { Command } from './command-processor.server';
import winston from 'winston';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

type RestClient = ReturnType<typeof shopifyApi>['clients']['Rest'];

export type CommandContext = {
  shopify: RestClient;
  tier: 1 | 2 | 3;
  shop: string;
};

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export class APIRouter {
  private context: CommandContext;
  private shopifyService: ShopifyService;
  private retryConfig: RetryConfig;

  constructor(context: CommandContext, retryConfig: Partial<RetryConfig> = {}) {
    this.context = context;
    this.shopifyService = new ShopifyService(this.context.shopify);
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  private async retry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.retryConfig.initialDelay;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry if it's a validation error or rate limit
        if (
          error instanceof Error &&
          (error.message.includes('validation') || error.message.includes('rate limit'))
        ) {
          throw error;
        }

        if (attempt === this.retryConfig.maxAttempts) {
          throw new Error(
            `Failed after ${attempt} attempts: ${lastError.message}`
          );
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(
          delay * this.retryConfig.backoffFactor,
          this.retryConfig.maxDelay
        );
      }
    }

    throw lastError;
  }

  async executeCommand(command: Command): Promise<{
    success: boolean;
    details?: Record<string, unknown>;
    error?: string;
    apiCalls?: number;
  }> {
    const startTime = Date.now();
    let apiCalls = 0;

    try {
      // Validate command before execution
      if (!this.validateCommand(command)) {
        throw new Error('Invalid command structure');
      }

      // Execute command with retry logic
      const result = await this.retry(
        async () => {
          apiCalls++;
          switch (command.type) {
            case 'product':
            case 'order':
            case 'customer':
            case 'theme':
            case 'code':
            case 'store':
              return await this.shopifyService.executeCommand(command);
            default:
              throw new Error(`Unsupported command type: ${command.type}`);
          }
        },
        `Executing ${command.type} command`
      );

      return {
        success: true,
        details: result,
        apiCalls,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Command execution failed: ${errorMessage}`, {
        command,
        duration: Date.now() - startTime,
        apiCalls,
      });

      return {
        success: false,
        error: errorMessage,
        apiCalls,
      };
    }
  }

  private validateCommand(command: Command): boolean {
    if (!command.type || !command.action) {
      return false;
    }

    // Validate command type
    const validTypes = ['product', 'order', 'customer', 'theme', 'code', 'store'];
    if (!validTypes.includes(command.type)) {
      return false;
    }

    // Validate parameters based on command type
    switch (command.type) {
      case 'product':
        return this.validateProductCommand(command);
      case 'order':
        return this.validateOrderCommand(command);
      case 'customer':
        return this.validateCustomerCommand(command);
      case 'theme':
        return this.validateThemeCommand(command);
      case 'code':
        return this.validateCodeCommand(command);
      case 'store':
        return this.validateStoreCommand(command);
      default:
        return false;
    }
  }

  private validateProductCommand(command: Command): boolean {
    const requiredParams = {
      create: ['title', 'price'],
      update: ['id'],
      delete: ['id'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }

  private validateOrderCommand(command: Command): boolean {
    const requiredParams = {
      update: ['id'],
      cancel: ['id'],
      refund: ['id', 'amount'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }

  private validateCustomerCommand(command: Command): boolean {
    const requiredParams = {
      create: ['email'],
      update: ['id'],
      delete: ['id'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }

  private validateThemeCommand(command: Command): boolean {
    const requiredParams = {
      update: ['themeId'],
      publish: ['themeId'],
      customize: ['themeId', 'customizations'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }

  private validateCodeCommand(command: Command): boolean {
    const requiredParams = {
      generate: ['type', 'requirements'],
      deploy: ['code', 'target'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }

  private validateStoreCommand(command: Command): boolean {
    const requiredParams = {
      build: ['template', 'settings'],
      configure: ['settings'],
    };

    const required = requiredParams[command.action as keyof typeof requiredParams];
    if (!required) return false;

    return required.every(param => command.parameters[param] !== undefined);
  }
} 
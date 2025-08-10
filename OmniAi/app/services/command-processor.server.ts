import { z } from 'zod';
import { env } from '~/config/env.server';
import { OpenAI } from 'openai';
import winston from 'winston';
import sanitizeHtml from 'sanitize-html';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Command validation schemas
const BaseCommandSchema = z.object({
  type: z.enum(['product', 'order', 'customer', 'theme', 'code', 'store']),
  action: z.string().min(1),
  parameters: z.record(z.unknown()),
});

const ProductCommandSchema = BaseCommandSchema.extend({
  type: z.literal('product'),
  action: z.enum(['create', 'update', 'delete', 'bulk_update']),
  parameters: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    compareAtPrice: z.number().positive().optional(),
    vendor: z.string().optional(),
    productType: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional(),
    variants: z.array(z.object({
      title: z.string(),
      price: z.number().positive(),
      sku: z.string().optional(),
      inventory: z.number().int().optional(),
    })).optional(),
  }),
});

const OrderCommandSchema = BaseCommandSchema.extend({
  type: z.literal('order'),
  action: z.enum(['update', 'fulfill', 'cancel']),
  parameters: z.object({
    orderId: z.string(),
    status: z.enum(['fulfilled', 'cancelled', 'pending']).optional(),
    trackingNumber: z.string().optional(),
    trackingCompany: z.string().optional(),
    notifyCustomer: z.boolean().optional(),
  }),
});

const CustomerCommandSchema = BaseCommandSchema.extend({
  type: z.literal('customer'),
  action: z.enum(['create', 'update', 'delete']),
  parameters: z.object({
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    tags: z.array(z.string()).optional(),
    addresses: z.array(z.object({
      address1: z.string(),
      city: z.string(),
      country: z.string(),
      zip: z.string(),
    })).optional(),
  }),
});

const ThemeCommandSchema = BaseCommandSchema.extend({
  type: z.literal('theme'),
  action: z.enum(['update', 'publish']),
  parameters: z.object({
    themeId: z.string(),
    assets: z.array(z.object({
      key: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

const CodeCommandSchema = BaseCommandSchema.extend({
  type: z.literal('code'),
  action: z.enum(['generate']),
  parameters: z.object({
    type: z.enum(['liquid', 'javascript', 'css']),
    requirements: z.string(),
  }),
});

const StoreCommandSchema = BaseCommandSchema.extend({
  type: z.literal('store'),
  action: z.enum(['build', 'configure']),
  parameters: z.object({
    template: z.string().optional(),
    customizations: z.record(z.unknown()).optional(),
    settings: z.record(z.unknown()).optional(),
    themeId: z.string(),
  }),
});

const CommandSchema = z.discriminatedUnion('type', [
  ProductCommandSchema,
  OrderCommandSchema,
  CustomerCommandSchema,
  ThemeCommandSchema,
  CodeCommandSchema,
  StoreCommandSchema,
]);

export type Command = z.infer<typeof CommandSchema>;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Command validation and safety checks
const SAFETY_CHECKS = {
  dangerousActions: ['delete', 'remove', 'clear', 'drop'],
  bulkOperations: ['all', 'every', 'each', 'entire'],
  sensitiveData: ['password', 'api_key', 'secret', 'token'],
};

export class CommandProcessor {
  private static instance: CommandProcessor;
  private commandHistory: Map<string, Command[]> = new Map();

  private constructor() {}

  static getInstance(): CommandProcessor {
    if (!CommandProcessor.instance) {
      CommandProcessor.instance = new CommandProcessor();
    }
    return CommandProcessor.instance;
  }

  private sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'recursiveEscape',
    });
  }

  private sanitizeCommand(command: Command): Command {
    const sanitizedCommand = { ...command };

    // Recursively sanitize string values in parameters
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeInput(value);
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    sanitizedCommand.parameters = sanitizeObject(command.parameters);
    return sanitizedCommand;
  }

  private async validateCommand(command: Command, shop: string): Promise<{
    isValid: boolean;
    message?: string;
    requiresConfirmation: boolean;
  }> {
    // Check for dangerous operations
    if (SAFETY_CHECKS.dangerousActions.some(action => command.action.toLowerCase().includes(action))) {
      return {
        isValid: true,
        message: 'This operation may be destructive. Please confirm.',
        requiresConfirmation: true,
      };
    }

    // Check for bulk operations
    if (SAFETY_CHECKS.bulkOperations.some(term => 
      JSON.stringify(command.parameters).toLowerCase().includes(term)
    )) {
      return {
        isValid: true,
        message: 'This operation will affect multiple items. Please confirm.',
        requiresConfirmation: true,
      };
    }

    // Check command history for similar operations
    const recentCommands = this.commandHistory.get(shop) || [];
    const similarCommands = recentCommands.filter(cmd => 
      cmd.type === command.type && 
      cmd.action === command.action &&
      Date.now() - (cmd.timestamp || 0) < 5 * 60 * 1000 // Within last 5 minutes
    );

    if (similarCommands.length > 0) {
      return {
        isValid: true,
        message: 'Similar operation was performed recently. Please confirm.',
        requiresConfirmation: true,
      };
    }

    return { isValid: true, requiresConfirmation: false };
  }

  private async parseCommand(text: string, tier: number): Promise<Command> {
    const prompt = `Parse the following command into a structured format:
    Command: "${text}"
    Tier: ${tier}
    
    Consider:
    1. Command type (product, order, customer, theme, code, store)
    2. Action to perform
    3. Required parameters
    4. Confidence level (0-1)
    5. Whether confirmation is needed
    6. Estimated impact (low, medium, high)
    
    Format the response as a JSON object.`;

    const completion = await openai.chat.completions.create({
      model: tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to parse command');
    }

    try {
      const parsedCommand = JSON.parse(response);
      const schema = this.getSchemaForTier(tier);
      return schema.parse(parsedCommand);
    } catch (error) {
      throw new Error(`Invalid command structure: ${error.message}`);
    }
  }

  private getSchemaForTier(tier: number): typeof CommandSchema {
    switch (tier) {
      case 3:
        return CommandSchema;
      case 2:
        return CommandSchema.pick({
          type: true,
          action: true,
          parameters: true,
          confidence: true,
          requiresConfirmation: true,
          estimatedImpact: true,
        });
      default:
        return CommandSchema.pick({
          type: true,
          action: true,
          parameters: true,
          confidence: true,
          requiresConfirmation: true,
          estimatedImpact: true,
        });
    }
  }

  async processCommand(input: string, tier: number, shop: string): Promise<{
    command: Command;
    validation: {
      isValid: boolean;
      errors: string[];
      requiresConfirmation: boolean;
    };
  }> {
    try {
      // Sanitize raw input
      const sanitizedInput = this.sanitizeInput(input);

      // Use OpenAI to parse the natural language command
      const completion = await openai.chat.completions.create({
        model: tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Parse the following command into a structured Shopify command object.',
          },
          {
            role: 'user',
            content: sanitizedInput,
          },
        ],
        temperature: 0.2,
      });

      const parsedCommand = JSON.parse(completion.choices[0]?.message?.content || '{}');

      // Validate the command structure
      const validationResult = CommandSchema.safeParse(parsedCommand);

      if (!validationResult.success) {
        return {
          command: parsedCommand,
          validation: {
            isValid: false,
            errors: validationResult.error.errors.map(e => e.message),
            requiresConfirmation: false,
          },
        };
      }

      // Additional sanitization of the parsed command
      const sanitizedCommand = this.sanitizeCommand(validationResult.data);

      // Check if command requires confirmation
      const requiresConfirmation = this.requiresConfirmation(sanitizedCommand);

      logger.info('Command processed successfully', {
        shop,
        type: sanitizedCommand.type,
        action: sanitizedCommand.action,
      });

      return {
        command: sanitizedCommand,
        validation: {
          isValid: true,
          errors: [],
          requiresConfirmation,
        },
      };
    } catch (error) {
      logger.error('Command processing error:', error);
      throw new Error('Failed to process command');
    }
  }

  private requiresConfirmation(command: Command): boolean {
    // Define commands that require confirmation
    const criticalActions = {
      product: ['delete', 'bulk_update'],
      order: ['cancel'],
      customer: ['delete'],
      theme: ['publish'],
      store: ['build'],
    };

    return criticalActions[command.type]?.includes(command.action) || false;
  }

  async processMultiStepCommand(commands: string[], tier: number, shop: string): Promise<{
    commands: Command[];
    validations: Array<{
      isValid: boolean;
      message?: string;
      requiresConfirmation: boolean;
    }>;
  }> {
    const results = await Promise.all(
      commands.map(cmd => this.processCommand(cmd, tier, shop))
    );

    return {
      commands: results.map(r => r.command),
      validations: results.map(r => r.validation),
    };
  }
} 
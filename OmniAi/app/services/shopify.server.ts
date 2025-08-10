import { env } from '~/config/env.server';
import { shopifyApi } from '@shopify/shopify-api';
import type { CommandType, CommandAction } from './command-processor.server';
import winston from 'winston';
import { OpenAI } from 'openai';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

type RestClient = ReturnType<typeof shopifyApi>['clients']['Rest'];

export class ShopifyService {
  private client: RestClient;
  private shop: string;

  constructor(client: RestClient, shop: string) {
    this.client = client;
    this.shop = shop;
  }

  async executeCommand(type: CommandType, action: CommandAction, parameters: Record<string, unknown>) {
    switch (type) {
      case 'product':
        return this.handleProductCommand(action, parameters);
      case 'order':
        return this.handleOrderCommand(action, parameters);
      case 'customer':
        return this.handleCustomerCommand(action, parameters);
      case 'theme':
        return this.handleThemeCommand(action, parameters);
      case 'code':
        return this.handleCodeCommand(action, parameters);
      case 'store':
        return this.handleStoreCommand(action, parameters);
      default:
        throw new Error(`Unsupported command type: ${type}`);
    }
  }

  private async handleProductCommand(action: string, parameters: Record<string, unknown>) {
    switch (action) {
      case 'update':
        return this.updateProducts(parameters);
      case 'create':
        return this.createProduct(parameters);
      case 'delete':
        return this.deleteProduct(parameters);
      case 'bulk-update':
        return this.bulkUpdateProducts(parameters);
      default:
        throw new Error(`Unsupported product action: ${action}`);
    }
  }

  private async handleOrderCommand(action: string, parameters: Record<string, unknown>) {
    switch (action) {
      case 'update':
        return this.updateOrder(parameters);
      case 'fulfill':
        return this.fulfillOrder(parameters);
      case 'cancel':
        return this.cancelOrder(parameters);
      default:
        throw new Error(`Unsupported order action: ${action}`);
    }
  }

  private async handleThemeCommand(action: string, parameters: Record<string, unknown>) {
    switch (action) {
      case 'update':
        return this.updateTheme(parameters);
      case 'publish':
        return this.publishTheme(parameters);
      case 'customize':
        return this.customizeTheme(parameters);
      default:
        throw new Error(`Unsupported theme action: ${action}`);
    }
  }

  private async handleCodeCommand(action: string, parameters: Record<string, unknown>) {
    switch (action) {
      case 'generate':
        return this.generateCode(parameters);
      case 'deploy':
        return this.deployCode(parameters);
      default:
        throw new Error(`Unsupported code action: ${action}`);
    }
  }

  private async handleStoreCommand(action: string, parameters: Record<string, unknown>) {
    switch (action) {
      case 'build':
        return this.buildStore(parameters);
      case 'configure':
        return this.configureStore(parameters);
      default:
        throw new Error(`Unsupported store action: ${action}`);
    }
  }

  // Product operations
  private async updateProducts(parameters: Record<string, unknown>) {
    const { productIds, updates } = parameters;
    return this.client.put(`/admin/api/2024-01/products/bulk.json`, {
      products: productIds.map((id: string) => ({
        id,
        ...updates
      }))
    });
  }

  private async createProduct(parameters: Record<string, unknown>) {
    return this.client.post('/admin/api/2024-01/products.json', {
      product: parameters
    });
  }

  private async deleteProduct(parameters: Record<string, unknown>) {
    const { productId } = parameters;
    return this.client.delete(`/admin/api/2024-01/products/${productId}.json`);
  }

  private async bulkUpdateProducts(parameters: Record<string, unknown>) {
    const { updates } = parameters;
    return this.client.put('/admin/api/2024-01/products/bulk.json', {
      products: updates
    });
  }

  // Order operations
  private async updateOrder(parameters: Record<string, unknown>) {
    const { orderId, updates } = parameters;
    return this.client.put(`/admin/api/2024-01/orders/${orderId}.json`, {
      order: updates
    });
  }

  private async fulfillOrder(parameters: Record<string, unknown>) {
    const { orderId, fulfillment } = parameters;
    return this.client.post(`/admin/api/2024-01/orders/${orderId}/fulfillments.json`, {
      fulfillment
    });
  }

  private async cancelOrder(parameters: Record<string, unknown>) {
    const { orderId } = parameters;
    return this.client.post(`/admin/api/2024-01/orders/${orderId}/cancel.json`);
  }

  // Theme operations
  private async updateTheme(parameters: Record<string, unknown>) {
    const { themeId, updates } = parameters;
    return this.client.put(`/admin/api/2024-01/themes/${themeId}.json`, {
      theme: updates
    });
  }

  private async publishTheme(parameters: Record<string, unknown>) {
    const { themeId } = parameters;
    return this.client.put(`/admin/api/2024-01/themes/${themeId}.json`, {
      theme: { role: 'main' }
    });
  }

  private async customizeTheme(parameters: Record<string, unknown>) {
    const { themeId, customizations } = parameters;
    return this.client.put(`/admin/api/2024-01/themes/${themeId}/assets.json`, {
      asset: customizations
    });
  }

  // Code operations
  private async generateCode(parameters: Record<string, unknown>) {
    const { type, requirements, tier = 1 } = parameters;
    try {
      const prompt = `Generate valid Shopify Liquid or theme code for the following requirements.\nType: ${type}\nRequirements: ${JSON.stringify(requirements)}\nReturn ONLY the code, no explanation.`;
      const completion = await openai.chat.completions.create({
        model: tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      });
      const code = completion.choices[0]?.message?.content || '';
      // Basic sanitization: remove dangerous tags, scripts, etc.
      const sanitized = code.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').trim();
      logger.info('Code generated by OpenAI', { type, requirements, sanitized });
      return { success: true, code: sanitized };
    } catch (error) {
      logger.error('Error generating code with OpenAI', { error });
      return { success: false, error: 'Failed to generate code' };
    }
  }

  private async deployCode(parameters: Record<string, unknown>) {
    const { code, themeId, assetKey } = parameters;
    if (!themeId || !assetKey || !code) {
      logger.warn('Missing parameters for deployCode', { themeId, assetKey });
      return { success: false, error: 'Missing themeId, assetKey, or code' };
    }
    try {
      const result = await this.client.put(`/admin/api/2024-01/themes/${themeId}/assets.json`, {
        asset: {
          key: assetKey,
          value: code,
        },
      });
      logger.info('Code deployed to Shopify theme', { themeId, assetKey });
      return { success: true, result };
    } catch (error) {
      logger.error('Error deploying code to Shopify', { error, themeId, assetKey });
      return { success: false, error: 'Failed to deploy code' };
    }
  }

  // Store operations
  private async buildStore(parameters: Record<string, unknown>) {
    const { template, customizations, themeId } = parameters;
    if (!themeId) {
      logger.warn('Missing themeId for buildStore', { template });
      return { success: false, error: 'Missing themeId' };
    }
    try {
      // Example: apply customizations to theme assets
      if (customizations && typeof customizations === 'object') {
        for (const [assetKey, value] of Object.entries(customizations)) {
          await this.client.put(`/admin/api/2024-01/themes/${themeId}/assets.json`, {
            asset: { key: assetKey, value },
          });
        }
      }
      logger.info('Store built with template and customizations', { themeId, template });
      return { success: true };
    } catch (error) {
      logger.error('Error building store', { error, themeId });
      return { success: false, error: 'Failed to build store' };
    }
  }

  private async configureStore(parameters: Record<string, unknown>) {
    const { settings, themeId } = parameters;
    if (!themeId || !settings) {
      logger.warn('Missing themeId or settings for configureStore', { themeId });
      return { success: false, error: 'Missing themeId or settings' };
    }
    try {
      // Example: update theme settings_data.json
      await this.client.put(`/admin/api/2024-01/themes/${themeId}/assets.json`, {
        asset: {
          key: 'config/settings_data.json',
          value: JSON.stringify(settings),
        },
      });
      logger.info('Store configuration updated', { themeId });
      return { success: true };
    } catch (error) {
      logger.error('Error configuring store', { error, themeId });
      return { success: false, error: 'Failed to configure store' };
    }
  }
} 
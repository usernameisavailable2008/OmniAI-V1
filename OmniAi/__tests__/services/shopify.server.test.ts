import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ShopifyService } from '~/services/shopify.server';

// Mock dependencies
jest.mock('~/config/env.server', () => ({
  env: {
    SHOPIFY_API_KEY: 'test-key',
    SHOPIFY_API_SECRET: 'test-secret',
    SHOPIFY_APP_URL: 'https://test.com',
    OPENAI_API_KEY: 'test-openai-key',
  },
}));

jest.mock('@shopify/shopify-api', () => ({
  shopifyApi: jest.fn(() => ({
    clients: {
      Rest: jest.fn(),
    },
  })),
}));

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
  format: {
    json: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

describe('ShopifyService', () => {
  let shopifyService: ShopifyService;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock REST client
    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    shopifyService = new ShopifyService(mockClient, 'test-shop.myshopify.com');
  });

  it('should handle product updates', async () => {
    const mockResponse = {
      body: {
        products: [
          { id: 1, title: 'Updated Title 1' },
          { id: 2, title: 'Updated Title 2' },
        ],
      },
    };

    mockClient.put.mockResolvedValue(mockResponse);

    const result = await shopifyService.executeCommand('product', 'update', {
      productIds: ['1', '2'],
      updates: { title: 'New Title' },
    });

    expect(mockClient.put).toHaveBeenCalledWith('/admin/api/2024-01/products/bulk.json', {
      products: [
        { id: '1', title: 'New Title' },
        { id: '2', title: 'New Title' },
      ],
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle product creation', async () => {
    const mockResponse = {
      body: {
        product: { id: 1, title: 'New Product' },
      },
    };

    mockClient.post.mockResolvedValue(mockResponse);

    const result = await shopifyService.executeCommand('product', 'create', {
      title: 'New Product',
      body_html: 'Product description',
    });

    expect(mockClient.post).toHaveBeenCalledWith('/admin/api/2024-01/products.json', {
      product: {
        title: 'New Product',
        body_html: 'Product description',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle order fulfillment', async () => {
    const mockResponse = {
      body: {
        fulfillment: { id: 1, status: 'success' },
      },
    };

    mockClient.post.mockResolvedValue(mockResponse);

    const result = await shopifyService.executeCommand('order', 'fulfill', {
      orderId: '12345',
      fulfillment: {
        tracking_number: 'TRACK123',
        tracking_company: 'UPS',
      },
    });

    expect(mockClient.post).toHaveBeenCalledWith('/admin/api/2024-01/orders/12345/fulfillments.json', {
      fulfillment: {
        tracking_number: 'TRACK123',
        tracking_company: 'UPS',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle theme updates', async () => {
    const mockResponse = {
      body: {
        theme: { id: 1, name: 'Updated Theme' },
      },
    };

    mockClient.put.mockResolvedValue(mockResponse);

    const result = await shopifyService.executeCommand('theme', 'update', {
      themeId: '12345',
      updates: { name: 'Updated Theme' },
    });

    expect(mockClient.put).toHaveBeenCalledWith('/admin/api/2024-01/themes/12345.json', {
      theme: { name: 'Updated Theme' },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw error for unsupported command type', async () => {
    await expect(
      shopifyService.executeCommand('invalid' as any, 'update', {})
    ).rejects.toThrow('Unsupported command type: invalid');
  });

  it('should throw error for unsupported product action', async () => {
    await expect(
      shopifyService.executeCommand('product', 'invalid' as any, {})
    ).rejects.toThrow('Unsupported product action: invalid');
  });
}); 
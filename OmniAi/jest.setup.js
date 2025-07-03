// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';
process.env.SHOPIFY_API_KEY = 'test-api-key';
process.env.SHOPIFY_API_SECRET = 'test-api-secret';
process.env.SHOPIFY_APP_URL = 'http://localhost:3000';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock Redis
jest.mock('ioredis', () => {
  const Redis = jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  }));
  return Redis;
});

// Mock OpenAI
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    type: 'product',
                    action: 'create',
                    parameters: { title: 'Test Product', price: 10 },
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

// Mock Shopify API
jest.mock('@shopify/shopify-api', () => ({
  shopifyApi: jest.fn().mockReturnValue({
    clients: {
      Rest: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      })),
    },
  }),
  LATEST_API_VERSION: '2024-01',
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
}); 
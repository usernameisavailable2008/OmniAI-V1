import { describe, it, expect, beforeEach } from '@jest/globals';
import { env } from '~/utils/env.server';

describe('env.server', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.SHOPIFY_API_KEY = 'test-key';
    process.env.SHOPIFY_API_SECRET = 'test-secret';
    process.env.SHOPIFY_APP_URL = 'https://test.com';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.SESSION_SECRET = 'test-session-secret-32-chars-long';
    process.env.NODE_ENV = 'test';
  });

  it('should validate required environment variables', () => {
    expect(env.SHOPIFY_API_KEY).toBe('test-key');
    expect(env.SHOPIFY_API_SECRET).toBe('test-secret');
    expect(env.SHOPIFY_APP_URL).toBe('https://test.com');
    expect(env.OPENAI_API_KEY).toBe('test-openai-key');
    expect(env.SESSION_SECRET).toBe('test-session-secret-32-chars-long');
    expect(env.NODE_ENV).toBe('test');
  });

  it('should throw error for missing required variables', () => {
    delete process.env.SHOPIFY_API_KEY;
    
    expect(() => {
      jest.isolateModules(() => {
        require('~/utils/env.server');
      });
    }).toThrow();
  });

  it('should have default values for optional variables', () => {
    expect(env.OPENAI_MODEL_TIER1).toBe('gpt-3.5-turbo');
    expect(env.OPENAI_MODEL_TIER2).toBe('gpt-4');
    expect(env.OPENAI_MODEL_TIER3).toBe('gpt-4');
  });
}); 
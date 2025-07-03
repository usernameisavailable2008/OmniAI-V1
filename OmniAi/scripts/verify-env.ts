import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
const result = config({
  path: path.resolve(__dirname, '../.env'),
});

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

// Define the environment schema
const envSchema = z.object({
  // Shopify
  SHOPIFY_API_KEY: z.string().min(1, 'Shopify API Key is required'),
  SHOPIFY_API_SECRET: z.string().min(1, 'Shopify API Secret is required'),
  SHOPIFY_APP_URL: z.string().url('Shopify App URL must be a valid URL'),
  SHOPIFY_AUTH_CALLBACK_URL: z.string().url('Shopify Auth Callback URL must be a valid URL'),
  SHOPIFY_APP_SCOPES: z.string().min(1, 'Shopify App Scopes are required'),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API Key is required'),
  OPENAI_MODEL_TIER1: z.string().default('gpt-3.5-turbo'),
  OPENAI_MODEL_TIER2: z.string().default('gpt-4'),
  OPENAI_MODEL_TIER3: z.string().default('gpt-4'),

  // Session
  SESSION_SECRET: z.string().min(32, 'Session Secret must be at least 32 characters long'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Redis (optional in development)
  REDIS_URL: z.string().optional(),

  // Subscription
  TIER1_PRICE: z.string().transform(Number).default('85'),
  TIER2_PRICE: z.string().transform(Number).default('170'),
  TIER3_PRICE: z.string().transform(Number).default('299'),

  // Optional: Stripe (required in production)
  ...(process.env.NODE_ENV === 'production'
    ? {
        STRIPE_SECRET_KEY: z.string().min(1, 'Stripe Secret Key is required in production'),
        STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe Webhook Secret is required in production'),
        STRIPE_PRICE_ID_TIER1: z.string().min(1, 'Stripe Price ID for Tier 1 is required in production'),
        STRIPE_PRICE_ID_TIER2: z.string().min(1, 'Stripe Price ID for Tier 2 is required in production'),
        STRIPE_PRICE_ID_TIER3: z.string().min(1, 'Stripe Price ID for Tier 3 is required in production'),
      }
    : {
        STRIPE_SECRET_KEY: z.string().optional(),
        STRIPE_WEBHOOK_SECRET: z.string().optional(),
        STRIPE_PRICE_ID_TIER1: z.string().optional(),
        STRIPE_PRICE_ID_TIER2: z.string().optional(),
        STRIPE_PRICE_ID_TIER3: z.string().optional(),
      }),
});

try {
  // Validate environment variables
  const env = envSchema.parse(process.env);
  
  console.log('✅ Environment variables validated successfully');
  console.log('\nEnvironment:', env.NODE_ENV);
  console.log('App URL:', env.SHOPIFY_APP_URL);
  
  // Additional checks for production
  if (env.NODE_ENV === 'production') {
    if (!env.REDIS_URL) {
      console.warn('⚠️ Warning: REDIS_URL is not set in production');
    }
    
    // Check SSL/HTTPS
    if (!env.SHOPIFY_APP_URL.startsWith('https://')) {
      console.warn('⚠️ Warning: SHOPIFY_APP_URL should use HTTPS in production');
    }
    
    if (!env.SHOPIFY_AUTH_CALLBACK_URL.startsWith('https://')) {
      console.warn('⚠️ Warning: SHOPIFY_AUTH_CALLBACK_URL should use HTTPS in production');
    }
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('\n❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('\n❌ Unexpected error during environment validation:', error);
  }
  process.exit(1);
} 
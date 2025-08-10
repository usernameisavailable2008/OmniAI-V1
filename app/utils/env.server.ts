import { baseEnvSchema, prodOnlySchema, type BaseEnv, type ProdOnlyEnv } from "~/config/envSchema";

// Parse environment variables once at boot
const rawEnv = process.env;

// Validate base environment variables
const base = baseEnvSchema.parse(rawEnv);

// Validate production-only variables if in production
const prod = rawEnv.NODE_ENV === "production"
  ? prodOnlySchema.parse(rawEnv)
  : {} as Partial<ProdOnlyEnv>;

// Export the combined, typed environment object
export const env = {
  ...base,
  ...prod,
} as BaseEnv & Partial<ProdOnlyEnv>;

// Helper functions for environment checks
export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

// Helper for feature flags and tier-specific features
export const features = {
  redis: Boolean(prod.REDIS_URL),
  stripe: Boolean(prod.STRIPE_SECRET_KEY),
  hasAllProdConfig: isProd && Boolean(prod.REDIS_URL && prod.STRIPE_SECRET_KEY),
} as const;

// Subscription tiers configuration
export const subscriptionTiers = {
  TIER1: {
    price: env.TIER1_PRICE,
    model: env.OPENAI_MODEL_TIER1,
    stripeId: isProd ? prod.STRIPE_PRICE_ID_TIER1 : undefined,
  },
  TIER2: {
    price: env.TIER2_PRICE,
    model: env.OPENAI_MODEL_TIER2,
    stripeId: isProd ? prod.STRIPE_PRICE_ID_TIER2 : undefined,
  },
  TIER3: {
    price: env.TIER3_PRICE,
    model: env.OPENAI_MODEL_TIER3,
    stripeId: isProd ? prod.STRIPE_PRICE_ID_TIER3 : undefined,
  },
} as const;

// Shopify configuration
export const shopify = {
  apiKey: env.SHOPIFY_API_KEY,
  apiSecret: env.SHOPIFY_API_SECRET,
  appUrl: env.SHOPIFY_APP_URL,
  authCallbackUrl: env.SHOPIFY_AUTH_CALLBACK_URL,
  scopes: env.SHOPIFY_APP_SCOPES.split(","),
} as const;

// Provide dev defaults for empty strings and assign to process.env in dev
if (isDev) {
  env.NODE_ENV = "development";
  env.REDIS_URL = env.REDIS_URL || "redis://localhost:6379";
  env.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY || "sk_test_4000000000000000";
  env.SHOPIFY_API_KEY = env.SHOPIFY_API_KEY || "test_key";
  env.SHOPIFY_API_SECRET = env.SHOPIFY_API_SECRET || "test_secret";
  env.SHOPIFY_APP_URL = env.SHOPIFY_APP_URL || "http://localhost:3000";
  env.SHOPIFY_AUTH_CALLBACK_URL = env.SHOPIFY_AUTH_CALLBACK_URL || "http://localhost:3000/auth/callback";
  env.SHOPIFY_APP_SCOPES = env.SHOPIFY_APP_SCOPES || "read_products,write_products";
}

// Sync back to process.env so downstream libs (Shopify) pick them up
process.env.SHOPIFY_API_KEY = env.SHOPIFY_API_KEY;
process.env.SHOPIFY_API_SECRET = env.SHOPIFY_API_SECRET;
process.env.SHOPIFY_APP_URL = env.SHOPIFY_APP_URL;
process.env.SHOPIFY_AUTH_CALLBACK_URL = env.SHOPIFY_AUTH_CALLBACK_URL;
process.env.SHOPIFY_APP_SCOPES = env.SHOPIFY_APP_SCOPES; 
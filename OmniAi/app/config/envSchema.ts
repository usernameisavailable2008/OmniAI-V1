import { z } from "zod";

export const baseEnvSchema = z.object({
  // Shopify Configuration (optional in development)
  SHOPIFY_API_KEY: z.string().default("demo-key"),
  SHOPIFY_API_SECRET: z.string().default("demo-secret"),
  SHOPIFY_APP_URL: z.string().default("http://localhost:3000"),
  SHOPIFY_AUTH_CALLBACK_URL: z.string().default("http://localhost:3000/auth/callback"),
  SHOPIFY_APP_SCOPES: z.string().default("read_products,write_products"),

  // OpenAI Configuration (optional in development)
  OPENAI_API_KEY: z.string().default("demo-key"),
  OPENAI_MODEL_TIER1: z.string().default("gpt-3.5-turbo"),
  OPENAI_MODEL_TIER2: z.string().default("gpt-4"),
  OPENAI_MODEL_TIER3: z.string().default("gpt-4"),

  // Session Configuration
  SESSION_SECRET: z.string().default("demo-session-secret-for-development-only"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Subscription Pricing
  TIER1_PRICE: z.coerce.number().default(85),
  TIER2_PRICE: z.coerce.number().default(170),
  TIER3_PRICE: z.coerce.number().default(299),
});

export const prodOnlySchema = z.object({
  // Redis Configuration
  REDIS_URL: z.string().url("Redis URL must be a valid URL"),

  // Stripe Configuration
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe Secret Key is required in production"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe Webhook Secret is required in production"),
  STRIPE_PRICE_ID_TIER1: z.string().min(1, "Stripe Price ID for Tier 1 is required in production"),
  STRIPE_PRICE_ID_TIER2: z.string().min(1, "Stripe Price ID for Tier 2 is required in production"),
  STRIPE_PRICE_ID_TIER3: z.string().min(1, "Stripe Price ID for Tier 3 is required in production"),
});

// Type for base environment variables
export type BaseEnv = z.infer<typeof baseEnvSchema>;

// Type for production-only environment variables
export type ProdOnlyEnv = z.infer<typeof prodOnlySchema>;

// Type for all environment variables
export type Env = BaseEnv & Partial<ProdOnlyEnv>; 
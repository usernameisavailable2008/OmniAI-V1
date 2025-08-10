import { env, isDev, isProd, isTest, subscriptionTiers, features } from "~/utils/env.server";

// Single-source environment exports – forwarded to utils/env.server
export { env, isDev as isDevelopment, isProd as isProduction, isTest, subscriptionTiers, features };

// Preserve original named export used elsewhere
export const shopifyScopes = env.SHOPIFY_APP_SCOPES.split(','); 
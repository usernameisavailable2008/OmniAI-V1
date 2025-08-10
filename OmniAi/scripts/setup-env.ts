import { randomBytes } from 'crypto';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const envPath = join(process.cwd(), '.env');

if (existsSync(envPath)) {
  console.log('.env file already exists. Skipping creation.');
  process.exit(0);
}

// Generate a secure session secret
const sessionSecret = randomBytes(32).toString('base64');

// Default environment configuration
const envConfig = `# Shopify App Configuration
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_APP_URL=http://localhost:3000
SHOPIFY_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
SHOPIFY_APP_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_themes,write_themes

# OpenAI Configuration
OPENAI_API_KEY=
OPENAI_MODEL_TIER1=gpt-3.5-turbo
OPENAI_MODEL_TIER2=gpt-4
OPENAI_MODEL_TIER3=gpt-4

# Session and Security
SESSION_SECRET=${sessionSecret}
NODE_ENV=development

# Subscription Tiers (in euros)
TIER1_PRICE=85
TIER2_PRICE=170
TIER3_PRICE=299

# Stripe Configuration
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_TIER1=
STRIPE_PRICE_ID_TIER2=
STRIPE_PRICE_ID_TIER3=

# Logging and Monitoring
LOG_LEVEL=debug
`;

// Write the .env file
writeFileSync(envPath, envConfig);

console.log('Created .env file with default configuration.');
console.log('\nNext steps:');
console.log('1. Fill in your Shopify API credentials');
console.log('2. Add your OpenAI API key');
console.log('3. Configure Stripe for subscription management');
console.log('\nRun "npm run dev" to start the development server'); 
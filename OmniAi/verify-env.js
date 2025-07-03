import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
console.log('Raw .env file content:');
console.log(envContent.replace(/([a-zA-Z0-9_-]+=)(.+)/g, '$1[HIDDEN]'));

const requiredEnvVars = {
  SHOPIFY_API_KEY: {
    required: true,
    validate: (val) => val.length > 0
  },
  SHOPIFY_API_SECRET: {
    required: true,
    validate: (val) => val.length > 0
  },
  SHOPIFY_APP_URL: {
    required: true,
    validate: (val) => val.startsWith('http')
  },
  SHOPIFY_AUTH_CALLBACK_URL: {
    required: true,
    validate: (val) => val.includes('/auth/callback')
  },
  OPENAI_API_KEY: {
    required: true,
    validate: (val) => val.startsWith('sk-')
  },
  SESSION_SECRET: {
    required: true,
    validate: (val) => val.length >= 32
  },
  NODE_ENV: {
    required: true,
    validate: (val) => ['development', 'production', 'test'].includes(val)
  },
  TIER1_PRICE: {
    required: true,
    validate: (val) => !isNaN(val) && Number(val) > 0
  },
  TIER2_PRICE: {
    required: true,
    validate: (val) => !isNaN(val) && Number(val) > 0
  },
  TIER3_PRICE: {
    required: true,
    validate: (val) => !isNaN(val) && Number(val) > 0
  }
};

function validateEnv() {
  const errors = [];

  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];
    
    if (config.required && !value) {
      errors.push(`Missing required environment variable: ${key}`);
      continue;
    }

    if (value && config.validate && !config.validate(value)) {
      errors.push(`Invalid value for environment variable: ${key}`);
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log('Environment validation passed ✓');
}

validateEnv(); 
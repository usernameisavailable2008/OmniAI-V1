import { baseEnvSchema, prodOnlySchema } from '../app/config/envSchema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to get default value from schema
const getDefaultValue = (schema: any, key: string): string => {
  try {
    const defaultValue = schema.shape[key]._def.defaultValue;
    return defaultValue !== undefined ? String(defaultValue) : '';
  } catch {
    return '';
  }
};

// Generate example content
const generateContent = () => {
  const lines: string[] = [];

  // Add header
  lines.push('# OmniAI Environment Configuration');
  lines.push('# Generated automatically - DO NOT commit this file\n');

  // Base environment variables
  lines.push('# Required in all environments');
  lines.push('# ============================');
  Object.entries(baseEnvSchema.shape).forEach(([key, schema]) => {
    const defaultValue = getDefaultValue(baseEnvSchema, key);
    const comment = schema._def.description || '';
    if (comment) lines.push(`# ${comment}`);
    lines.push(`${key}=${defaultValue}`);
  });
  lines.push('');

  // Production-only variables
  lines.push('# Required in production only');
  lines.push('# =========================');
  Object.entries(prodOnlySchema.shape).forEach(([key, schema]) => {
    const defaultValue = getDefaultValue(prodOnlySchema, key);
    const comment = schema._def.description || '';
    if (comment) lines.push(`# ${comment}`);
    lines.push(`${key}=${defaultValue}`);
  });
  lines.push('');

  // Add helpful comments
  lines.push('# Notes:');
  lines.push('# - Generate SESSION_SECRET using: npm run generate-secret');
  lines.push('# - SHOPIFY_APP_URL and SHOPIFY_AUTH_CALLBACK_URL must be HTTPS in production');
  lines.push('# - Redis is required in production for performance features');
  lines.push('# - Stripe configuration is required in production for billing');

  return lines.join('\n');
};

try {
  const content = generateContent();
  const outputPath = path.resolve(__dirname, '../.env.example');
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log('✅ Generated .env.example successfully');
} catch (error) {
  console.error('❌ Failed to generate .env.example:', error);
  process.exit(1);
} 
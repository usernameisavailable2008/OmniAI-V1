import 'dotenv/config';

console.log('Environment variables loaded:');
console.log('SHOPIFY_API_KEY length:', process.env.SHOPIFY_API_KEY?.length || 0);
console.log('SHOPIFY_API_SECRET length:', process.env.SHOPIFY_API_SECRET?.length || 0);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('SHOPIFY_APP_URL:', process.env.SHOPIFY_APP_URL);
console.log('NODE_ENV:', process.env.NODE_ENV); 
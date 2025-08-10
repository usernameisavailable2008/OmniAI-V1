import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import crypto from 'crypto';
import { env } from '~/config/env.server';

function verifyShopifyHmac(request: Request, rawBody: Buffer): boolean {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  if (!hmacHeader) return false;
  const generated = crypto
    .createHmac('sha256', env.SHOPIFY_API_SECRET)
    .update(rawBody)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(hmacHeader));
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const rawBody = Buffer.from(await request.arrayBuffer());
    if (!verifyShopifyHmac(request, rawBody)) {
      console.warn('Shopify webhook HMAC verification failed');
      return json({ error: 'Invalid HMAC' }, { status: 401 });
    }
    const topic = request.headers.get('x-shopify-topic');
    const shop = request.headers.get('x-shopify-shop-domain');
    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch (e) {
      console.error('Invalid webhook JSON', { shop, topic });
      return json({ error: 'Invalid JSON' }, { status: 400 });
    }
    console.log('Shopify webhook received', { shop, topic, payload });
    // Handle key events
    switch (topic) {
      case 'orders/create':
        // TODO: handle order creation (e.g., log, update DB)
        break;
      case 'products/update':
        // TODO: handle product update
        break;
      case 'app/uninstalled':
        // TODO: cleanup user/shop data
        break;
      case 'customers/delete':
        // TODO: handle customer deletion
        break;
      case 'app/subscriptions/update':
      case 'app/subscriptions/create':
      case 'app/subscriptions/cancelled':
        // TODO: handle billing updates
        break;
      default:
        console.log('Unhandled Shopify webhook topic', { topic });
    }
    return json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook handler error', { error });
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 
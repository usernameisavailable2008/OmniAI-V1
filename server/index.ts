import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { handleAI } from './ai';
import { exchangeShopifyToken, getShopAccessToken } from './shopify';
import * as actions from './shopifyActions';
import billingRoutes from './billing';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.SHOPIFY_APP_URL || `http://localhost:${PORT}`;
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'write_products,read_products';

app.use(cors());
app.use(express.json());

app.use('/api', billingRoutes);

// In-memory state tracking for OAuth (nonce per shop)
const oauthStates: Map<string, string> = new Map();

app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Shopify OAuth start: /auth?shop=your-store.myshopify.com
app.get('/auth', (req: Request, res: Response) => {
  const shop = String(req.query.shop || '').trim();
  if (!shop || !shop.endsWith('.myshopify.com')) {
    return res.status(400).json({ error: 'Missing or invalid shop param' });
  }
  const state = Math.random().toString(36).slice(2);
  oauthStates.set(shop, state);

  const redirectUri = new URL('/auth/callback', APP_URL).toString();
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authUrl.searchParams.set('client_id', process.env.SHOPIFY_API_KEY || '');
  authUrl.searchParams.set('scope', SHOPIFY_SCOPES);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  return res.redirect(authUrl.toString());
});

// Shopify OAuth callback
app.get('/auth/callback', async (req: Request, res: Response) => {
  const shop = String(req.query.shop || '');
  const code = String(req.query.code || '');
  const state = String(req.query.state || '');

  if (!shop || !code || !state) {
    return res.status(400).send('Invalid OAuth callback params');
  }
  const expected = oauthStates.get(shop);
  if (!expected || expected !== state) {
    return res.status(400).send('Invalid OAuth state');
  }

  try {
    await exchangeShopifyToken({ shop, code });
    oauthStates.delete(shop);
    return res.redirect(`${APP_URL}?installed=1&shop=${encodeURIComponent(shop)}`);
  } catch (error) {
    console.error('OAuth exchange failed', error);
    return res.status(500).send('OAuth exchange failed');
  }
});

function detectIntent(prompt: string): 'shopify' | 'ai' {
  const p = prompt.toLowerCase();
  const shopifyKeywords = ['title', 'description', 'price', 'discount', 'product', 'inventory'];
  if (shopifyKeywords.some((k) => p.includes(k))) return 'shopify';
  return 'ai';
}

async function chatHandler(req: Request, res: Response) {
  const { prompt, shop } = req.body as { prompt?: string; shop?: string };
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const intent = detectIntent(prompt);

    if (intent === 'shopify' && shop) {
      const token = getShopAccessToken(shop);
      if (!token) {
        const aiReply = await handleAI(
          `User asked: "${prompt}". Explain that the Shopify store is not connected yet and provide clear steps to connect via the Install button, including the shop domain requirement. Be concise.`
        );
        return res.json({ intent, reply: aiReply, needsAuth: true });
      }

      const aiReply = await handleAI(
        `The user wants to manage Shopify store data with this request: "${prompt}". Reply as a helpful assistant that can take actions once given explicit product IDs/SKUs and the desired changes. Provide a short list of example commands like: \n- Update title for product 123456789 to "New Title"\n- Change price for product 123456789 to 19.99 EUR\n- Create product "Blue T-Shirt" priced 24.99 EUR\nKeep it concise and actionable.`
      );
      return res.json({ intent, reply: aiReply });
    }

    const reply = await handleAI(prompt);
    return res.json({ intent: 'ai', reply });
  } catch (error: any) {
    console.error('/chat error', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}

app.post('/chat', chatHandler);
app.post('/api/chat', chatHandler);

app.post('/shopify/product/title', async (req: Request, res: Response) => {
  const { shop, productId, title } = req.body as { shop?: string; productId?: number; title?: string };
  if (!shop || !productId || !title) return res.status(400).json({ error: 'Missing params' });
  try {
    const result = await actions.updateProductTitle({ shop, productId, title });
    return res.json({ ok: true, result });
  } catch (e: any) {
    console.error('updateProductTitle failed', e);
    return res.status(500).json({ error: 'updateProductTitle failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on ${PORT}`);
});

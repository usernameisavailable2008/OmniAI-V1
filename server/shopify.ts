import axios from 'axios';

// Minimal in-memory token store for MVP
const shopToToken: Map<string, string> = new Map();

export function getShopAccessToken(shop: string): string | undefined {
  return shopToToken.get(shop);
}

export async function exchangeShopifyToken({ shop, code }: { shop: string; code: string }) {
  const clientId = process.env.SHOPIFY_API_KEY || '';
  const clientSecret = process.env.SHOPIFY_API_SECRET || '';
  const redirectUri = `${process.env.SHOPIFY_APP_URL}/auth/callback`;

  const url = `https://${shop}/admin/oauth/access_token`;
  const { data } = await axios.post(url, {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  if (data?.access_token) {
    shopToToken.set(shop, data.access_token);
  }

  return data;
}

export async function shopifyRequest<T = any>({
  shop,
  path,
  method = 'GET',
  body,
}: {
  shop: string;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}): Promise<T> {
  const token = getShopAccessToken(shop);
  if (!token) throw new Error('Missing shop access token');

  const url = `https://${shop}/admin/api/2023-10/${path}`;
  const { data } = await axios.request<T>({
    url,
    method,
    data: body,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
  });
  return data;
}

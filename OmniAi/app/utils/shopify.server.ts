import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { createSessionStorage } from '@remix-run/node';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: [
    'read_products',
    'write_products',
    'read_orders',
    'write_orders',
    'read_customers',
    'write_customers',
    'read_themes',
    'write_themes',
  ],
  hostName: process.env.SHOPIFY_APP_URL!.replace(/https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

const sessionStorage = createSessionStorage({
  cookie: {
    name: 'shopify_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const authenticate = {
  admin: async (request: Request) => {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );

    const shop = session.get('shop');
    const accessToken = session.get('accessToken');

    if (!shop || !accessToken) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const client = new shopify.clients.Rest({
      session: {
        shop,
        accessToken,
      },
    });

    return { admin: client, session };
  },
};

export const authenticateAdmin = authenticate.admin; 
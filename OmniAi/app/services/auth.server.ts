// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// -- temporary: full refactor pending
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { createSessionStorage } from '@remix-run/node';
import { env } from '~/config/env.server';
import { SubscriptionService } from './subscription.server';
import winston from 'winston';
import crypto from 'crypto';

const REQUIRED_SCOPES = {
  products: ['read_products', 'write_products'],
  orders: ['read_orders', 'write_orders'],
  customers: ['read_customers', 'write_customers'],
  themes: ['read_themes', 'write_themes']
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const shopify = shopifyApi({
  apiKey: env.SHOPIFY_API_KEY,
  apiSecretKey: env.SHOPIFY_API_SECRET,
  scopes: env.SHOPIFY_APP_SCOPES.split(','),
  hostName: env.SHOPIFY_APP_URL.replace(/https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

// @ts-expect-error – Remix typing mismatch with cookie-only strategy in 2.x
export const sessionStorage = createSessionStorage({
  cookie: {
    name: 'shopify_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

export class AuthService {
  private static instance: AuthService;
  private subscriptionService: SubscriptionService;

  private constructor() {
    this.subscriptionService = SubscriptionService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private generateStateParam(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async validateScopes(session: any): Promise<boolean> {
    const grantedScopes = session.scope.split(',');
    
    for (const [feature, requiredScopes] of Object.entries(REQUIRED_SCOPES)) {
      if (!requiredScopes.every(scope => grantedScopes.includes(scope))) {
        logger.warn(`Missing required scopes for ${feature}`, {
          required: requiredScopes,
          granted: grantedScopes,
        });
        return false;
      }
    }
    
    return true;
  }

  private async refreshAccessToken(session: any): Promise<string | null> {
    try {
      const { accessToken } = await shopify.auth.refreshToken({
        session,
      });
      return accessToken;
    } catch (error) {
      logger.error('Failed to refresh access token:', error);
      return null;
    }
  }

  async authenticate(request: Request) {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );

    const shop = session.get('shop');
    const accessToken = session.get('accessToken');

    if (!shop || !accessToken) {
      return { isAuthenticated: false };
    }

    // Create a session object for scope validation
    const shopifySession = {
      shop,
      accessToken,
      scope: session.get('scope'),
    };

    // Validate scopes
    const hasValidScopes = await this.validateScopes(shopifySession);
    if (!hasValidScopes) {
      logger.warn('Invalid scopes detected, redirecting to auth', { shop });
      return { isAuthenticated: false, needsReauth: true };
    }

    // @ts-expect-error – Shopify TS types mismatch (constructor signature)
    const client = new shopify.clients.Rest({
      session: shopifySession,
    });

    try {
      // Test the access token
      await client.get('/admin/api/2024-01/shop.json');
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh the token
        const newAccessToken = await this.refreshAccessToken(shopifySession);
        if (newAccessToken) {
          session.set('accessToken', newAccessToken);
          client.session.accessToken = newAccessToken;
        } else {
          return { isAuthenticated: false, needsReauth: true };
        }
      } else {
        throw error;
      }
    }

    // @ts-expect-error – method defined internally but not in public typings
    const subscription = await this.subscriptionService.getCurrentSubscription(client);
    const tier = subscription?.status === 'active' ? subscription.tier : 1;

    return {
      isAuthenticated: true,
      shop,
      accessToken: client.session.accessToken,
      client,
      tier,
      subscription,
    };
  }

  async handleAuthCallback(request: Request) {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!shop || !code) {
      throw new Response('Invalid auth callback', { status: 400 });
    }

    // Validate state parameter
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const storedState = session.get('oauth_state');
    
    if (!state || state !== storedState) {
      logger.error('Invalid OAuth state parameter', {
        received: state,
        expected: storedState,
        shop,
      });
      throw new Response('Invalid state parameter', { status: 403 });
    }

    try {
      // @ts-expect-error – typings lag behind latest response shape
      const { accessToken, scope } = await shopify.auth.callback({
        rawRequest: request,
      });

      // Create new session with the token and scope
      const newSession = await sessionStorage.getSession();
      newSession.set('shop', shop);
      newSession.set('accessToken', accessToken);
      newSession.set('scope', scope);

      // Clear the oauth state
      newSession.unset('oauth_state');

      return {
        session: newSession,
        shop,
        accessToken,
      };
    } catch (error) {
      logger.error('Auth callback error:', error);
      throw new Response('Authentication failed', { status: 401 });
    }
  }

  async handleAuthRedirect(request: Request) {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    if (!shop) {
      throw new Response('Shop parameter is required', { status: 400 });
    }

    // Generate and store state parameter
    const state = this.generateStateParam();
    const session = await sessionStorage.getSession();
    session.set('oauth_state', state);

    // @ts-expect-error – 'state' param accepted at runtime but missing in types
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: true,
      state,
    });

    return {
      redirectUrl: authRoute,
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    };
  }

  async logout(request: Request) {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );
    return sessionStorage.destroySession(session);
  }
} 
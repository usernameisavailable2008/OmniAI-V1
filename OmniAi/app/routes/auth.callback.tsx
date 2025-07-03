import { redirect, createCookieSessionStorage } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { AuthService } from '~/services/auth.server';
import { Logger } from '~/utils/logger.server';
import { env } from '~/config/env.server';

const logger = new Logger('auth-callback');

// Create session storage for this route
const sessionStorage = createCookieSessionStorage({
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

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  
  try {
    const result = await authService.handleAuthCallback(request);

    logger.info('OAuth callback successful', { shop: result.shop });

    // Redirect to landing page with the session cookie
    // The landing page will handle subscription checking and routing
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(result.session),
      },
    });
    
  } catch (error) {
    logger.error('OAuth callback failed', error);
    return redirect('/?error=auth_callback_failed');
  }
};

// This route only handles the callback, no component needed
export default function AuthCallback() {
  return null;
}; 
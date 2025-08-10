import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { AuthService } from "~/services/auth.server";
import { Logger } from "~/utils/logger.server";

const logger = new Logger('auth-route');

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    
    if (!shop) {
      logger.error('No shop parameter provided in auth request');
      return redirect('/?error=missing_shop');
    }

    // Validate shop domain format
    if (!shop.includes('.myshopify.com') && !shop.includes('.shopify.com')) {
      logger.error('Invalid shop domain format', { shop });
      return redirect('/?error=invalid_shop');
    }

    logger.info('Initiating OAuth flow', { shop });

    // Generate OAuth URL and redirect to Shopify
    const authResult = await authService.handleAuthRedirect(request);
    
    return redirect(authResult.redirectUrl, {
      headers: authResult.headers,
    });
    
  } catch (error) {
    logger.error('Auth initiation failed', error);
    return redirect('/?error=auth_failed');
  }
};

// This route only handles redirects, no component needed
export default function Auth() {
  return null;
} 
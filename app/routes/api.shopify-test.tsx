import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { AuthService } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  const auth = await authService.authenticate(request);

  if (!auth.isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Test Shopify API connection
    const response = await auth.client.get('/admin/api/2024-01/shop.json');
    
    return json({
      status: 'success',
      shop: response.shop,
      message: 'Successfully connected to Shopify API'
    });
  } catch (error) {
    console.error('Shopify API test error:', { error: error.message });
    return json({
      status: 'error',
      error: 'Failed to connect to Shopify API',
      details: error.message
    }, { status: 500 });
  }
}; 
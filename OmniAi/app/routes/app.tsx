import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { AuthService } from '~/services/auth.server';
import { BillingService } from '~/services/billing.server';
import Chatbot from '~/components/Chatbot';

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  const billingService = BillingService.getInstance();
  
  const auth = await authService.authenticate(request);

  if (!auth.isAuthenticated) {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    if (!shop) {
      return redirect('/auth/login');
    }
    return redirect(`/auth/login?shop=${shop}`);
  }

  // Check subscription status using billing service
  const subscription = await billingService.getUserSubscription(request);
  
  if (!subscription || subscription.status !== 'active') {
    // Redirect to landing page for subscription selection
    return redirect('/');
  }

  // Get initial command from URL if provided
  const url = new URL(request.url);
  const initialCommand = url.searchParams.get('command');

  return json({
    isAuthenticated: true,
    shop: auth.shop,
    tier: subscription.planId,
    subscription: subscription,
    needsSubscription: false,
    initialCommand,
  });
};

export default function App() {
  const { isAuthenticated, shop, tier, subscription, needsSubscription, initialCommand } = useLoaderData<typeof loader>();

  if (!isAuthenticated) {
    return null; // Will be redirected by the loader
  }

  if (needsSubscription) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Subscription Required</h2>
        <p>Please subscribe to continue using OmniAI.</p>
        <a 
          href={`/subscribe?shop=${shop}`}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #d77cf0, #7aa2ff)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            marginTop: '1rem'
          }}
        >
          Subscribe Now
        </a>
      </div>
    );
  }

  return <Chatbot initialCommand={initialCommand} />;
} 
import * as React from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { AuthService } from '~/services/auth.server';
import { SubscriptionService } from '~/services/subscription.server';
import { Page } from '@shopify/polaris';

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  const auth = await authService.authenticate(request);

  if (!auth.isAuthenticated) {
    return redirect('/auth/login');
  }

  const subscriptionService = SubscriptionService.getInstance();
  const plans = subscriptionService.getAllPlans();

  return json({
    shop: auth.shop,
    currentSubscription: auth.subscription,
    plans,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  const auth = await authService.authenticate(request);

  if (!auth.isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const tier = parseInt(formData.get('tier') as string);

  if (!tier || tier < 1 || tier > 3) {
    return json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const subscriptionService = SubscriptionService.getInstance();
    const subscription = await subscriptionService.createSubscription(tier);

    // Redirect to Shopify's billing page
    return redirect(subscription.confirmation_url);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return json({ error: 'Failed to create subscription' }, { status: 500 });
  }
};

const plans = [
  {
    tier: 1,
    name: 'Tier 1',
    price: 85,
    features: [
      'GPT-3.5 access',
      'Basic edits',
      'No store builds',
      // 'No DSers imports', // DSers removed
    ],
  },
  {
    tier: 2,
    name: 'Tier 2',
    price: 170,
    features: [
      'GPT-4o access',
      'Full product edits',
      '1 store build / month',
      // '1 DSers import / month', // DSers removed
    ],
  },
  {
    tier: 3,
    name: 'Tier 3',
    price: 299,
    features: [
      'GPT-4o access',
      'Advanced tools',
      '5 store builds / month',
      // '3 DSers imports / month', // DSers removed
    ],
  },
];

export default function Pricing() {
  const { shop, currentSubscription, plans } = useLoaderData<typeof loader>();
  const [selected, setSelected] = React.useState(currentSubscription?.tier || 2);
  const [loading, setLoading] = React.useState(false);
  const submit = useSubmit();

  // Handle plan selection
  const handleSelect = (tier: number) => setSelected(tier);

  // Handle Choose Plan: submit to backend action
  const handleChoose = (tier: number) => {
    setSelected(tier);
    setLoading(true);
    const formData = new FormData();
    formData.append('tier', tier.toString());
    submit(formData, { method: 'post' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #3f2287 0%, #0f0c26 60%)', color: '#fff', padding: '40px 12px' }}>
      <div className="wrapper" style={{ maxWidth: 960, width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="logo" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <svg viewBox="0 0 512 512" style={{ width: 32, height: 32, fill: 'url(#grad)' }}><path d="M256 0 329 182 512 256 329 330 256 512 183 330 0 256 183 182Z" /></svg>
          <span style={{ fontSize: '1.75rem', fontWeight: 600 }}>OmniAI</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 600, lineHeight: 1.2, marginBottom: 48 }}>
          Select a plan that's<br />right for you
        </h1>
        {/* Pricing cards */}
        <div className="plans" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 28 }}>
          {plans.map((plan: any) => (
            <section
              key={plan.tier}
              className={`card${selected === plan.tier ? ' selected' : ''}`}
              data-tier={plan.name}
              style={{
                position: 'relative',
                padding: selected === plan.tier ? '36px 28px 96px' : '36px 28px 96px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.02)',
                border: selected === plan.tier ? '1px solid transparent' : '1px solid rgba(255,255,255,0.12)',
                borderImage: selected === plan.tier ? 'linear-gradient(135deg,#d946ef,#6366f1) 1' : undefined,
                boxShadow: selected === plan.tier ? '0 0 12px rgba(152, 87, 255, .8), 0 0 24px rgba(152, 87, 255, .5)' : undefined,
                overflow: 'hidden',
                transition: 'border .25s, box-shadow .25s',
                cursor: 'pointer',
              }}
              onClick={() => handleSelect(plan.tier)}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 12 }}>{plan.name}</h2>
              <p className="price" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 4 }}>€{plan.price}</p>
              <p className="cycle" style={{ fontSize: '.9rem', color: '#c2c2d5', marginBottom: 24 }}>/month</p>
              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '.95rem', marginBottom: 40, color: '#c2c2d5' }}>
                {plan.features.map((f: string, i: number) => (
                  <li key={i} style={{ position: 'relative' }}>
                    <span style={{ color: '#d946ef', marginRight: 8 }}>•</span>{f}
                  </li>
                ))}
              </ul>
              <button
                className="btn"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 32,
                  transform: 'translateX(-50%)',
                  width: '70%',
                  padding: '12px 0',
                  borderRadius: 10,
                  background: selected === plan.tier ? 'linear-gradient(135deg,#d946ef,#6366f1)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background .2s, box-shadow .2s',
                  boxShadow: selected === plan.tier ? '0 1px 6px rgba(0,0,0,.25)' : undefined,
                  opacity: loading && selected === plan.tier ? 0.7 : 1,
                }}
                onClick={e => { e.stopPropagation(); handleChoose(plan.tier); }}
                disabled={loading || currentSubscription?.tier === plan.tier}
              >
                {currentSubscription?.tier === plan.tier ? 'Current Plan' : loading && selected === plan.tier ? 'Redirecting...' : 'Choose Plan'}
              </button>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
} 
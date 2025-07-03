import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { AuthService } from "~/services/auth.server";
import { BillingService, BILLING_PLANS } from "~/services/billing.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Subscribe to OmniAI" },
    { name: "description", content: "Choose your plan and start automating your Shopify store" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  
  try {
    const auth = await authService.authenticate(request);
    
    if (!auth.isAuthenticated) {
      return redirect('/auth/login');
    }

    const url = new URL(request.url);
    const selectedPlanId = url.searchParams.get('planId') || 'scale';
    
    return json({
      shop: auth.shop,
      selectedPlanId,
      tiers: Object.values(BILLING_PLANS),
    });
  } catch (error) {
    return redirect('/auth/login');
  }
};

export const action: ActionFunction = async ({ request }) => {
  const authService = AuthService.getInstance();
  const billingService = BillingService.getInstance();
  
  try {
    const auth = await authService.authenticate(request);
    
    if (!auth.isAuthenticated) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const planId = formData.get('planId') as string;
    
    if (!planId || !BILLING_PLANS[planId]) {
      return json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Create subscription and get confirmation URL
    const confirmationUrl = await billingService.createSubscription(request, planId);
    
    // Redirect to Shopify billing confirmation
    return redirect(confirmationUrl);
    
  } catch (error) {
    return json({ error: 'Failed to create subscription' }, { status: 500 });
  }
};

export default function Subscribe() {
  const { shop, selectedPlanId, tiers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [currentPlanId, setCurrentPlanId] = useState(selectedPlanId);

  return (
    <div className="subscribe-page">
      <style>{`
        .subscribe-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fcd8ff, #d0e5ff);
          font-family: 'Poppins', sans-serif;
          padding: 2rem 1rem;
        }
        
        .subscribe-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .subscribe-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .subscribe-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 1rem;
        }
        
        .subscribe-subtitle {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
        }
        
        .shop-info {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .shop-info h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .shop-info p {
          color: #666;
          margin: 0;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .pricing-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 3px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
        }
        
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }
        
        .pricing-card.selected {
          border-color: #d77cf0;
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(215, 124, 240, 0.2);
        }
        
        .pricing-card.popular {
          transform: scale(1.05);
        }
        
        .pricing-card.popular::after {
          content: 'Most Popular';
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          padding: 0.5rem 3rem;
          font-size: 0.8rem;
          font-weight: 600;
          transform: rotate(45deg);
        }
        
        .pricing-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .pricing-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .pricing-price {
          font-size: 2rem;
          font-weight: 600;
          color: #d77cf0;
          margin-bottom: 0.5rem;
        }
        
        .pricing-period {
          color: #666;
          font-size: 0.9rem;
        }
        
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }
        
        .pricing-features li {
          padding: 0.5rem 0;
          color: #555;
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.95rem;
        }
        
        .pricing-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #d77cf0;
          font-weight: 600;
        }
        
        .subscribe-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .subscribe-button {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          padding: 1rem 2rem;
          border-radius: 999px;
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          max-width: 300px;
        }
        
        .subscribe-button:hover {
          background: linear-gradient(135deg, #c357e6, #6499ff);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(215, 124, 240, 0.3);
        }
        
        .subscribe-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .back-button {
          background: transparent;
          color: #666;
          border: 2px solid #ddd;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 1rem;
        }
        
        .back-button:hover {
          border-color: #d77cf0;
          color: #d77cf0;
        }
        
        @media (max-width: 768px) {
          .subscribe-title {
            font-size: 2rem;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-card.popular {
            transform: none;
          }
        }
      `}</style>

      <div className="subscribe-container">
        <div className="subscribe-header">
          <h1 className="subscribe-title">Choose Your Plan</h1>
          <p className="subscribe-subtitle">
            Select the perfect plan for your Shopify automation needs
          </p>
        </div>

        <div className="shop-info">
          <h3>Store: {shop}</h3>
          <p>Ready to supercharge your Shopify store with AI automation</p>
        </div>

        {actionData?.error && (
          <div className="error-message">
            {actionData.error}
          </div>
        )}

        <div className="pricing-grid">
          {tiers.map((tier: any) => (
            <div
              key={tier.id}
              className={`pricing-card ${tier.id === 'scale' ? 'popular' : ''} ${
                currentPlanId === tier.id ? 'selected' : ''
              }`}
              onClick={() => setCurrentPlanId(tier.id)}
            >
              <div className="pricing-header">
                <div className="pricing-name">{tier.name}</div>
                <div className="pricing-price">€{tier.price}</div>
                <div className="pricing-period">per month</div>
              </div>
              
              <ul className="pricing-features">
                {tier.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="subscribe-form">
          <Form method="post">
            <input type="hidden" name="planId" value={currentPlanId} />
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate('/')}
            >
              ← Back
            </button>
            <button type="submit" className="subscribe-button">
              Subscribe to {BILLING_PLANS[currentPlanId]?.name} Plan
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
} 
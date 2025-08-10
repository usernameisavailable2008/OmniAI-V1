import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { BillingService } from "~/services/billing.server";
import { Logger } from "~/utils/logger.server";

const logger = new Logger('billing-callback');

export const loader: LoaderFunction = async ({ request }) => {
  const billingService = BillingService.getInstance();
  
  try {
    const url = new URL(request.url);
    const chargeId = url.searchParams.get('charge_id');
    
    if (!chargeId) {
      logger.error('No charge_id provided in billing callback');
      return redirect('/?error=billing_failed');
    }

    // Activate the subscription
    const success = await billingService.activateSubscription(request, chargeId);
    
    if (!success) {
      logger.error('Failed to activate subscription', { chargeId });
      return redirect('/?error=activation_failed');
    }

    // Verify the subscription is now active
    const subscription = await billingService.getUserSubscription(request);
    
    if (!subscription || subscription.status !== 'active') {
      logger.error('Subscription not active after activation', { chargeId });
      return redirect('/?error=subscription_not_active');
    }

    logger.info('Billing callback successful', { 
      chargeId, 
      planId: subscription.planId,
      subscriptionId: subscription.id 
    });

    // Redirect to app with success message
    return redirect('/app?subscribed=true');
    
  } catch (error) {
    logger.error('Billing callback error', error);
    return redirect('/?error=billing_callback_failed');
  }
};

// This route only handles the callback, no component needed
export default function BillingCallback() {
  return null;
} 
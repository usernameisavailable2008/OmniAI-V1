import { Logger } from '~/utils/logger.server';
import { env } from '~/config/env.server';
import { AuthService } from './auth.server';

const logger = new Logger('billing-service');

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  messageLimit: number;
  storeLimit: number;
  model: string;
  returnUrl: string;
}

export const BILLING_PLANS: Record<string, BillingPlan> = {
  'launch': {
    id: 'launch',
    name: 'Launch',
    price: 85,
    currency: 'EUR',
    features: [
      '100 AI messages per month',
      'GPT-3.5 powered automation',
      'Basic product management',
      'Order processing',
      'Email support'
    ],
    messageLimit: 100,
    storeLimit: 1,
    model: 'gpt-3.5-turbo',
    returnUrl: `${env.SHOPIFY_APP_URL}/billing/callback`
  },
  'scale': {
    id: 'scale',
    name: 'Scale',
    price: 170,
    currency: 'EUR',
    features: [
      '400 AI messages per month',
      'GPT-4o powered automation',
      'Advanced store management',
      'Theme customization',
      '2 connected stores',
      'Priority support'
    ],
    messageLimit: 400,
    storeLimit: 2,
    model: 'gpt-4o',
    returnUrl: `${env.SHOPIFY_APP_URL}/billing/callback`
  },
  'dominate': {
    id: 'dominate',
    name: 'Dominate',
    price: 299,
    currency: 'EUR',
    features: [
      '1000 AI messages per month',
      'GPT-4o powered automation',
      'Full store builds',
      'Custom integrations',
      '5 connected stores',
      'Dedicated support'
    ],
    messageLimit: 1000,
    storeLimit: 5,
    model: 'gpt-4o',
    returnUrl: `${env.SHOPIFY_APP_URL}/billing/callback`
  }
};

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  messagesUsed: number;
  plan: BillingPlan;
}

export class BillingService {
  private static instance: BillingService;
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  /**
   * Create a new subscription using Shopify's billing API
   */
  async createSubscription(request: Request, planId: string): Promise<string> {
    try {
      const plan = BILLING_PLANS[planId];
      if (!plan) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      const auth = await this.authService.authenticate(request);
      if (!auth.isAuthenticated || !auth.client) {
        throw new Error('User not authenticated');
      }

      logger.info('Creating subscription', { shop: auth.shop, planId });

      // Create recurring application charge
      const charge = {
        recurring_application_charge: {
          name: `OmniAI ${plan.name}`,
          price: plan.price,
          return_url: plan.returnUrl,
          test: env.NODE_ENV !== 'production'
        }
      };

      const response = await auth.client.post({
        path: '/admin/api/2024-01/recurring_application_charges.json',
        data: charge
      });
      
      const body = response.body as any;
      if (!body || !body.recurring_application_charge) {
        throw new Error('Failed to create subscription');
      }

      const confirmationUrl = body.recurring_application_charge.confirmation_url;
      if (!confirmationUrl) {
        throw new Error('No confirmation URL returned from Shopify');
      }

              logger.info('Subscription created successfully', {
          shop: auth.shop,
          planId,
          chargeId: body.recurring_application_charge.id,
          confirmationUrl
        });

      return confirmationUrl;

    } catch (error) {
      logger.error('Failed to create subscription', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription status
   */
  async getUserSubscription(request: Request): Promise<UserSubscription | null> {
    try {
      const auth = await this.authService.authenticate(request);
      if (!auth.isAuthenticated || !auth.client) {
        return null;
      }

      const response = await auth.client.get({
        path: '/admin/api/2024-01/recurring_application_charges.json'
      });
      
      const body = response.body as any;
      if (!body || !body.recurring_application_charges) {
        return null;
      }

      const charges = body.recurring_application_charges;
      const activeCharge = charges.find((charge: any) => charge.status === 'active');

      if (!activeCharge) {
        logger.info('No active subscription found', { shop: auth.shop });
        return null;
      }

      // Match price to plan
      let planId = 'launch';
      if (activeCharge.price === '170.00') planId = 'scale';
      else if (activeCharge.price === '299.00') planId = 'dominate';

      const plan = BILLING_PLANS[planId];
      const messagesUsed = 0; // Would be retrieved from database

      const userSubscription: UserSubscription = {
        id: activeCharge.id.toString(),
        planId,
        status: activeCharge.status,
        currentPeriodStart: new Date(activeCharge.created_at),
        currentPeriodEnd: new Date(activeCharge.billing_on || Date.now() + 30 * 24 * 60 * 60 * 1000),
        messagesUsed,
        plan
      };

      logger.info('Retrieved user subscription', { shop: auth.shop, subscription: userSubscription });
      return userSubscription;

    } catch (error) {
      logger.error('Failed to get user subscription', error);
      return null;
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasAccess(request: Request, requiredPlan?: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(request);
      
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      if (requiredPlan) {
        const planHierarchy = { launch: 1, scale: 2, dominate: 3 };
        const userPlanLevel = planHierarchy[subscription.planId as keyof typeof planHierarchy] || 0;
        const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;
        
        return userPlanLevel >= requiredPlanLevel;
      }

      return true;
    } catch (error) {
      logger.error('Failed to check access', error, { requiredPlan });
      return false;
    }
  }

  /**
   * Check if user can send more messages
   */
  async canSendMessage(request: Request): Promise<{ canSend: boolean; remaining: number; limit: number }> {
    try {
      const subscription = await this.getUserSubscription(request);
      
      if (!subscription || subscription.status !== 'active') {
        return { canSend: false, remaining: 0, limit: 0 };
      }

      const remaining = Math.max(0, subscription.plan.messageLimit - subscription.messagesUsed);
      const canSend = remaining > 0;

      return {
        canSend,
        remaining,
        limit: subscription.plan.messageLimit
      };
    } catch (error) {
      logger.error('Failed to check message limit', error);
      return { canSend: false, remaining: 0, limit: 0 };
    }
  }

  /**
   * Activate subscription after user approval
   */
  async activateSubscription(request: Request, chargeId: string): Promise<boolean> {
    try {
      const auth = await this.authService.authenticate(request);
      if (!auth.isAuthenticated || !auth.client) {
        throw new Error('User not authenticated');
      }

      const response = await auth.client.post({
        path: `/admin/api/2024-01/recurring_application_charges/${chargeId}/activate.json`,
        data: {}
      });
      
      const body = response.body as any;
      if (!body || !body.recurring_application_charge) {
        throw new Error('Failed to activate subscription');
      }

      logger.info('Subscription activated successfully', { shop: auth.shop, chargeId });
      return true;

    } catch (error) {
      logger.error('Failed to activate subscription', error);
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(request: Request, chargeId: string): Promise<boolean> {
    try {
      const auth = await this.authService.authenticate(request);
      if (!auth.isAuthenticated || !auth.client) {
        throw new Error('User not authenticated');
      }

      await auth.client.delete({
        path: `/admin/api/2024-01/recurring_application_charges/${chargeId}.json`
      });
      
      logger.info('Subscription cancelled successfully', { shop: auth.shop, chargeId });
      return true;

    } catch (error) {
      logger.error('Failed to cancel subscription', error);
      return false;
    }
  }

  /**
   * Get all available plans
   */
  getPlans(): BillingPlan[] {
    return Object.values(BILLING_PLANS);
  }

  /**
   * Get specific plan by ID
   */
  getPlan(planId: string): BillingPlan | null {
    return BILLING_PLANS[planId] || null;
  }
} 
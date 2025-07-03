import { Logger } from '~/utils/logger.server';

const logger = new Logger('subscription-service');

export interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  currency: string;
  features: string[];
  messageLimit: number;
  storeLimit: number;
  model: string;
}

export const SUBSCRIPTION_TIERS: Record<number, SubscriptionTier> = {
  1: {
    id: 1,
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
    model: 'gpt-3.5-turbo'
  },
  2: {
    id: 2,
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
    model: 'gpt-4o'
  },
  3: {
    id: 3,
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
    model: 'gpt-4o'
  }
};

export class SubscriptionService {
  private static instance: SubscriptionService;

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async createSubscription(shopId: string, tier: number): Promise<any> {
    try {
      const tierInfo = SUBSCRIPTION_TIERS[tier];
      if (!tierInfo) {
        throw new Error('Invalid tier selected');
      }

      // For now, simulate subscription creation
      // In a real implementation, this would integrate with Shopify billing API
      const subscription = {
        id: `sub_${Date.now()}`,
        shopId,
        tier,
        price: tierInfo.price,
        currency: tierInfo.currency,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      logger.info('Subscription created', { shopId, tier, subscription });
      return subscription;

    } catch (error) {
      logger.error('Failed to create subscription', { error, shopId, tier });
      throw error;
    }
  }

  async getSubscription(shopId: string): Promise<any> {
    try {
      // For now, simulate getting subscription from storage
      // In a real implementation, this would query the database
      logger.info('Getting subscription', { shopId });
      return null; // No active subscription found
    } catch (error) {
      logger.error('Failed to get subscription', { error, shopId });
      return null;
    }
  }

  async checkMessageLimit(shopId: string): Promise<{ canSend: boolean; remaining: number; limit: number }> {
    try {
      const subscription = await this.getSubscription(shopId);
      if (!subscription) {
        return { canSend: false, remaining: 0, limit: 0 };
      }

      const tierInfo = SUBSCRIPTION_TIERS[subscription.tier];
      if (!tierInfo) {
        return { canSend: false, remaining: 0, limit: 0 };
      }

      // For now, simulate message count
      const messageCount = 0;
      const remaining = Math.max(0, tierInfo.messageLimit - messageCount);
      const canSend = remaining > 0;

      return { canSend, remaining, limit: tierInfo.messageLimit };
    } catch (error) {
      logger.error('Failed to check message limit', { error, shopId });
      return { canSend: false, remaining: 0, limit: 0 };
    }
  }

  getTierInfo(tier: number): SubscriptionTier | null {
    return SUBSCRIPTION_TIERS[tier] || null;
  }

  getAllTiers(): SubscriptionTier[] {
    return Object.values(SUBSCRIPTION_TIERS);
  }
} 
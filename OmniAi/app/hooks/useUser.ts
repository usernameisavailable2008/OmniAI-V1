import { useRouteLoaderData } from "@remix-run/react";

export const TIER_FEATURES = {
  TIER1: {
    name: "Basic",
    model: "gpt-3.5-turbo",
    maxTokens: 1000,
    features: ["Basic product updates", "Simple automations", "Standard support"],
  },
  TIER2: {
    name: "Pro",
    model: "gpt-4",
    maxTokens: 2000,
    features: ["Advanced store building", "Custom themes", "Priority support"],
  },
  TIER3: {
    name: "Enterprise",
    model: "gpt-4-turbo-preview",
    maxTokens: 4000,
    features: ["Full store automation", "Custom integrations", "24/7 support"],
  },
} as const;

export interface User {
  id: string;
  name: string;
  email: string;
  tier: 1 | 2 | 3;
  shopId?: string;
}

export function useUser() {
  const data = useRouteLoaderData("root") as { user: User };
  const user = data?.user;

  if (!user) {
    throw new Error("User not found in route data");
  }

  return {
    ...user,
    // Tier helpers
    isTier2: () => user.tier >= 2,
    isTier3: () => user.tier === 3,
    getTierFeatures: () => {
      switch (user.tier) {
        case 3:
          return TIER_FEATURES.TIER3;
        case 2:
          return TIER_FEATURES.TIER2;
        default:
          return TIER_FEATURES.TIER1;
      }
    },
    // Feature access helpers
    canUseAdvancedAutomation: () => user.tier >= 2,
    canUseCustomIntegrations: () => user.tier === 3,
    getGPTModel: () => {
      switch (user.tier) {
        case 3:
          return TIER_FEATURES.TIER3.model;
        case 2:
          return TIER_FEATURES.TIER2.model;
        default:
          return TIER_FEATURES.TIER1.model;
      }
    },
    // Upgrade helpers
    needsUpgradeForFeature: (minTier: 2 | 3) => user.tier < minTier,
    getUpgradeLink: () => `/settings/billing?from=tier${user.tier}`,
  };
} 
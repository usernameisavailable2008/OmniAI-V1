import { describe, it, expect, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useUser, TIER_FEATURES } from '~/hooks/useUser';

// Mock the Remix hook
jest.mock('@remix-run/react', () => ({
  useRouteLoaderData: jest.fn(),
}));

const mockUseRouteLoaderData = require('@remix-run/react').useRouteLoaderData as jest.MockedFunction<any>;

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data for tier 1 user', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      tier: 1 as const,
      shopId: 'test-shop',
    };

    mockUseRouteLoaderData.mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useUser());

    expect(result.current.id).toBe('1');
    expect(result.current.name).toBe('Test User');
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.tier).toBe(1);
    expect(result.current.shopId).toBe('test-shop');
  });

  it('should return correct tier features for tier 2 user', () => {
    const mockUser = {
      id: '2',
      name: 'Pro User',
      email: 'pro@example.com',
      tier: 2 as const,
    };

    mockUseRouteLoaderData.mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useUser());

    expect(result.current.getTierFeatures()).toEqual(TIER_FEATURES.TIER2);
    expect(result.current.isTier2()).toBe(true);
    expect(result.current.isTier3()).toBe(false);
    expect(result.current.canUseAdvancedAutomation()).toBe(true);
    expect(result.current.canUseCustomIntegrations()).toBe(false);
  });

  it('should return correct tier features for tier 3 user', () => {
    const mockUser = {
      id: '3',
      name: 'Enterprise User',
      email: 'enterprise@example.com',
      tier: 3 as const,
    };

    mockUseRouteLoaderData.mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useUser());

    expect(result.current.getTierFeatures()).toEqual(TIER_FEATURES.TIER3);
    expect(result.current.isTier2()).toBe(true);
    expect(result.current.isTier3()).toBe(true);
    expect(result.current.canUseAdvancedAutomation()).toBe(true);
    expect(result.current.canUseCustomIntegrations()).toBe(true);
  });

  it('should return correct GPT model for each tier', () => {
    const tiers = [1, 2, 3] as const;
    const expectedModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'];

    tiers.forEach((tier, index) => {
      const mockUser = {
        id: tier.toString(),
        name: `User ${tier}`,
        email: `user${tier}@example.com`,
        tier,
      };

      mockUseRouteLoaderData.mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useUser());

      expect(result.current.getGPTModel()).toBe(expectedModels[index]);
    });
  });

  it('should throw error when user is not found', () => {
    mockUseRouteLoaderData.mockReturnValue({});

    expect(() => {
      renderHook(() => useUser());
    }).toThrow('User not found in route data');
  });

  it('should return correct upgrade information', () => {
    const mockUser = {
      id: '1',
      name: 'Basic User',
      email: 'basic@example.com',
      tier: 1 as const,
    };

    mockUseRouteLoaderData.mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useUser());

    expect(result.current.needsUpgradeForFeature(2)).toBe(true);
    expect(result.current.needsUpgradeForFeature(3)).toBe(true);
    expect(result.current.getUpgradeLink()).toBe('/settings/billing?from=tier1');
  });
}); 
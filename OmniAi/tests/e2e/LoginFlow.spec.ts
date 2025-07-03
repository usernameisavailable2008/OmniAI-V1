import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should simulate Shopify OAuth flow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check if we're redirected to login
    await expect(page).toHaveURL(/auth\/login/);

    // Mock the Shopify OAuth process
    await page.route('**/auth/callback*', async (route) => {
      // Mock successful OAuth callback
      await route.fulfill({
        status: 302,
        headers: {
          'Location': '/app?shop=test-shop.myshopify.com',
        },
      });
    });

    // Fill in shop domain
    await page.fill('input[name="shop"]', 'test-shop.myshopify.com');
    await page.click('button[type="submit"]');

    // Wait for redirect to app
    await expect(page).toHaveURL(/\/app/);

    // Check if the main app interface is loaded
    await expect(page.locator('text=OmniAI')).toBeVisible();
    await expect(page.locator('text=AI-Powered Shopify Assistant')).toBeVisible();
  });

  test('should handle invalid shop domain', async ({ page }) => {
    await page.goto('/auth/login');

    // Try with invalid shop domain
    await page.fill('input[name="shop"]', 'invalid-shop');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid shop domain')).toBeVisible();
  });

  test('should handle OAuth errors', async ({ page }) => {
    await page.goto('/auth/login');

    // Mock OAuth error
    await page.route('**/auth/callback*', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'access_denied' }),
      });
    });

    await page.fill('input[name="shop"]', 'test-shop.myshopify.com');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Authentication failed')).toBeVisible();
  });
}); 
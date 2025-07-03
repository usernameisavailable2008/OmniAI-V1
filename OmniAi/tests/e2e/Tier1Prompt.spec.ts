import { test, expect } from '@playwright/test';

test.describe('Tier 1 Prompt Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ authenticated: true, tier: 1 }),
      });
    });

    // Navigate to app
    await page.goto('/app');
  });

  test('should send basic GPT prompt successfully', async ({ page }) => {
    // Mock the chat API response
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          result: {
            message: 'Product titles updated successfully for 5 products.',
          },
        }),
      });
    });

    // Find the command input
    const commandInput = page.locator('input[placeholder*="Enter your command"]');
    await expect(commandInput).toBeVisible();

    // Type a basic Tier 1 command
    await commandInput.fill('Update all T-shirt titles to include "Premium Quality"');

    // Click execute button
    await page.click('button:has-text("Execute")');

    // Wait for response
    await expect(page.locator('text=Product titles updated successfully')).toBeVisible();
  });

  test('should handle Tier 1 limitations', async ({ page }) => {
    // Mock API response for Tier 2 feature attempt
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({
          success: false,
          error: 'This feature requires Tier 2 subscription',
        }),
      });
    });

    const commandInput = page.locator('input[placeholder*="Enter your command"]');
    await commandInput.fill('Build me a complete store with custom theme');

    await page.click('button:has-text("Execute")');

    // Should show upgrade prompt
    await expect(page.locator('text=requires Tier 2')).toBeVisible();
  });

  test('should show loading state during command execution', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/chat', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, result: { message: 'Done' } }),
      });
    });

    const commandInput = page.locator('input[placeholder*="Enter your command"]');
    await commandInput.fill('Update product descriptions');

    await page.click('button:has-text("Execute")');

    // Should show loading spinner
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });
}); 
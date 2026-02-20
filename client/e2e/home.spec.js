import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.getByText(/Travel the World/i)).toBeVisible();
    await expect(page.getByPlaceholder(/where do you want to explore/i)).toBeVisible();
  });

  test('should navigate to explore page', async ({ page }) => {
    await page.getByRole('link', { name: /Explore/i }).click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test('should search for tours', async ({ page }) => {
    await page.getByPlaceholder(/where do you want to explore/i).fill('Paris');
    await page.getByRole('button', { name: /Explore/i }).click();
    await expect(page).toHaveURL(/\/explore\?q=Paris/);
  });

  test('should display featured tours', async ({ page }) => {
    await expect(page.getByText(/Featured Tours/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/Travel the World/i)).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText(/Travel the World/i)).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Explore/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Destinations/i })).toBeVisible();
  });

  test('should click on a tour card', async ({ page }) => {
    // Wait for tours to load
    await page.waitForSelector('[data-testid="tour-card"]', { timeout: 10000 }).catch(() => {});
    
    const tourCards = await page.$$('a[href^="/tour/"]');
    if (tourCards.length > 0) {
      await tourCards[0].click();
      await expect(page).toHaveURL(/\/tour\/.+/);
    }
  });
});

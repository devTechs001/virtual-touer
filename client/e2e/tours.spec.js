import { test, expect } from '@playwright/test';

test.describe('Tour Exploration', () => {
  test('should browse tours on explore page', async ({ page }) => {
    await page.goto('/explore');
    
    // Wait for tours to load
    await page.waitForSelector('[data-testid="tour-card"]', { timeout: 10000 }).catch(() => {});
    
    // Should display tour cards
    const tourCards = await page.$$('a[href^="/tour/"]');
    expect(tourCards.length).toBeGreaterThan(0);
  });

  test('should filter tours by category', async ({ page }) => {
    await page.goto('/explore');
    
    // Click on a category filter
    const culturalButton = page.getByText('Cultural');
    await culturalButton.click();
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
    
    // Verify filter is active
    await expect(culturalButton).toHaveClass(/bg-primary/);
  });

  test('should search for tours', async ({ page }) => {
    await page.goto('/explore');
    
    const searchInput = page.getByPlaceholder(/Search tours/i);
    await searchInput.fill('Paris');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Results should be filtered
    const tourCards = await page.$$('a[href^="/tour/"]');
    // All visible tours should match search
    for (const card of tourCards) {
      const text = await card.textContent();
      expect(text.toLowerCase()).toContain('paris');
    }
  });

  test('should view tour details', async ({ page }) => {
    await page.goto('/explore');
    
    // Wait for tours to load
    await page.waitForSelector('[data-testid="tour-card"]', { timeout: 10000 }).catch(() => {});
    
    const tourCards = await page.$$('a[href^="/tour/"]');
    if (tourCards.length > 0) {
      await tourCards[0].click();
      
      // Should navigate to tour details
      await expect(page).toHaveURL(/\/tour\/.+/);
      
      // Should display tour information
      await expect(page.getByText(/Start Virtual Tour/i)).toBeVisible();
    }
  });

  test('should bookmark a tour', async ({ page }) => {
    await page.goto('/explore');
    
    // Wait for tours to load
    await page.waitForSelector('[data-testid="tour-card"]', { timeout: 10000 }).catch(() => {});
    
    const tourCards = await page.$$('a[href^="/tour/"]');
    if (tourCards.length > 0) {
      // Click on tour card to view details
      await tourCards[0].click();
      await expect(page).toHaveURL(/\/tour\/.+/);
      
      // Click favorite button
      const favoriteButton = page.getByRole('button', { name: /favorite/i });
      if (await favoriteButton.count() > 0) {
        await favoriteButton.click();
        
        // Should show favorited state
        await expect(favoriteButton).toHaveClass(/text-red/);
      }
    }
  });
});

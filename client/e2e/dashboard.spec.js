import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Password/i).fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should access user dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
    await expect(page.getByText(/Tours Completed/i)).toBeVisible();
  });

  test('should display user stats', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should display stats cards
    await expect(page.getByText(/Watch Time/i)).toBeVisible();
    await expect(page.getByText(/Countries/i)).toBeVisible();
  });

  test('should view bookings', async ({ page }) => {
    await page.goto('/bookings');
    
    await expect(page.getByText(/My Bookings/i)).toBeVisible();
  });

  test('should view favorites', async ({ page }) => {
    await page.goto('/favorites');
    
    await expect(page.getByText(/Favorites/i)).toBeVisible();
  });

  test('should access profile settings', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.getByText(/Profile/i)).toBeVisible();
    await expect(page.getByText(/Settings/i)).toBeVisible();
  });

  test('should logout', async ({ page }) => {
    await page.goto('/');
    
    // Click logout button (usually in user menu)
    const logoutButton = page.getByText(/Logout/i);
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      
      // Should redirect to login or home
      await expect(page).toHaveURL('/login');
    }
  });
});

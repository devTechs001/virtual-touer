import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Password/i).fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/Email/i).fill('wrong@example.com');
    await page.getByLabel(/Password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    await expect(page.getByText(/Please enter a valid email/i)).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByLabel(/Password/i);
    const toggleButton = page.getByRole('button', { name: '' }); // Eye icon
    
    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await toggleButton.click();
    
    // Password should be visible now
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByText(/Sign up for free/i).click();
    
    await expect(page).toHaveURL('/register');
  });
});

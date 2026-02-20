# E2E Testing with Playwright

## 🎭 Setup

Playwright is configured for end-to-end testing with multi-browser support.

## 📦 Installation

```bash
cd client
pnpm add -D @playwright/test
npx playwright install
```

## 🚀 Commands

```bash
# Run tests in headless mode
pnpm exec playwright test

# Run tests with UI
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test e2e/home.spec.js

# Run tests in headed mode (visible browser)
pnpm exec playwright test --headed

# Run specific browser
pnpm exec playwright test --project=chromium

# Generate HTML report
pnpm exec playwright show-report
```

## 📁 Test Files

- `e2e/home.spec.js` - Home page tests
- `e2e/auth.spec.js` - Authentication flow tests
- `e2e/tours.spec.js` - Tour browsing tests
- `e2e/dashboard.spec.js` - User dashboard tests

## 🎯 Test Coverage

### Home Page
- Hero section visibility
- Navigation functionality
- Search functionality
- Responsive design
- Tour card interactions

### Authentication
- Login with valid credentials
- Error handling for invalid credentials
- Form validation
- Password visibility toggle
- Navigation to registration

### Tour Exploration
- Browse tours
- Filter by category
- Search functionality
- View tour details
- Bookmark/favorite tours

### Dashboard
- Access user dashboard
- View stats
- View bookings
- View favorites
- Profile settings
- Logout

## 📊 Configuration

### Browsers Tested
- ✅ Chrome (Chromium)
- ✅ Firefox
- ✅ Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)
- ✅ iPad Pro

### Features
- **Parallel Execution**: Tests run in parallel for speed
- **Retries**: Auto-retry failed tests in CI
- **Screenshots**: Captured on failure
- **Video**: Recorded on failure
- **Trace**: Full trace for debugging

## 🎭 Example Test

```javascript
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel(/Email/i).fill('john@example.com');
  await page.getByLabel(/Password/i).fill('password123');
  await page.getByRole('button', { name: /Sign In/i }).click();
  
  await expect(page).toHaveURL('/');
  await expect(page.getByText(/Welcome back/i)).toBeVisible();
});
```

## 🔍 Debugging

```bash
# Debug with Playwright Inspector
pnpm exec playwright test --debug

# Generate trace for debugging
pnpm exec playwright test --trace on
```

## 📈 CI/CD Integration

```yaml
# GitHub Actions example
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Test Runners](https://playwright.dev/docs/test-advanced)

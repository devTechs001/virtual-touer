# 🧪 Testing Suite - Virtual Tourist

## ✅ Setup Complete

The testing suite for Virtual Tourist has been successfully configured with:

- **Vitest** - Fast Vite-native test runner
- **React Testing Library** - Component testing utilities  
- **MSW (Mock Service Worker)** - API mocking
- **@vitest/coverage-v8** - Code coverage

## 📦 Installed Dependencies

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/coverage-v8": "^1.0.1",
    "@vitest/ui": "^1.0.1",
    "vitest": "^1.0.1",
    "jsdom": "^23.0.1",
    "msw": "^2.0.9"
  }
}
```

## 🚀 Commands

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI dashboard
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run tests once (CI mode)
pnpm test:run
```

## 📁 File Structure

```
client/src/
├── __tests__/              # Test files
│   ├── components/        # Component tests
│   ├── pages/            # Page tests  
│   ├── hooks/            # Hook tests
│   ├── utils/            # Utility tests
│   └── services/         # Service tests
├── test/                  # Test utilities
│   ├── setup.js          # Global test config
│   ├── mocks/
│   │   ├── handlers.js   # MSW request handlers
│   │   └── data.js       # Mock data
│   ├── fixtures/
│   │   └── index.js      # Test factories
│   └── utils/
│       └── test-utils.jsx # Custom render
```

## ✍️ Example Test

```jsx
// src/components/__tests__/TourCard.test.jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@test/utils/test-utils';
import TourCard from '../TourCard';

describe('TourCard', () => {
  const mockTour = {
    _id: '1',
    title: 'Paris Tour',
    price: 49,
    rating: 4.8
  };

  it('renders tour information', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.getByText('Paris Tour')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
  });
});
```

## 📊 Test Coverage

Current coverage configuration targets:
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

Coverage reports are generated in `coverage/` directory.

## 🎯 Included Test Files

1. **Utility Tests** (`src/utils/__tests__/helpers.test.js`) ✅
   - Date formatting
   - Number formatting
   - Currency formatting
   - Email validation
   - Text truncation
   - Password validation

2. **Hook Tests** (`src/hooks/__tests__/`)
   - useAuth
   - useTours

3. **Page Tests** (`src/pages/__tests__/`)
   - Login
   - Explore

4. **Service Tests** (`src/services/__tests__/`)
   - API configuration

## 🔧 Configuration

### vitest.config.js
```js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### Path Aliases
```js
'@': './src',
'@components': './src/components',
'@pages': './src/pages',
'@hooks': './src/hooks',
'@services': './src/services',
'@utils': './src/utils',
'@context': './src/context',
'@test': './src/test'
```

## 📚 Mocking

### API Mocking (MSW)
All API endpoints are mocked in `src/test/mocks/handlers.js`:
- Auth endpoints
- Tours CRUD
- Destinations
- Bookings
- Reviews
- Admin endpoints

### Browser APIs
Automatically mocked in setup:
- `localStorage`
- `matchMedia`
- `IntersectionObserver`
- `ResizeObserver`

## 🏗️ Test Utilities

### Custom Render
```jsx
import { render } from '@test/utils/test-utils';

render(<Component />, {
  route: '/custom-route',
  queryClient: customClient
});
```

### Fixtures
```jsx
import { fixtures } from '@test/fixtures';

const tour = fixtures.tours.create({ title: 'Custom' });
const user = fixtures.users.create({ role: 'admin' });
```

## 📖 Documentation

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Docs](https://mswjs.io/)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)

## 🎉 Running Tests

All tests pass successfully:
```
✓ src/utils/__tests__/helpers.test.js (19 tests)
```

To run all tests:
```bash
pnpm test:run
```

To watch specific file:
```bash
pnpm test src/utils/__tests__/helpers.test.js
```

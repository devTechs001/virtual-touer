# Virtual Tourist - Testing Guide

## 🧪 Testing Suite Overview

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing and **MSW (Mock Service Worker)** for API mocking.

## 📦 Test Dependencies

- **Vitest** - Fast Vite-native test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM matchers for assertions
- **@testing-library/user-event** - User interaction simulations
- **MSW** - API mocking library
- **@vitest/coverage-v8** - Code coverage reporting

## 🚀 Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests once without watch
npm run test:run
```

## 📁 Test File Structure

```
client/src/
├── __tests__/              # Test files
│   ├── components/        # Component tests
│   ├── pages/            # Page tests
│   ├── hooks/            # Hook tests
│   ├── utils/            # Utility tests
│   └── services/         # Service tests
├── test/                  # Test utilities
│   ├── setup.js          # Test configuration
│   ├── mocks/
│   │   ├── handlers.js   # MSW request handlers
│   │   └── data.js       # Mock data
│   ├── fixtures/
│   │   └── index.js      # Test data factories
│   └── utils/
│       └── test-utils.jsx # Custom render functions
```

## ✍️ Writing Tests

### Component Test Example

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
    rating: 4.8,
    images: [{ url: 'https://example.com/paris.jpg' }]
  };

  it('renders tour information', () => {
    render(<TourCard tour={mockTour} />);

    expect(screen.getByText('Paris Tour')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('navigates to tour details on click', () => {
    render(<TourCard tour={mockTour} />);

    const card = screen.getByText('Paris Tour').closest('a');
    expect(card).toHaveAttribute('href', '/tour/1');
  });
});
```

### Hook Test Example

```jsx
// src/hooks/__tests__/useAuth.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('john@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### API Mocking Example

```jsx
// Add custom handler in test
import { http, HttpResponse } from 'msw';
import { server } from '@test/mocks/handlers';

it('handles API error', async () => {
  server.use(
    http.get('/api/tours', () => {
      return HttpResponse.error();
    })
  );

  // Test error handling
});
```

## 🏗️ Test Utilities

### Custom Render

```jsx
import { render } from '@test/utils/test-utils';

render(<Component />, {
  route: '/custom-route',  // Set initial route
  queryClient: customClient // Use custom QueryClient
});
```

### Fixtures

```jsx
import { fixtures } from '@test/fixtures';

const tour = fixtures.tours.create({ title: 'Custom Tour' });
const user = fixtures.users.create({ role: 'admin' });
```

## 📊 Coverage Configuration

Coverage reports are generated in `coverage/` directory with:
- **Text** summary in console
- **JSON** report for CI integration
- **HTML** report for detailed analysis

Target thresholds:
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

## 🎯 Testing Best Practices

1. **Test behavior, not implementation**
   ```jsx
   // ✅ Good
   expect(screen.getByText('Success')).toBeInTheDocument();

   // ❌ Avoid
   expect(component.state.value).toBe('Success');
   ```

2. **Use user-centric queries**
   ```jsx
   // Priority order:
   getByRole()        // Buttons, links, headings
   getByLabelText()   // Form fields
   getByPlaceholderText() // Inputs with placeholder
   getByText()        // Text content
   getByTestId()      // Last resort
   ```

3. **Mock external dependencies**
   - API calls (MSW)
   - Browser APIs (localStorage, matchMedia)
   - Third-party libraries

4. **Test edge cases**
   - Loading states
   - Error states
   - Empty states
   - Invalid inputs

## 🔧 Troubleshooting

### Common Issues

**"Cannot find module"**
```bash
# Clear cache
npm run test -- --clearCache
```

**"MSW handler not found"**
```bash
# Ensure setup.js is loaded in vitest.config.js
```

**"localStorage is undefined"**
```javascript
// Already mocked in setup.js, but can override:
localStorage.setItem('key', 'value');
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)

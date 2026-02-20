import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });

// Custom render function with all providers
export function renderWithProviders(
  ui,
  {
    route = '/',
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = {}
) {
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient
  };
}

// Helper to wait for loading states
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Helper to create authenticated user
export const createUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  role: 'user',
  isVerified: true,
  ...overrides
});

// Helper to create admin user
export const createAdminUser = (overrides = {}) => ({
  id: 'admin-1',
  name: 'Admin User',
  email: 'devtechs842@gmail.com',
  avatar: null,
  role: 'admin',
  isVerified: true,
  ...overrides
});

// Mock authentication helpers
export const mockAuth = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  user: null,
  isAuthenticated: false,
  loading: false
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };

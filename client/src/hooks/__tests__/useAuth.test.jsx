import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { AuthProvider } from '../../context/AuthContext';
import { server } from '../../test/mocks/handlers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    server.resetHandlers();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with null user and loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loads user from localStorage token on mount', async () => {
    localStorage.setItem('token', 'mock-jwt-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(expect.objectContaining({
      email: 'john@example.com',
      role: 'user'
    }));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      const loginResult = await result.current.login('john@example.com', 'password123');
      expect(loginResult.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(expect.objectContaining({
        email: 'john@example.com'
      }));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('mock-jwt-token');
  });

  it('handles login failure with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      const loginResult = await result.current.login('wrong@example.com', 'wrongpassword');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Invalid credentials');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out user successfully', async () => {
    localStorage.setItem('token', 'mock-jwt-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('registers new user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    const userData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123'
    };

    await act(async () => {
      const registerResult = await result.current.register(userData);
      expect(registerResult.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(expect.objectContaining({
        name: 'New User',
        email: 'newuser@example.com'
      }));
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('updates user profile successfully', async () => {
    localStorage.setItem('token', 'mock-jwt-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const updateResult = await result.current.updateProfile({
        name: 'Updated Name',
        bio: 'Test bio'
      });
      expect(updateResult.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.user.name).toBe('Updated Name');
    });
  });
});

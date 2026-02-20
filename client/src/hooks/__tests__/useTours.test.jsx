import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTours, useTour, useFeaturedTours } from '../useTours';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTours', () => {
  it('fetches tours successfully', async () => {
    const { result } = renderHook(() => useTours(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data.tours).toBeInstanceOf(Array);
  });

  it('fetches tours with filters', async () => {
    const { result } = renderHook(
      () => useTours({ category: 'cultural' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.tours).toBeDefined();
  });
});

describe('useTour', () => {
  it('fetches single tour by id', async () => {
    const { result } = renderHook(
      () => useTour('1'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.tour).toBeDefined();
    expect(result.current.data.tour._id).toBe('1');
  });

  it('does not fetch when id is not provided', () => {
    const { result } = renderHook(
      () => useTour(null),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useFeaturedTours', () => {
  it('fetches featured tours', async () => {
    const { result } = renderHook(
      () => useFeaturedTours(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.tours).toBeDefined();
  });
});

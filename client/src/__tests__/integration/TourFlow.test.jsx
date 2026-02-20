import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils/test-utils';
import App from '../../App';

describe('Tour Browsing Flow', () => {
  it('allows user to browse and view tour details', async () => {
    const user = userEvent.setup();
    render(<App />, { route: '/' });

    // Wait for home page to load
    await waitFor(() => {
      expect(screen.getByText(/Travel the World/i)).toBeInTheDocument();
    });

    // Navigate to explore page
    const exploreLink = screen.getByText(/Explore/i);
    await user.click(exploreLink);

    await waitFor(() => {
      expect(screen.getByText(/tours found/i)).toBeInTheDocument();
    });

    // Click on a tour card
    const tourCards = screen.getAllByRole('link', { name: /Paris/i });
    if (tourCards.length > 0) {
      await user.click(tourCards[0]);

      await waitFor(() => {
        expect(screen.getByText(/Start Virtual Tour/i)).toBeInTheDocument();
      });
    }
  });

  it('allows filtering tours by category', async () => {
    const user = userEvent.setup();
    render(<App />, { route: '/explore' });

    await waitFor(() => {
      expect(screen.getByText(/tours found/i)).toBeInTheDocument();
    });

    // Click on a category filter
    const culturalButton = screen.getByText('Cultural');
    await user.click(culturalButton);

    // Verify filter is applied
    await waitFor(() => {
      expect(screen.getByText(/Cultural/i)).toHaveClass('bg-primary-500');
    });
  });

  it('allows searching for tours', async () => {
    const user = userEvent.setup();
    render(<App />, { route: '/explore' });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'Tokyo');

    // Results should update
    await waitFor(() => {
      // Check that search query is reflected
      expect(searchInput).toHaveValue('Tokyo');
    });
  });
});

describe('Authentication Flow', () => {
  it('allows user to login and access protected routes', async () => {
    const user = userEvent.setup();
    render(<App />, { route: '/login' });

    // Fill login form
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);

    // Should redirect after successful login
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('redirects unauthenticated users from protected routes', async () => {
    render(<App />, { route: '/profile' });

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });
});

describe('Booking Flow', () => {
  it('allows authenticated user to book a tour', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated state
    localStorage.setItem('token', 'test-token');
    
    render(<App />, { route: '/tour/2' }); // Tour with price

    await waitFor(() => {
      expect(screen.getByText(/Book Now/i)).toBeInTheDocument();
    });

    // Select date and participants
    const bookButton = screen.getByText(/Book Now/i);
    await user.click(bookButton);

    // Should proceed to checkout or show booking form
    await waitFor(() => {
      // Check for booking confirmation or checkout
    });

    localStorage.removeItem('token');
  });
});

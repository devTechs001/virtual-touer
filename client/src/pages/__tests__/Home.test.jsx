import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils/test-utils';
import Home from '../Home';

describe('Home Page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('renders hero section with title', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Travel the World/i)).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/where do you want to explore/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('renders featured tours section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Featured Tours/i)).toBeInTheDocument();
    });
  });

  it('renders popular tours section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Popular Right Now/i)).toBeInTheDocument();
    });
  });

  it('allows searching for tours', async () => {
    const user = userEvent.setup();
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/where do you want to explore/i);
      expect(searchInput).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/where do you want to explore/i);
    await user.type(searchInput, 'Paris');
    
    expect(searchInput).toHaveValue('Paris');
  });

  it('displays features section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/360° Virtual Tours/i)).toBeInTheDocument();
      expect(screen.getByText(/AR Navigation/i)).toBeInTheDocument();
    });
  });
});

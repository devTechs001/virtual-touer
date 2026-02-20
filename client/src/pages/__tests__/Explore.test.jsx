import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render, server } from '../../test/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { mockTours } from '../../test/mocks/data';
import Explore from '../Explore';

describe('Explore Page', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders explore page with tour grid', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/explore virtual tours/i)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(/search tours/i)).toBeInTheDocument();
    expect(screen.getByText(/all categories/i)).toBeInTheDocument();
  });

  it('displays tours from API', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/tokyo: shibuya street culture/i)).toBeInTheDocument();
  });

  it('filters tours by search query', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search tours/i);
    fireEvent.change(searchInput, { target: { value: 'Paris' } });

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
      expect(screen.queryByText(/tokyo: shibuya street culture/i)).not.toBeInTheDocument();
    });
  });

  it('filters tours by category', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'cultural' } });

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<Explore />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays empty state when no tours match filters', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search tours/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent-tour' } });

    await waitFor(() => {
      expect(screen.getByText(/no tours found/i)).toBeInTheDocument();
    });
  });

  it('navigates to tour details when clicking on a tour', async () => {
    render(<Explore />);

    await waitFor(() => {
      expect(screen.getByText(/paris: eiffel tower experience/i)).toBeInTheDocument();
    });

    const tourCard = screen.getByText(/paris: eiffel tower experience/i).closest('a');
    fireEvent.click(tourCard);

    await waitFor(() => {
      expect(window.location.pathname).toMatch(/^\/tour\//);
    });
  });
});

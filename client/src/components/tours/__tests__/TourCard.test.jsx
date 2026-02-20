import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../test/utils/test-utils';
import TourCard from '../TourCard';

const mockTour = {
  _id: '1',
  title: 'Paris: Eiffel Tower Experience',
  shortDescription: 'Experience the magic of Paris',
  images: [{ url: 'https://example.com/paris.jpg' }],
  location: { city: 'Paris', country: 'France' },
  category: 'cultural',
  duration: '45 minutes',
  price: 0,
  rating: 4.8,
  reviewCount: 234,
  participants: 15420,
  isVirtual: true,
  is360: true,
  featured: true
};

describe('TourCard', () => {
  it('renders tour information correctly', () => {
    render(<TourCard tour={mockTour} />);

    expect(screen.getByText('Paris: Eiffel Tower Experience')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(234)')).toBeInTheDocument();
  });

  it('displays virtual tour badge when isVirtual is true', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.getByText('Virtual')).toBeInTheDocument();
  });

  it('displays 360 badge when is360 is true', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.getByText('360°')).toBeInTheDocument();
  });

  it('displays featured badge when featured is true', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('displays price for paid tours', () => {
    const paidTour = { ...mockTour, price: 19.99 };
    render(<TourCard tour={paidTour} />);
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('/ person')).toBeInTheDocument();
  });

  it('does not display price section for free tours', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.queryByText('/ person')).not.toBeInTheDocument();
  });

  it('links to tour details page', () => {
    render(<TourCard tour={mockTour} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tour/1');
  });

  it('renders tour image', () => {
    render(<TourCard tour={mockTour} />);
    const image = screen.getByAltText('Paris: Eiffel Tower Experience');
    expect(image).toBeInTheDocument();
  });

  it('shows favorite button', () => {
    render(<TourCard tour={mockTour} />);
    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
  });
});

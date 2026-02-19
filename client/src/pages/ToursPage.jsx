import { useState } from 'react';
import { Container } from '@/components/common';
import { TourCard, TourFilters } from '@/components/tours';

const allTours = [
  {
    id: 1,
    name: 'Eiffel Tower Experience',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800',
    price: 49,
    rating: 4.8,
    reviews: 256,
    duration: '2 hours',
    groupSize: 10,
    category: 'Historical',
    featured: true,
  },
  {
    id: 2,
    name: 'Grand Canyon Adventure',
    location: 'Arizona, USA',
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800',
    price: 79,
    rating: 4.9,
    reviews: 189,
    duration: '3 hours',
    groupSize: 8,
    category: 'Nature',
    featured: true,
  },
  {
    id: 3,
    name: 'Tokyo Street Walk',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: 39,
    rating: 4.7,
    reviews: 312,
    duration: '1.5 hours',
    groupSize: 12,
    category: 'City',
    featured: false,
  },
  {
    id: 4,
    name: 'Great Wall of China',
    location: 'Beijing, China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
    price: 59,
    rating: 4.9,
    reviews: 423,
    duration: '4 hours',
    groupSize: 15,
    category: 'Historical',
    featured: true,
  },
  {
    id: 5,
    name: 'Amazon Rainforest Trek',
    location: 'Manaus, Brazil',
    image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800',
    price: 89,
    rating: 4.8,
    reviews: 167,
    duration: '5 hours',
    groupSize: 6,
    category: 'Adventure',
    featured: false,
  },
  {
    id: 6,
    name: 'Santorini Sunset',
    location: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    price: 69,
    rating: 4.9,
    reviews: 289,
    duration: '2.5 hours',
    groupSize: 10,
    category: 'Relaxation',
    featured: true,
  },
];

export default function ToursPage() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    priceRange: { min: 0, max: Infinity },
  });

  const filteredTours = allTours.filter((tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'All' || tour.category === filters.category;
    const matchesPrice = tour.price >= filters.priceRange.min && tour.price <= filters.priceRange.max;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2">
          Explore All Tours
        </h1>
        <p className="text-dark-600">
          Discover amazing virtual experiences from around the world
        </p>
      </div>

      <TourFilters onFilterChange={setFilters} />

      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-dark-600 text-lg">No tours found matching your criteria</p>
        </div>
      )}
    </Container>
  );
}

import { create } from 'zustand';

const useTourStore = create((set, get) => ({
  tours: [],
  selectedTour: null,
  filters: {
    search: '',
    category: 'All',
    priceRange: { min: 0, max: Infinity },
    rating: 0,
  },
  loading: false,
  error: null,

  setTours: (tours) => set({ tours }),

  setSelectedTour: (tour) => set({ selectedTour: tour }),

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        category: 'All',
        priceRange: { min: 0, max: Infinity },
        rating: 0,
      },
    });
  },

  getFilteredTours: () => {
    const { tours, filters } = get();
    
    return tours.filter((tour) => {
      const matchesSearch =
        tour.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.location.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory =
        filters.category === 'All' || tour.category === filters.category;
      
      const matchesPrice =
        tour.price >= filters.priceRange.min &&
        tour.price <= filters.priceRange.max;
      
      const matchesRating = tour.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  },

  getTourById: (id) => {
    return get().tours.find((tour) => tour.id === id);
  },

  getFeaturedTours: () => {
    return get().tours.filter((tour) => tour.featured);
  },

  getToursByCategory: (category) => {
    return get().tours.filter((tour) => tour.category === category);
  },
}));

export default useTourStore;

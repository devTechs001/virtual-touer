import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin,
  Grid3X3,
  List,
  Map as MapIcon,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import TourGrid from '../components/tours/TourGrid';
import TourListView from '../components/tours/TourListView';
import FilterSidebar from '../components/filters/FilterSidebar';
import FilterChips from '../components/filters/FilterChips';
import InteractiveMap from '../components/maps/InteractiveMap';
import { useTours } from '../hooks/useTours';
import { useDebounce } from '../hooks/useDebounce';

const categories = [
  { id: 'all', label: 'All Tours', icon: '🌍' },
  { id: 'cultural', label: 'Cultural', icon: '🏛️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'historical', label: 'Historical', icon: '🏰' },
  { id: 'urban', label: 'Urban', icon: '🌆' },
  { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
  { id: 'food', label: 'Food & Drink', icon: '🍷' },
  { id: 'art', label: 'Art & Museums', icon: '🎨' }
];

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: '-rating', label: 'Highest Rated' },
  { value: '-participants', label: 'Most Popular' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration: Short to Long' }
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get filter values from URL
  const filters = useMemo(() => ({
    category: searchParams.get('category') || 'all',
    sort: searchParams.get('sort') || '-createdAt',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    isVirtual: searchParams.get('isVirtual') || '',
    is360: searchParams.get('is360') || '',
    country: searchParams.get('country') || '',
    page: Number(searchParams.get('page')) || 1
  }), [searchParams]);

  // Build query params
  const queryParams = useMemo(() => {
    const params = { ...filters };
    if (params.category === 'all') delete params.category;
    if (debouncedSearch) params.search = debouncedSearch;
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key];
    });
    return params;
  }, [filters, debouncedSearch]);

  const { data, isLoading, error, isFetching } = useTours(queryParams);

  // Infinite scroll
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && data?.pagination?.page < data?.pagination?.pages) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', String(data.pagination.page + 1));
        return newParams;
      });
    }
  }, [inView, data]);

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.set('page', '1'); // Reset page on filter change
      return newParams;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.rating) count++;
    if (filters.isVirtual) count++;
    if (filters.is360) count++;
    if (filters.country) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Search Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-dark-900/95 backdrop-blur-lg border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tours, destinations, experiences..."
                className="input pl-12 pr-4"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="btn-secondary relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-dark-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => updateFilter('category', category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  filters.category === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-dark-400">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <span className="text-white font-medium">{data?.pagination?.total || 0}</span> tours found
                  {debouncedSearch && (
                    <span> for "<span className="text-primary-400">{debouncedSearch}</span>"</span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-xl text-dark-300 hover:text-white transition-colors"
            >
              <span className="text-sm">
                {sortOptions.find(s => s.value === filters.sort)?.label || 'Sort by'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSortDropdown(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-dark-800 rounded-xl border border-dark-700 shadow-xl overflow-hidden z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateFilter('sort', option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          filters.sort === option.value
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filter Chips */}
        <FilterChips 
          filters={filters} 
          onRemove={updateFilter} 
          onClearAll={clearFilters}
        />

        {/* Content based on view mode */}
        {viewMode === 'map' ? (
          <div className="h-[calc(100vh-300px)] min-h-[500px] rounded-2xl overflow-hidden">
            <InteractiveMap tours={data?.tours || []} />
          </div>
        ) : viewMode === 'list' ? (
          <TourListView 
            tours={data?.tours || []} 
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <TourGrid 
            tours={data?.tours || []} 
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Load More Trigger */}
        {data?.pagination?.page < data?.pagination?.pages && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetching && (
              <div className="flex items-center gap-3 text-dark-400">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Loading more tours...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onClearAll={clearFilters}
      />
    </div>
  );
};

export default Explore;
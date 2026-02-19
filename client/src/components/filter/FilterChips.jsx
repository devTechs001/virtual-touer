import { X } from 'lucide-react';

const FilterChips = ({ filters, onRemove, onClearAll }) => {
  const activeFilters = [];

  if (filters.category && filters.category !== 'all') {
    activeFilters.push({ key: 'category', label: `Category: ${filters.category}`, value: 'all' });
  }
  if (filters.minPrice || filters.maxPrice) {
    const label = filters.maxPrice 
      ? `$${filters.minPrice || 0} - $${filters.maxPrice}`
      : `$${filters.minPrice}+`;
    activeFilters.push({ key: 'price', label: `Price: ${label}`, value: '' });
  }
  if (filters.rating) {
    activeFilters.push({ key: 'rating', label: `${filters.rating}+ Stars`, value: '' });
  }
  if (filters.isVirtual === 'true') {
    activeFilters.push({ key: 'isVirtual', label: '360° Virtual', value: '' });
  }
  if (filters.is360 === 'true') {
    activeFilters.push({ key: 'is360', label: 'Panoramic', value: '' });
  }
  if (filters.country) {
    activeFilters.push({ key: 'country', label: filters.country, value: '' });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-full text-sm"
        >
          {filter.label}
          <button
            onClick={() => {
              if (filter.key === 'price') {
                onRemove('minPrice', '');
                onRemove('maxPrice', '');
              } else {
                onRemove(filter.key, filter.value);
              }
            }}
            className="p-0.5 hover:bg-primary-500/30 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-dark-400 hover:text-white transition-colors"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterChips;
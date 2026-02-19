import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input, Button } from '../common';

const categories = ['All', 'Historical', 'Nature', 'City', 'Adventure', 'Cultural', 'Relaxation'];
const priceRanges = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200+', min: 200, max: Infinity },
];

export default function TourFilters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilterChange?.({ searchTerm: value, category: selectedCategory, priceRange: selectedPriceRange });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <Input
            type="text"
            placeholder="Search tours, destinations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:w-auto"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              onFilterChange?.({ searchTerm, category, priceRange: selectedPriceRange });
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-dark-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Price Range
            </label>
            <select
              value={priceRanges.indexOf(selectedPriceRange)}
              onChange={(e) => {
                const range = priceRanges[e.target.value];
                setSelectedPriceRange(range);
                onFilterChange?.({ searchTerm, category: selectedCategory, priceRange: range });
              }}
              className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priceRanges.map((range, index) => (
                <option key={index} value={index}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

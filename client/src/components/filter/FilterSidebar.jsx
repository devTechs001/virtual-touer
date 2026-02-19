import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Star, DollarSign, Globe2, Compass } from 'lucide-react';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearAll 
}) => {
  const priceRanges = [
    { label: 'Free', min: 0, max: 0 },
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: 'Over $100', min: 100, max: '' }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const tourTypes = [
    { id: 'isVirtual', label: '360° Virtual Tour', icon: '🌐' },
    { id: 'is360', label: 'Panoramic', icon: '📷' },
    { id: 'hasAR', label: 'AR Experience', icon: '📱' },
    { id: 'isLive', label: 'Live Guided', icon: '🎥' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-dark-800 border-r border-dark-700 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-dark-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear all
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Tour Type */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                  <Globe2 className="w-5 h-5 text-primary-400" />
                  Tour Type
                </h3>
                <div className="space-y-2">
                  {tourTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters[type.id] === 'true'}
                        onChange={(e) => onFilterChange(type.id, e.target.checked ? 'true' : '')}
                        className="w-5 h-5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
                      />
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-dark-200">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                  <DollarSign className="w-5 h-5 text-primary-400" />
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={
                          filters.minPrice === String(range.min) &&
                          filters.maxPrice === String(range.max)
                        }
                        onChange={() => {
                          onFilterChange('minPrice', String(range.min));
                          onFilterChange('maxPrice', range.max === '' ? '' : String(range.max));
                        }}
                        className="w-5 h-5 border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
                      />
                      <span className="text-dark-200">{range.label}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Range */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => onFilterChange('minPrice', e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <span className="text-dark-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                  <Star className="w-5 h-5 text-primary-400" />
                  Rating
                </h3>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === String(rating)}
                        onChange={() => onFilterChange('rating', String(rating))}
                        className="w-5 h-5 border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-dark-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-dark-400 text-sm">& up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                  <Compass className="w-5 h-5 text-primary-400" />
                  Difficulty
                </h3>
                <div className="flex gap-2">
                  {['easy', 'moderate', 'challenging'].map((level) => (
                    <button
                      key={level}
                      onClick={() => onFilterChange('difficulty', level)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium capitalize transition-colors ${
                        filters.difficulty === level
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700/50 text-dark-300 hover:bg-dark-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-dark-800 border-t border-dark-700 p-4">
              <button
                onClick={onClose}
                className="btn-primary w-full py-3.5"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
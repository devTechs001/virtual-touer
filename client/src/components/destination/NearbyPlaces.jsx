import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Utensils, Bed, Coffee, ShoppingBag, Fuel, Cross, Phone, Star, Navigation, Clock, DollarSign } from 'lucide-react';

/**
 * NearbyPlaces Component
 * Features:
 * - Categories: Restaurants, Hotels, Cafes, Shopping, Gas, Medical
 * - Distance calculations
 * - Ratings and reviews
 * - Offline data support
 */

// Sample offline nearby places data
const NEARBY_PLACES_DATA = {
  restaurants: [
    {
      id: 'rest-1',
      name: 'Le Petit Bistro',
      category: 'restaurants',
      rating: 4.5,
      reviews: 234,
      distance: 0.3,
      price: '$$',
      cuisine: 'French',
      address: '123 Main Street',
      phone: '+1234567890',
      hours: '9:00 AM - 10:00 PM',
      image: '/images/restaurant-1.jpg'
    },
    {
      id: 'rest-2',
      name: 'Sakura Sushi',
      category: 'restaurants',
      rating: 4.7,
      reviews: 189,
      distance: 0.5,
      price: '$$$',
      cuisine: 'Japanese',
      address: '456 Oak Avenue',
      phone: '+1234567891',
      hours: '11:00 AM - 11:00 PM',
      image: '/images/restaurant-2.jpg'
    },
    {
      id: 'rest-3',
      name: 'Mama\'s Kitchen',
      category: 'restaurants',
      rating: 4.3,
      reviews: 456,
      distance: 0.8,
      price: '$',
      cuisine: 'Local',
      address: '789 Park Road',
      phone: '+1234567892',
      hours: '7:00 AM - 9:00 PM',
      image: '/images/restaurant-3.jpg'
    }
  ],
  hotels: [
    {
      id: 'hotel-1',
      name: 'Grand Plaza Hotel',
      category: 'hotels',
      rating: 4.8,
      reviews: 567,
      distance: 0.2,
      price: '$$$$',
      amenities: ['Pool', 'Spa', 'Gym', 'WiFi'],
      address: '100 Luxury Lane',
      phone: '+1234567800',
      image: '/images/hotel-1.jpg'
    },
    {
      id: 'hotel-2',
      name: 'Budget Inn',
      category: 'hotels',
      rating: 3.9,
      reviews: 234,
      distance: 0.6,
      price: '$',
      amenities: ['WiFi', 'Parking'],
      address: '200 Economy Street',
      phone: '+1234567801',
      image: '/images/hotel-2.jpg'
    },
    {
      id: 'hotel-3',
      name: 'Boutique Suites',
      category: 'hotels',
      rating: 4.5,
      reviews: 189,
      distance: 0.4,
      price: '$$$',
      amenities: ['WiFi', 'Breakfast', 'Bar'],
      address: '300 Style Avenue',
      phone: '+1234567802',
      image: '/images/hotel-3.jpg'
    }
  ],
  cafes: [
    {
      id: 'cafe-1',
      name: 'Coffee Bean',
      category: 'cafes',
      rating: 4.4,
      reviews: 312,
      distance: 0.1,
      price: '$$',
      specialty: 'Artisan Coffee',
      address: '50 Brew Street',
      hours: '6:00 AM - 8:00 PM',
      image: '/images/cafe-1.jpg'
    },
    {
      id: 'cafe-2',
      name: 'Tea House',
      category: 'cafes',
      rating: 4.6,
      reviews: 178,
      distance: 0.4,
      price: '$$',
      specialty: 'Traditional Tea',
      address: '60 Leaf Lane',
      hours: '8:00 AM - 9:00 PM',
      image: '/images/cafe-2.jpg'
    }
  ],
  shopping: [
    {
      id: 'shop-1',
      name: 'City Mall',
      category: 'shopping',
      rating: 4.2,
      reviews: 890,
      distance: 1.2,
      price: '$$$',
      type: 'Shopping Center',
      address: '100 Retail Road',
      hours: '10:00 AM - 10:00 PM',
      image: '/images/mall-1.jpg'
    },
    {
      id: 'shop-2',
      name: 'Local Market',
      category: 'shopping',
      rating: 4.5,
      reviews: 456,
      distance: 0.7,
      price: '$',
      type: 'Market',
      address: '200 Market Square',
      hours: '6:00 AM - 6:00 PM',
      image: '/images/market-1.jpg'
    }
  ],
  gas: [
    {
      id: 'gas-1',
      name: 'Shell Station',
      category: 'gas',
      rating: 4.0,
      reviews: 123,
      distance: 0.5,
      price: '$$',
      services: ['Fuel', 'Convenience Store', 'Car Wash'],
      address: '300 Highway Drive',
      hours: '24 hours',
      image: '/images/gas-1.jpg'
    }
  ],
  medical: [
    {
      id: 'med-1',
      name: 'City Hospital',
      category: 'medical',
      rating: 4.3,
      reviews: 567,
      distance: 2.1,
      type: 'Hospital',
      address: '400 Health Avenue',
      phone: '+1234567900',
      hours: '24 hours',
      emergency: true,
      image: '/images/hospital-1.jpg'
    },
    {
      id: 'med-2',
      name: 'Quick Care Clinic',
      category: 'medical',
      rating: 4.1,
      reviews: 234,
      distance: 0.8,
      type: 'Clinic',
      address: '500 Wellness Street',
      phone: '+1234567901',
      hours: '8:00 AM - 8:00 PM',
      emergency: false,
      image: '/images/clinic-1.jpg'
    }
  ]
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'restaurants', label: 'Food', icon: Utensils },
  { id: 'hotels', label: 'Hotels', icon: Bed },
  { id: 'cafes', label: 'Cafes', icon: Coffee },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'gas', label: 'Gas', icon: Fuel },
  { id: 'medical', label: 'Medical', icon: Cross }
];

const NearbyPlaces = ({ 
  location, 
  radius = 5, 
  showAll = true,
  maxResults = 10
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating', 'price'

  const filteredPlaces = useMemo(() => {
    let places = [];
    
    if (selectedCategory === 'all') {
      Object.values(NEARBY_PLACES_DATA).forEach(categoryPlaces => {
        places = [...places, ...categoryPlaces];
      });
    } else {
      places = NEARBY_PLACES_DATA[selectedCategory] || [];
    }

    // Sort
    places.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price.length - b.price.length;
      return 0;
    });

    return places.slice(0, maxResults);
  }, [selectedCategory, sortBy, maxResults]);

  const getCategoryStats = useMemo(() => {
    const stats = {};
    Object.entries(NEARBY_PLACES_DATA).forEach(([category, places]) => {
      stats[category] = places.length;
    });
    return stats;
  }, []);

  const CategoryIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon || MapPin;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Nearby Places</h2>
            <p className="text-dark-400">Within {radius} km of your location</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="distance">Nearest</option>
            <option value="rating">Top Rated</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const count = category.id === 'all' 
            ? Object.values(getCategoryStats).reduce((a, b) => a + b, 0)
            : getCategoryStats[category.id] || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-dark-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Places List */}
      <div className="space-y-3">
        {filteredPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedPlace(place)}
            className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden cursor-pointer hover:border-primary-500 transition-colors"
          >
            <div className="flex">
              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0 bg-dark-700">
                <img
                  src={place.image || '/images/placeholder.jpg'}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{place.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <span className="capitalize">{place.category}</span>
                      {place.cuisine && <span>• {place.cuisine}</span>}
                      {place.type && <span>• {place.type}</span>}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-dark-400">{place.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-white">{place.rating}</span>
                      <span className="text-sm text-dark-500">({place.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-dark-400">
                      <Navigation className="w-3 h-3" />
                      <span>{place.distance} km</span>
                    </div>
                  </div>
                </div>

                {place.hours && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-dark-500">
                    <Clock className="w-3 h-3" />
                    <span>{place.hours}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No places found in this category</p>
        </div>
      )}

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-dark-900 rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48 bg-dark-800">
                <img
                  src={selectedPlace.image || '/images/placeholder.jpg'}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 p-2 bg-dark-900/70 rounded-full text-white"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedPlace.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-white">{selectedPlace.rating}</span>
                      <span className="text-sm text-dark-500">({selectedPlace.reviews} reviews)</span>
                    </div>
                    <span className="text-dark-600">•</span>
                    <span className="text-dark-400">{selectedPlace.price}</span>
                    <span className="text-dark-600">•</span>
                    <span className="text-dark-400">{selectedPlace.distance} km away</span>
                  </div>
                </div>

                {selectedPlace.address && (
                  <div className="flex items-start gap-3 text-dark-400">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">Address</div>
                      <div>{selectedPlace.address}</div>
                    </div>
                  </div>
                )}

                {selectedPlace.phone && (
                  <div className="flex items-start gap-3 text-dark-400">
                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">Phone</div>
                      <div>{selectedPlace.phone}</div>
                    </div>
                  </div>
                )}

                {selectedPlace.hours && (
                  <div className="flex items-start gap-3 text-dark-400">
                    <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">Hours</div>
                      <div>{selectedPlace.hours}</div>
                    </div>
                  </div>
                )}

                {selectedPlace.amenities && (
                  <div>
                    <div className="font-medium text-white mb-2">Amenities</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-dark-800 rounded-full text-sm text-dark-400">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors">
                    <Navigation className="w-5 h-5" />
                    <span>Get Directions</span>
                  </button>
                  {selectedPlace.phone && (
                    <a
                      href={`tel:${selectedPlace.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl text-white font-medium transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyPlaces;

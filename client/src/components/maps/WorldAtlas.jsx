import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, MapPin, Star, Heart, Info, X } from 'lucide-react';

/**
 * WorldAtlas Component with Offline Data
 * Features:
 * - Comprehensive country data stored locally (works offline)
 * - Search and filter functionality
 * - Country details with travel info
 * - Favorites system
 */

// Offline country data
const COUNTRIES_DATA = [
  {
    id: 'fr',
    name: 'France',
    capital: 'Paris',
    region: 'Europe',
    population: '67M',
    language: 'French',
    currency: 'Euro (€)',
    timezone: 'CET (UTC+1)',
    coordinates: [2.2137, 46.2276],
    flag: '🇫🇷',
    description: 'Known for its art, fashion, culture, and cuisine. Home to the Eiffel Tower and Louvre Museum.',
    bestTimeToVisit: 'April-June, September-October',
    visaRequired: false,
    attractions: ['Eiffel Tower', 'Louvre Museum', 'French Riviera', 'Mont Saint-Michel'],
    rating: 4.8
  },
  {
    id: 'jp',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'Asia',
    population: '125M',
    language: 'Japanese',
    currency: 'Yen (¥)',
    timezone: 'JST (UTC+9)',
    coordinates: [138.2529, 36.2048],
    flag: '🇯🇵',
    description: 'A blend of ancient traditions and cutting-edge technology. Famous for cherry blossoms and sushi.',
    bestTimeToVisit: 'March-May (Cherry Blossoms), September-November',
    visaRequired: false,
    attractions: ['Mount Fuji', 'Kyoto Temples', 'Tokyo', 'Osaka Castle'],
    rating: 4.9
  },
  {
    id: 'us',
    name: 'United States',
    capital: 'Washington, D.C.',
    region: 'North America',
    population: '331M',
    language: 'English',
    currency: 'Dollar ($)',
    timezone: 'Multiple (UTC-5 to UTC-10)',
    coordinates: [-95.7129, 37.0902],
    flag: '🇺🇸',
    description: 'Diverse landscapes from beaches to mountains. Home to iconic cities and national parks.',
    bestTimeToVisit: 'April-June, September-November',
    visaRequired: true,
    attractions: ['Grand Canyon', 'New York City', 'Yellowstone', 'Golden Gate Bridge'],
    rating: 4.7
  },
  {
    id: 'it',
    name: 'Italy',
    capital: 'Rome',
    region: 'Europe',
    population: '60M',
    language: 'Italian',
    currency: 'Euro (€)',
    timezone: 'CET (UTC+1)',
    coordinates: [12.5674, 41.8719],
    flag: '🇮🇹',
    description: 'Rich history, art, architecture, and world-famous cuisine. Birthplace of the Renaissance.',
    bestTimeToVisit: 'April-June, September-October',
    visaRequired: false,
    attractions: ['Colosseum', 'Venice Canals', 'Florence', 'Amalfi Coast'],
    rating: 4.8
  },
  {
    id: 'au',
    name: 'Australia',
    capital: 'Canberra',
    region: 'Oceania',
    population: '25M',
    language: 'English',
    currency: 'Dollar (A$)',
    timezone: 'Multiple (UTC+8 to UTC+11)',
    coordinates: [133.7751, -25.2744],
    flag: '🇦🇺',
    description: 'Vast country with unique wildlife, beautiful beaches, and iconic landmarks.',
    bestTimeToVisit: 'September-November, March-May',
    visaRequired: true,
    attractions: ['Great Barrier Reef', 'Sydney Opera House', 'Uluru', 'Great Ocean Road'],
    rating: 4.7
  },
  {
    id: 'eg',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'Africa',
    population: '102M',
    language: 'Arabic',
    currency: 'Pound (E£)',
    timezone: 'EET (UTC+2)',
    coordinates: [30.8025, 26.8206],
    flag: '🇪🇬',
    description: 'Ancient civilization with pyramids, pharaohs, and the mysterious Sphinx.',
    bestTimeToVisit: 'October-April',
    visaRequired: true,
    attractions: ['Pyramids of Giza', 'Luxor', 'Valley of the Kings', 'Red Sea'],
    rating: 4.6
  },
  {
    id: 'br',
    name: 'Brazil',
    capital: 'Brasília',
    region: 'South America',
    population: '212M',
    language: 'Portuguese',
    currency: 'Real (R$)',
    timezone: 'BRT (UTC-3)',
    coordinates: [-51.9253, -14.2350],
    flag: '🇧🇷',
    description: 'Vibrant culture, Amazon rainforest, beautiful beaches, and Carnival celebrations.',
    bestTimeToVisit: 'December-March',
    visaRequired: false,
    attractions: ['Christ the Redeemer', 'Amazon Rainforest', 'Iguazu Falls', 'Copacabana'],
    rating: 4.5
  },
  {
    id: 'in',
    name: 'India',
    capital: 'New Delhi',
    region: 'Asia',
    population: '1.38B',
    language: 'Hindi, English',
    currency: 'Rupee (₹)',
    timezone: 'IST (UTC+5:30)',
    coordinates: [78.9629, 20.5937],
    flag: '🇮🇳',
    description: 'Diverse culture, ancient history, spiritual heritage, and incredible architecture.',
    bestTimeToVisit: 'October-March',
    visaRequired: true,
    attractions: ['Taj Mahal', 'Jaipur', 'Varanasi', 'Kerala Backwaters'],
    rating: 4.6
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    capital: 'London',
    region: 'Europe',
    population: '67M',
    language: 'English',
    currency: 'Pound (£)',
    timezone: 'GMT (UTC+0)',
    coordinates: [-3.4360, 55.3781],
    flag: '🇬🇧',
    description: 'Rich royal history, iconic landmarks, and diverse culture across four nations.',
    bestTimeToVisit: 'May-September',
    visaRequired: false,
    attractions: ['Big Ben', 'Buckingham Palace', 'Stonehenge', 'Edinburgh Castle'],
    rating: 4.7
  },
  {
    id: 'th',
    name: 'Thailand',
    capital: 'Bangkok',
    region: 'Asia',
    population: '70M',
    language: 'Thai',
    currency: 'Baht (฿)',
    timezone: 'ICT (UTC+7)',
    coordinates: [100.9925, 15.8700],
    flag: '🇹🇭',
    description: 'Tropical beaches, ornate temples, delicious street food, and friendly locals.',
    bestTimeToVisit: 'November-February',
    visaRequired: false,
    attractions: ['Grand Palace', 'Phi Phi Islands', 'Chiang Mai', 'Ayutthaya'],
    rating: 4.8
  },
  {
    id: 'gr',
    name: 'Greece',
    capital: 'Athens',
    region: 'Europe',
    population: '10M',
    language: 'Greek',
    currency: 'Euro (€)',
    timezone: 'EET (UTC+2)',
    coordinates: [21.8243, 39.0742],
    flag: '🇬🇷',
    description: 'Ancient civilization, mythology, stunning islands, and Mediterranean cuisine.',
    bestTimeToVisit: 'April-June, September-October',
    visaRequired: false,
    attractions: ['Acropolis', 'Santorini', 'Mykonos', 'Delphi'],
    rating: 4.7
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    region: 'Middle East',
    population: '9.9M',
    language: 'Arabic',
    currency: 'Dirham (د.إ)',
    timezone: 'GST (UTC+4)',
    coordinates: [53.8478, 23.4241],
    flag: '🇦🇪',
    description: 'Modern architecture, luxury shopping, and desert adventures.',
    bestTimeToVisit: 'November-March',
    visaRequired: false,
    attractions: ['Burj Khalifa', 'Dubai Mall', 'Sheikh Zayed Mosque', 'Palm Jumeirah'],
    rating: 4.6
  }
];

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'];

const WorldAtlas = ({ onCountrySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter countries based on search and region
  const filteredCountries = useMemo(() => {
    return COUNTRIES_DATA.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           country.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           country.attractions.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  // Toggle favorite
  const toggleFavorite = useCallback((countryId, e) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(countryId) 
        ? prev.filter(id => id !== countryId)
        : [...prev, countryId]
    );
  }, []);

  // Handle country selection
  const handleCountryClick = useCallback((country) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  }, [onCountrySelect]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary-500" />
          <h2 className="text-2xl font-bold text-white">World Atlas</h2>
        </div>
        <p className="text-dark-400">Explore countries and plan your next adventure</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search countries, capitals, attractions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap gap-2">
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === region
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:border-dark-600 border border-dark-700'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-dark-400 text-sm">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Countries Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {filteredCountries.map(country => (
          <motion.div
            key={country.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => handleCountryClick(country)}
            className={`group cursor-pointer bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-primary-500 transition-all ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Flag/Preview */}
            <div className={`bg-gradient-to-br from-primary-500/20 to-dark-800 ${
              viewMode === 'list' ? 'w-32 flex items-center justify-center' : 'h-32 flex items-center justify-center'
            }`}>
              <span className="text-6xl">{country.flag}</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-dark-400">
                    <MapPin className="w-3 h-3" />
                    <span>{country.capital}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleFavorite(country.id, e)}
                  className="p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.includes(country.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-dark-500'
                    }`} 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-dark-500">{country.region}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{country.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Country Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl border border-dark-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500/30 to-dark-900">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="absolute top-4 right-4 p-2 bg-dark-900/70 rounded-full text-white hover:bg-dark-900"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 flex items-end gap-4">
                  <span className="text-7xl">{selectedCountry.flag}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedCountry.name}</h2>
                    <p className="text-dark-400">{selectedCountry.capital}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-dark-800 rounded-lg p-3">
                    <div className="text-xs text-dark-500 mb-1">Population</div>
                    <div className="text-white font-semibold">{selectedCountry.population}</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3">
                    <div className="text-xs text-dark-500 mb-1">Language</div>
                    <div className="text-white font-semibold">{selectedCountry.language}</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3">
                    <div className="text-xs text-dark-500 mb-1">Currency</div>
                    <div className="text-white font-semibold">{selectedCountry.currency}</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3">
                    <div className="text-xs text-dark-500 mb-1">Timezone</div>
                    <div className="text-white font-semibold">{selectedCountry.timezone}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary-500" />
                    About
                  </h3>
                  <p className="text-dark-400">{selectedCountry.description}</p>
                </div>

                {/* Attractions */}
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    Top Attractions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCountry.attractions.map((attraction, idx) => (
                      <div key={idx} className="bg-dark-800 rounded-lg p-3 text-sm text-dark-300">
                        {attraction}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="text-sm text-dark-500 mb-1">Best Time to Visit</div>
                    <div className="text-white font-medium">{selectedCountry.bestTimeToVisit}</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="text-sm text-dark-500 mb-1">Visa Requirements</div>
                    <div className={`font-medium ${selectedCountry.visaRequired ? 'text-orange-400' : 'text-green-400'}`}>
                      {selectedCountry.visaRequired ? 'Visa Required' : 'Visa Free'}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{selectedCountry.rating}</span>
                    <span className="text-dark-500">/ 5.0</span>
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(selectedCountry.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      favorites.includes(selectedCountry.id)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-dark-800 text-dark-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedCountry.id) ? 'fill-current' : ''}`} />
                    {favorites.includes(selectedCountry.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorldAtlas;

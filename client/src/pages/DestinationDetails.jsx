import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Globe2, Star, ArrowRight, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { destinationService } from '../services/api';
import DestinationCard from '../components/destinations/DestinationCard';
import WorldMap from '../components/maps/WorldMap';

const continents = [
  { id: 'all', label: 'All', icon: '🌍' },
  { id: 'europe', label: 'Europe', icon: '🇪🇺' },
  { id: 'asia', label: 'Asia', icon: '🌏' },
  { id: 'north-america', label: 'North America', icon: '🌎' },
  { id: 'south-america', label: 'South America', icon: '🌎' },
  { id: 'africa', label: 'Africa', icon: '🌍' },
  { id: 'oceania', label: 'Oceania', icon: '🌏' }
];

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or map

  const { data, isLoading } = useQuery({
    queryKey: ['destinations', selectedContinent],
    queryFn: () => destinationService.getAll({ 
      continent: selectedContinent !== 'all' ? selectedContinent : undefined 
    }).then(res => res.data)
  });

  const { data: featuredData } = useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: () => destinationService.getFeatured().then(res => res.data)
  });

  const filteredDestinations = data?.destinations?.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location?.country?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-secondary-900/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Explore Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-dark-300 max-w-2xl mx-auto mb-8"
          >
            Discover amazing places around the world through immersive virtual experiences
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="input pl-12"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      {featuredData?.destinations?.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-white">
                Featured Destinations
              </h2>
              <Link
                to="/destinations?featured=true"
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData.destinations.slice(0, 3).map((destination, index) => (
                <DestinationCard 
                  key={destination._id} 
                  destination={destination}
                  index={index}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Continent Filter */}
      <section className="py-8 px-4 border-y border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {continents.map((continent) => (
                <button
                  key={continent.id}
                  onClick={() => setSelectedContinent(continent.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedContinent === continent.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <span>{continent.icon}</span>
                  <span className="text-sm font-medium">{continent.label}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-dark-700 text-white' : 'text-dark-400'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-dark-700 text-white' : 'text-dark-400'}`}
              >
                <Globe2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'map' ? (
            <div className="h-[600px] rounded-2xl overflow-hidden">
              <WorldMap destinations={filteredDestinations} />
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="card overflow-hidden">
                      <div className="aspect-[4/3] skeleton" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 skeleton rounded w-3/4" />
                        <div className="h-4 skeleton rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-12">
                  <Globe2 className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark-200 mb-2">
                    No destinations found
                  </h3>
                  <p className="text-dark-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDestinations.map((destination, index) => (
                    <DestinationCard
                      key={destination._id}
                      destination={destination}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;
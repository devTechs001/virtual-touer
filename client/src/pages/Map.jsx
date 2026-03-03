import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass as CompassIcon, Globe, Cloud, BookOpen, DollarSign, Map as MapIcon, Camera, Plane, Zap } from 'lucide-react';
import InteractiveMap from '../components/maps/InteractiveMap';
import Compass from '../components/maps/Compass';
import WorldAtlas from '../components/maps/WorldAtlas';
import WeatherWidget from '../components/destination/WeatherWidget';
import TravelGuide from '../components/destination/TravelGuide';
import CurrencyConverter from '../components/destination/CurrencyConverter';
import NearbyPlaces from '../components/destination/NearbyPlaces';
import TimelineView from '../components/destination/TimelineView';
import PhotoGallery from '../components/common/PhotoGallery';
import ARView from '../components/vr/ARView';
import { AFRICAN_DESTINATIONS, MYSTERIOUS_DESTINATIONS } from '../data/destinations-enhanced';

const TOOL_TABS = [
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'compass', label: 'Compass', icon: CompassIcon },
  { id: 'atlas', label: 'Atlas', icon: Globe },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'guide', label: 'Guide', icon: BookOpen },
  { id: 'currency', label: 'Currency', icon: DollarSign },
  { id: 'nearby', label: 'Nearby', icon: MapIcon },
  { id: 'timeline', label: 'Timeline', icon: Plane },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'ar', label: 'AR View', icon: Zap }
];

// Sample tour data for map
const SAMPLE_TOURS = [
  ...AFRICAN_DESTINATIONS.map(d => ({
    _id: d.id,
    title: d.name,
    location: { coordinates: d.coordinates, city: d.country },
    images: d.images,
    rating: d.rating
  })),
  ...MYSTERIOUS_DESTINATIONS.map(d => ({
    _id: d.id,
    title: d.name,
    location: { coordinates: d.coordinates },
    rating: 4.5
  }))
];

export default function Map() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAR, setShowAR] = useState(false);

  const handleCountrySelect = useCallback((country) => {
    setSelectedCountry(country);
    setActiveTab('weather');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="h-[600px] rounded-2xl overflow-hidden">
            <InteractiveMap tours={SAMPLE_TOURS} />
          </div>
        );

      case 'compass':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Compass showDebugInfo={true} />
          </div>
        );

      case 'atlas':
        return <WorldAtlas onCountrySelect={handleCountrySelect} />;

      case 'weather':
        return (
          <div className="max-w-2xl mx-auto">
            <WeatherWidget
              location={selectedCountry?.capital || 'Paris'}
              showForecast={true}
            />
          </div>
        );

      case 'guide':
        return <TravelGuide destination={selectedCountry} />;

      case 'currency':
        return <CurrencyConverter />;

      case 'nearby':
        return <NearbyPlaces location={selectedCountry?.capital || 'Paris'} />;

      case 'timeline':
        return <TimelineView destination={selectedCountry} duration={5} />;

      case 'gallery':
        return (
          <PhotoGallery
            images={SAMPLE_TOURS.slice(0, 9).map(t => ({
              id: t._id,
              src: t.images?.[0] || '/images/placeholder.jpg',
              alt: t.title
            }))}
            title="Destination Gallery"
          />
        );

      case 'ar':
        return (
          <div className="text-center py-12">
            <div className="mb-6">
              <Zap className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AR Experience</h3>
              <p className="text-dark-400 mb-6">
                Point your camera at landmarks to see augmented reality information
              </p>
            </div>
            <button
              onClick={() => setShowAR(true)}
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-semibold transition-colors"
            >
              Launch AR Camera
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="section-title mb-2">Explore & Tools</h1>
        <p className="text-dark-400">
          Interactive maps, compass, weather, and travel planning tools
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {TOOL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:border-dark-600 border border-dark-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        {renderContent()}
      </motion.div>

      {/* African Destinations Quick Access */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Featured African Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {AFRICAN_DESTINATIONS.slice(0, 6).map((dest) => (
            <button
              key={dest.id}
              onClick={() => {
                setSelectedCountry({
                  name: dest.name,
                  region: dest.region,
                  capital: dest.country
                });
                setActiveTab('guide');
              }}
              className="group bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-primary-500 transition-colors"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-dark-800 flex items-center justify-center">
                <span className="text-4xl">{dest.flag}</span>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm group-hover:text-primary-400 transition-colors truncate">
                  {dest.name}
                </h3>
                <p className="text-xs text-dark-500 mt-1">{dest.country}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mysterious Destinations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Mysterious Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MYSTERIOUS_DESTINATIONS.slice(0, 4).map((dest) => (
            <div
              key={dest.id}
              className="bg-gradient-to-br from-purple-500/20 to-dark-800 rounded-xl border border-purple-500/30 p-4"
            >
              <div className="text-3xl mb-2">{dest.flag}</div>
              <h3 className="font-semibold text-white">{dest.name}</h3>
              <p className="text-xs text-dark-400 mt-1">{dest.country}</p>
              <p className="text-xs text-purple-400 mt-2 line-clamp-2">{dest.mystery}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AR Modal */}
      <AnimatePresence>
        {showAR && (
          <ARView
            destination={selectedCountry}
            onClose={() => setShowAR(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

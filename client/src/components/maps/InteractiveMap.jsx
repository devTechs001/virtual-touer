import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Set Mapbox token with fallback for development
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
if (mapboxToken && mapboxToken.trim()) {
  mapboxgl.accessToken = mapboxToken;
} else {
  // Use a default public token for development (limited usage)
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2x4eHh4eHh4eHh4eCJ9.xxxxxxxxxxxxxxx';
}

// African Destinations Data (Kenya First, then Africa)
const africanDestinations = [
  // Kenya (Priority 1-10)
  { name: 'Maasai Mara', coordinates: [35.1426, -1.4061], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Diani Beach', coordinates: [39.5736, -4.2833], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Mount Kenya', coordinates: [37.3083, -0.1521], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Nairobi', coordinates: [36.8219, -1.2921], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Amboseli', coordinates: [37.2606, -2.6527], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Lamu Island', coordinates: [40.9020, -2.2717], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Tsavo East', coordinates: [38.7500, -2.5000], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Lake Nakuru', coordinates: [36.1000, -0.3500], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Samburu', coordinates: [37.5333, 0.5667], country: 'Kenya', flag: '🇰🇪', type: 'destination' },
  { name: 'Hell\'s Gate', coordinates: [36.2667, -0.9000], country: 'Kenya', flag: '🇰🇪', type: 'destination' },

  // Tanzania (Priority 11-15)
  { name: 'Serengeti', coordinates: [34.8333, -2.3333], country: 'Tanzania', flag: '🇹🇿', type: 'destination' },
  { name: 'Zanzibar', coordinates: [39.2083, -6.1659], country: 'Tanzania', flag: '🇹🇿', type: 'destination' },
  { name: 'Kilimanjaro', coordinates: [37.3556, -3.0674], country: 'Tanzania', flag: '🇹🇿', type: 'destination' },
  { name: 'Ngorongoro', coordinates: [35.5000, -3.2000], country: 'Tanzania', flag: '🇹🇿', type: 'destination' },
  { name: 'Tarangire', coordinates: [36.0000, -3.8333], country: 'Tanzania', flag: '🇹🇿', type: 'destination' },

  // Uganda & Rwanda (Priority 16-18)
  { name: 'Bwindi Forest', coordinates: [29.6667, -1.0333], country: 'Uganda', flag: '🇺🇬', type: 'destination' },
  { name: 'Murchison Falls', coordinates: [31.6667, 2.2833], country: 'Uganda', flag: '🇺🇬', type: 'destination' },
  { name: 'Volcanoes NP', coordinates: [29.5000, -1.5000], country: 'Rwanda', flag: '🇷🇼', type: 'destination' },

  // Southern Africa (Priority 19-22)
  { name: 'Cape Town', coordinates: [18.4241, -33.9249], country: 'South Africa', flag: '🇿🇦', type: 'destination' },
  { name: 'Kruger Park', coordinates: [31.5000, -24.0000], country: 'South Africa', flag: '🇿🇦', type: 'destination' },
  { name: 'Victoria Falls', coordinates: [25.8567, -17.9243], country: 'Zimbabwe', flag: '🇿🇼', type: 'destination' },
  { name: 'Okavango Delta', coordinates: [22.7500, -19.5000], country: 'Botswana', flag: '🇧🇼', type: 'destination' },

  // North Africa (Priority 23-25)
  { name: 'Pyramids of Giza', coordinates: [31.1342, 29.9792], country: 'Egypt', flag: '🇪🇬', type: 'destination' },
  { name: 'Luxor', coordinates: [32.6396, 25.6872], country: 'Egypt', flag: '🇪🇬', type: 'destination' },
  { name: 'Marrakech', coordinates: [-7.9811, 31.6295], country: 'Morocco', flag: '🇲🇦', type: 'destination' },
  { name: 'Sahara Desert', coordinates: [-5.0000, 31.0000], country: 'Morocco', flag: '🇲🇦', type: 'destination' },

  // East Africa Extended (Priority 26-28)
  { name: 'Lalibela', coordinates: [39.0472, 12.0319], country: 'Ethiopia', flag: '🇪🇹', type: 'destination' },
  { name: 'Sossusvlei', coordinates: [15.2919, -24.7272], country: 'Namibia', flag: '🇳🇦', type: 'destination' },
  { name: 'Avenue of Baobabs', coordinates: [44.4167, -20.2500], country: 'Madagascar', flag: '🇲🇬', type: 'destination' }
];

const InteractiveMap = ({
  tours = [],
  destinations = [],
  center = [37.9062, 0.3476], // Center on Kenya/East Africa
  zoom = 3.5, // Zoomed in to show Africa prominently
  onMarkerClick,
  selectedId = null,
  showAfricanDestinations = true // New prop to toggle African destinations
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showDestinations, setShowDestinations] = useState(showAfricanDestinations);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add tour markers
    tours.forEach(tour => {
      if (!tour.location?.coordinates) return;

      const el = document.createElement('div');
      el.className = 'tour-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50 cursor-pointer transform transition-transform hover:scale-110 border-2 border-white">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedTour(tour);
        onMarkerClick?.(tour);
        map.current.flyTo({
          center: tour.location.coordinates,
          zoom: 10,
          duration: 1500
        });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(tour.location.coordinates)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Add African destination markers
    if (showDestinations) {
      africanDestinations.forEach((dest, index) => {
        const isKenya = dest.country === 'Kenya';
        const priority = index < 10 ? 'high' : index < 20 ? 'medium' : 'low';

        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.innerHTML = `
          <div class="w-${isKenya ? '10' : priority === 'high' ? '8' : '6'} h-${isKenya ? '10' : priority === 'high' ? '8' : '6'}
                      ${isKenya ? 'bg-green-500' : priority === 'high' ? 'bg-blue-500' : 'bg-purple-500'}
                      rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform hover:scale-125 border-2 border-white text-xs">
            ${dest.flag}
          </div>
        `;

        el.addEventListener('click', () => {
          map.current.flyTo({
            center: dest.coordinates,
            zoom: isKenya ? 7 : 6,
            duration: 2000
          });
          // Show destination info
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(dest.coordinates)
            .setHTML(`
              <div class="p-2 bg-dark-800 rounded-lg border border-dark-700 max-w-[200px]">
                <h3 class="font-bold text-white text-sm">${dest.flag} ${dest.name}</h3>
                <p class="text-dark-300 text-xs mt-1">${dest.country}</p>
                <a href="/destinations" class="text-primary-400 text-xs mt-2 inline-block hover:underline">Explore →</a>
              </div>
            `)
            .addTo(map.current);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(dest.coordinates)
          .addTo(map.current);

        markersRef.current.push(marker);
      });
    }

    // Fit bounds if tours exist
    if (tours.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      tours.forEach(tour => {
        if (tour.location?.coordinates) {
          bounds.extend(tour.location.coordinates);
        }
      });

      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 10
        });
      }
    }
  }, [tours, mapLoaded, showDestinations]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />

      {/* African Destinations Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowDestinations(!showDestinations)}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg transition-all ${
            showDestinations
              ? 'bg-green-500 text-white'
              : 'bg-dark-800 text-dark-300 border border-dark-600'
          }`}
        >
          <span className="text-lg">🌍</span>
          <span>African Destinations</span>
          <span className={`px-2 py-0.5 rounded text-xs ${
            showDestinations ? 'bg-white/20' : 'bg-dark-700'
          }`}>
            {africanDestinations.length}
          </span>
        </button>
      </div>

      {/* Legend */}
      {showDestinations && (
        <div className="absolute bottom-4 left-4 z-10 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3 border border-dark-700 shadow-xl">
          <h4 className="text-xs font-semibold text-white mb-2">🇰🇪 Africa Focus</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
              <span className="text-dark-300">Kenya (Priority)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
              <span className="text-dark-300">East Africa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div>
              <span className="text-dark-300">Rest of Africa</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Tour Popup */}
      <AnimatePresence>
        {selectedTour && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-xl"
          >
            <div className="relative">
              <img
                src={selectedTour.images?.[0] || '/placeholder-tour.jpg'}
                alt={selectedTour.title}
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute top-2 right-2 p-1.5 bg-dark-900/70 rounded-full text-white hover:bg-dark-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-dark-100 mb-1">
                {selectedTour.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-dark-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>
                  {selectedTour.location?.city}, {selectedTour.location?.country}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-dark-100">
                    {selectedTour.rating?.toFixed(1) || 'New'}
                  </span>
                </div>
                <Link
                  to={`/tour/${selectedTour._id}`}
                  className="btn-primary text-sm py-2"
                >
                  View Tour
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMap;
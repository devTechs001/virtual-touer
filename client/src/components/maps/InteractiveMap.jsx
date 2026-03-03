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

const InteractiveMap = ({ 
  tours = [], 
  destinations = [],
  center = [0, 20],
  zoom = 2,
  onMarkerClick,
  selectedId = null 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
  }, [tours, mapLoaded]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />

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
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WorldMapStats = ({ data = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
      attributionControl: false,
      interactive: true
    });

    map.current.on('load', () => {
      // Add tour location markers
      if (data.length > 0) {
        data.forEach((item) => {
          const el = document.createElement('div');
          el.className = 'tour-marker';
          el.innerHTML = `
            <div class="relative">
              <div class="w-4 h-4 bg-primary-500 rounded-full animate-ping absolute" style="animation-duration: 2s;"></div>
              <div class="w-4 h-4 bg-primary-500 rounded-full relative"></div>
            </div>
          `;

          el.addEventListener('mouseenter', () => {
            setHoveredCountry(item);
          });

          el.addEventListener('mouseleave', () => {
            setHoveredCountry(null);
          });

          new mapboxgl.Marker(el)
            .setLngLat(item.coordinates)
            .addTo(map.current);
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative h-96 rounded-xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-dark-800/90 backdrop-blur-sm rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-2">Tour Hotspots</h4>
        <div className="flex items-center gap-2 text-sm text-dark-300">
          <div className="w-3 h-3 bg-primary-500 rounded-full" />
          <span>Active Tours</span>
        </div>
      </div>

      {/* Hover Info */}
      {hoveredCountry && (
        <div className="absolute top-4 right-4 bg-dark-800/90 backdrop-blur-sm rounded-xl p-4 min-w-48">
          <h4 className="font-medium text-white">{hoveredCountry.country}</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Tours:</span>
              <span className="text-white">{hoveredCountry.tours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Views:</span>
              <span className="text-white">{hoveredCountry.views?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Revenue:</span>
              <span className="text-primary-400">${hoveredCountry.revenue?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMapStats;
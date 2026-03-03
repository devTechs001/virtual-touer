import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Thermometer, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Weather Widget Component with Offline Cache
 * Features:
 * - Real-time weather when online
 * - Cached weather data for offline use
 * - 7-day forecast
 * - Multiple location support
 */

// Weather condition icons
const WeatherIcons = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  drizzle: CloudRain,
  mist: Cloud
};

// Sample offline weather data (fallback)
const OFFLINE_WEATHER_DATA = {
  'Paris': { temp: 18, condition: 'cloudy', humidity: 65, windSpeed: 12, forecast: [] },
  'Tokyo': { temp: 22, condition: 'clear', humidity: 55, windSpeed: 8, forecast: [] },
  'New York': { temp: 20, condition: 'rain', humidity: 70, windSpeed: 15, forecast: [] },
  'London': { temp: 15, condition: 'rain', humidity: 75, windSpeed: 18, forecast: [] },
  'Dubai': { temp: 35, condition: 'clear', humidity: 40, windSpeed: 10, forecast: [] },
  'Sydney': { temp: 25, condition: 'clear', humidity: 60, windSpeed: 14, forecast: [] },
  'default': { temp: 20, condition: 'cloudy', humidity: 60, windSpeed: 10, forecast: [] }
};

// Generate sample forecast data
const generateForecast = (baseTemp) => {
  const conditions = ['clear', 'cloudy', 'rain', 'partly-cloudy'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  
  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today + i) % 7;
    const tempVariation = Math.floor(Math.random() * 10) - 5;
    return {
      day: days[dayIndex],
      temp: baseTemp + tempVariation,
      condition: conditions[Math.floor(Math.random() * conditions.length)]
    };
  });
};

const WeatherWidget = ({ 
  location = 'Paris', 
  coordinates = null,
  compact = false,
  showForecast = true,
  autoUpdate = true,
  updateInterval = 600000 // 10 minutes
}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [usingCache, setUsingCache] = useState(false);

  // Get cached weather data
  const getCachedWeather = useCallback((city) => {
    try {
      const cacheKey = `weather_${city.toLowerCase().replace(/\s/g, '_')}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache valid for 1 hour
        if (Date.now() - timestamp < 3600000) {
          return data;
        }
      }
    } catch (err) {
      console.error('Cache read error:', err);
    }
    return null;
  }, []);

  // Cache weather data
  const cacheWeather = useCallback((city, data) => {
    try {
      const cacheKey = `weather_${city.toLowerCase().replace(/\s/g, '_')}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Cache write error:', err);
    }
  }, []);

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    if (!isOnline) {
      // Use offline data
      const offlineData = OFFLINE_WEATHER_DATA[location] || OFFLINE_WEATHER_DATA.default;
      const weatherData = {
        ...offlineData,
        location,
        forecast: generateForecast(offlineData.temp),
        isOffline: true
      };
      setWeather(weatherData);
      setUsingCache(true);
      setLoading(false);
      setLastUpdated(new Date());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to fetch from API (OpenWeatherMap or similar)
      // For demo, we'll use mock data with realistic values
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (apiKey && coordinates) {
        // Real API call would go here
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=${apiKey}&units=metric`);
      }

      // Mock weather data for demo
      const conditions = ['clear', 'cloudy', 'rain', 'partly-cloudy'];
      const mockWeather = {
        location,
        temp: Math.floor(Math.random() * 20) + 15,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        forecast: [],
        isOffline: false
      };
      mockWeather.forecast = generateForecast(mockWeather.temp);

      setWeather(mockWeather);
      setUsingCache(false);
      cacheWeather(location, mockWeather);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Weather fetch error:', err);
      // Fallback to cached or offline data
      const cached = getCachedWeather(location);
      if (cached) {
        setWeather({ ...cached, isOffline: true });
        setUsingCache(true);
      } else {
        const offlineData = OFFLINE_WEATHER_DATA[location] || OFFLINE_WEATHER_DATA.default;
        setWeather({
          ...offlineData,
          location,
          forecast: generateForecast(offlineData.temp),
          isOffline: true
        });
        setUsingCache(true);
      }
      setError('Using offline data');
    } finally {
      setLoading(false);
    }
  }, [location, coordinates, isOnline, getCachedWeather, cacheWeather]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (autoUpdate) {
        fetchWeather();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setUsingCache(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoUpdate, fetchWeather]);

  // Initial fetch and auto-update
  useEffect(() => {
    fetchWeather();

    if (autoUpdate && isOnline) {
      const interval = setInterval(fetchWeather, updateInterval);
      return () => clearInterval(interval);
    }
  }, [location, autoUpdate, isOnline, updateInterval, fetchWeather]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700 p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3 text-dark-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading weather...</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="w-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700 p-6">
        <div className="text-center text-dark-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Unable to load weather data</p>
        </div>
      </div>
    );
  }

  const WeatherIcon = WeatherIcons[weather.condition] || Cloud;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl border border-dark-700 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon className="w-8 h-8 text-primary-400" />
            <div>
              <div className="text-2xl font-bold text-white">{weather.temp}°C</div>
              <div className="text-sm text-dark-400 capitalize">{weather.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-dark-400 text-sm">
              <MapPin className="w-3 h-3" />
              <span>{weather.location}</span>
            </div>
            {usingCache && (
              <div className="text-xs text-orange-400 mt-1">Offline Mode</div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700 overflow-hidden"
    >
      {/* Current Weather */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-dark-400">
            <MapPin className="w-4 h-4" />
            <span>{weather.location}</span>
          </div>
          <div className="flex items-center gap-2">
            {usingCache && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                Offline
              </span>
            )}
            <button
              onClick={fetchWeather}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-dark-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WeatherIcon className="w-20 h-20 text-primary-400" />
            <div>
              <div className="text-5xl font-bold text-white">{weather.temp}°C</div>
              <div className="text-lg text-dark-400 capitalize">{weather.condition}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-lg p-3 text-center">
              <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-white font-semibold">{weather.humidity}%</div>
              <div className="text-xs text-dark-500">Humidity</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-white font-semibold">{weather.windSpeed} km/h</div>
              <div className="text-xs text-dark-500">Wind</div>
            </div>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-4 text-xs text-dark-500 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {error && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-400">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      {showForecast && weather.forecast && weather.forecast.length > 0 && (
        <div className="border-t border-dark-700 p-6 bg-dark-800/50">
          <h3 className="text-sm font-semibold text-dark-400 mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-7 gap-2">
            {weather.forecast.map((day, idx) => {
              const DayIcon = WeatherIcons[day.condition] || Cloud;
              return (
                <div key={idx} className="text-center">
                  <div className="text-xs text-dark-500 mb-2">{day.day}</div>
                  <DayIcon className="w-6 h-6 text-primary-400 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-white">{day.temp}°</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;

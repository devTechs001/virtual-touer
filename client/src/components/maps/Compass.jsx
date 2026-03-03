import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, AlertCircle, RefreshCw, Compass as CompassIcon } from 'lucide-react';

/**
 * Enhanced Compass Component with Offline Fallback
 * Features:
 * - Device orientation API for real compass heading
 * - Auto-fallback to North mode when offline/orientation unavailable
 * - Visual indicators for mode status
 * - Smooth animations and modern UI
 */
const Compass = ({ onHeadingChange, showDebugInfo = false }) => {
  const [heading, setHeading] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [mode, setMode] = useState('auto'); // 'compass', 'north', 'manual'
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const headingRef = useRef(heading);
  const watchIdRef = useRef(null);

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = useCallback(async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          startOrientationTracking();
        } else {
          setPermissionGranted(false);
          setMode('north');
          setError('Permission denied. Using North mode.');
        }
      } else {
        // Non-iOS devices - start directly
        setPermissionGranted(true);
        startOrientationTracking();
      }
    } catch (err) {
      console.error('Orientation permission error:', err);
      setPermissionGranted(false);
      setMode('north');
      setError('Orientation not available. Using North mode.');
    }
  }, []);

  // Start orientation tracking
  const startOrientationTracking = useCallback(() => {
    if (watchIdRef.current) return;

    const handleOrientation = (event) => {
      let newHeading;
      
      // Use webkitCompassHeading for iOS, alpha for others
      if (event.webkitCompassHeading !== undefined) {
        newHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android and other devices - need to account for screen orientation
        newHeading = 360 - event.alpha;
      }

      if (newHeading !== undefined && !isNaN(newHeading)) {
        const normalizedHeading = Math.round(newHeading % 360);
        setHeading(normalizedHeading);
        headingRef.current = normalizedHeading;
        setIsCalibrated(true);
        setError(null);
        setMode('compass');
        onHeadingChange?.(normalizedHeading);
      }
    };

    watchIdRef.current = { current: handleOrientation };
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [onHeadingChange]);

  // Stop orientation tracking
  const stopOrientationTracking = useCallback(() => {
    if (watchIdRef.current) {
      window.removeEventListener('deviceorientation', watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (mode === 'north') {
        // Try to re-enable compass when back online
        requestOrientationPermission();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Auto-fallback to North mode when offline
      setMode('north');
      stopOrientationTracking();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [mode, requestOrientationPermission, stopOrientationTracking]);

  // Initialize compass on mount
  useEffect(() => {
    // Check if we're offline initially
    if (!navigator.onLine) {
      setMode('north');
      setIsOnline(false);
      return;
    }

    // Request orientation permission
    requestOrientationPermission();

    // Fallback timeout - if no orientation data after 3 seconds, switch to North mode
    const fallbackTimeout = setTimeout(() => {
      if (!isCalibrated && mode !== 'north') {
        setMode('north');
        setError('Compass unavailable. Using North mode.');
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      stopOrientationTracking();
    };
  }, []);

  // Manual calibration/reset
  const handleCalibrate = () => {
    setHeading(0);
    setMode('north');
    setError(null);
  };

  // Toggle between modes
  const toggleMode = () => {
    if (mode === 'compass') {
      setMode('north');
      stopOrientationTracking();
    } else {
      setMode('compass');
      requestOrientationPermission();
    }
  };

  // Get cardinal direction
  const getCardinalDirection = (h) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(h / 45) % 8;
    return directions[index];
  };

  const cardinalDirection = getCardinalDirection(heading);

  return (
    <div className="relative">
      {/* Main Compass */}
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 border-4 border-dark-700 shadow-2xl shadow-primary-500/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer Ring with Degree Markers */}
        <div className="absolute inset-2 rounded-full border-2 border-dark-600">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
            <div
              key={degree}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${degree}deg)` }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-dark-500 text-xs font-medium">
                {degree === 0 && 'N'}
                {degree === 45 && 'NE'}
                {degree === 90 && 'E'}
                {degree === 135 && 'SE'}
                {degree === 180 && 'S'}
                {degree === 225 && 'SW'}
                {degree === 270 && 'W'}
                {degree === 315 && 'NW'}
              </div>
            </div>
          ))}
        </div>

        {/* Rotating Compass Rose */}
        <motion.div
          className="absolute inset-4 rounded-full"
          animate={{ rotate: mode === 'compass' ? -heading : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* North Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
            <motion.div
              className="w-0 h-0 border-l-8 border-r-8 border-b-[20px] border-l-transparent border-r-transparent border-b-red-500 filter drop-shadow-lg"
              animate={{ scale: mode === 'north' ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: mode === 'north' ? Infinity : 0 }}
            />
          </div>
          
          {/* South Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <Navigation className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Current Heading Display */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <motion.div
            key={heading}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            {heading}°
          </motion.div>
          <div className="text-dark-400 text-sm font-medium">{cardinalDirection}</div>
        </div>

        {/* Mode Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-16">
          <motion.button
            onClick={toggleMode}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              mode === 'compass'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                : 'bg-dark-700 text-dark-400 border border-dark-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode === 'compass' ? '🧭 Compass' : '⬆️ North'}
          </motion.button>
        </div>
      </motion.div>

      {/* Status Bar */}
      <AnimatePresence>
        {(error || !isOnline || showDebugInfo) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-lg bg-dark-800 border border-dark-700"
          >
            {!isOnline && (
              <div className="flex items-center gap-2 text-orange-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>You're offline - Compass using North mode</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {showDebugInfo && (
              <div className="mt-2 space-y-1 text-xs text-dark-500">
                <div>Mode: {mode}</div>
                <div>Calibrated: {isCalibrated ? 'Yes' : 'No'}</div>
                <div>Permission: {permissionGranted === null ? 'Pending' : permissionGranted ? 'Granted' : 'Denied'}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibration Button */}
      <motion.button
        onClick={handleCalibrate}
        className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white hover:border-dark-500 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RefreshCw className="w-4 h-4" />
        <span className="text-sm font-medium">Reset to North</span>
      </motion.button>

      {/* Info Tooltip */}
      <div className="mt-2 text-center text-xs text-dark-500">
        {mode === 'compass' 
          ? 'Using device compass sensor' 
          : 'Auto North mode - Works offline'}
      </div>
    </div>
  );
};

export default Compass;

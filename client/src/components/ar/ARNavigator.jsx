import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Navigation,
  MapPin,
  Compass,
  Target,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

const ARNavigator = ({ destination, waypoints = [], onArrival }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    // Start camera
    startCamera();

    // Watch position
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Calculate distance and bearing to current waypoint
        const target = waypoints[currentWaypoint] || destination;
        if (target) {
          const dist = calculateDistance(
            latitude, longitude,
            target.lat, target.lng
          );
          setDistance(dist);

          const bear = calculateBearing(
            latitude, longitude,
            target.lat, target.lng
          );
          setBearing(bear);

          // Check if arrived at waypoint
          if (dist < 10) { // Within 10 meters
            if (currentWaypoint < waypoints.length - 1) {
              setCurrentWaypoint(prev => prev + 1);
              speak(`Arrived at waypoint ${currentWaypoint + 1}. Continue to next point.`);
            } else {
              onArrival?.();
              speak('You have arrived at your destination.');
            }
          }
        }
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    // Watch device orientation
    const handleOrientation = (event) => {
      let heading = event.webkitCompassHeading || event.alpha;
      if (heading) {
        setHeading(heading);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
      stopCamera();
    };
  }, [currentWaypoint, waypoints, destination]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return (θ * 180 / Math.PI + 360) % 360;
  };

  const speak = (text) => {
    if (audioEnabled && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      synthRef.current.speak(utterance);
    }
  };

  const getDirectionArrowRotation = () => {
    return bearing - heading;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* AR Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Direction Arrow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: getDirectionArrowRotation() }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-primary-500/30 backdrop-blur-sm flex items-center justify-center">
            <Navigation className="w-12 h-12 text-primary-400" />
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <ChevronUp className="w-8 h-8 text-primary-400 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {waypoints[currentWaypoint]?.name || destination?.name}
              </p>
              <p className="text-sm text-dark-400">
                {distance ? formatDistance(distance) : 'Calculating...'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-3 bg-dark-800/80 backdrop-blur-sm rounded-full text-white"
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Waypoints Progress */}
      {waypoints.length > 0 && (
        <div className="absolute top-24 left-4 right-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-400">
              Waypoint {currentWaypoint + 1} of {waypoints.length}
            </span>
          </div>
          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500"
              animate={{ width: `${((currentWaypoint + 1) / waypoints.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="bg-dark-800/90 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Head {getDirectionText(getDirectionArrowRotation())}
                </p>
                <p className="text-sm text-dark-400">
                  {distance ? `${formatDistance(distance)} remaining` : 'Calculating route...'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-white">{Math.round(heading)}°</p>
              <p className="text-xs text-dark-500">Heading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getDirectionText = (angle) => {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized < 22.5 || normalized >= 337.5) return 'straight';
  if (normalized < 67.5) return 'slight right';
  if (normalized < 112.5) return 'right';
  if (normalized < 157.5) return 'sharp right';
  if (normalized < 202.5) return 'behind';
  if (normalized < 247.5) return 'sharp left';
  if (normalized < 292.5) return 'left';
  return 'slight left';
};

export default ARNavigator;
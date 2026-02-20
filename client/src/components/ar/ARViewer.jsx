import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Info,
  MapPin,
  Navigation,
  Compass,
  Layers
} from 'lucide-react';

// AR.js and A-Frame integration
const ARViewer = ({ 
  tour, 
  markers = [], 
  onMarkerFound, 
  onClose 
}) => {
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [arMode, setArMode] = useState('marker'); // marker, location, image

  useEffect(() => {
    // Request camera permission
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        initializeAR();
      } catch (error) {
        console.error('Camera permission denied:', error);
        setHasPermission(false);
      }
    };

    requestPermission();

    return () => {
      // Cleanup AR scene
      cleanupAR();
    };
  }, []);

  const initializeAR = () => {
    // Load A-Frame and AR.js dynamically
    const loadScripts = async () => {
      if (!window.AFRAME) {
        await loadScript('https://aframe.io/releases/1.4.0/aframe.min.js');
      }
      if (!window.THREEx) {
        await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
      }
      setIsInitialized(true);
      createARScene();
    };

    loadScripts();
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const createARScene = () => {
    if (!containerRef.current || !window.AFRAME) return;

    // Create A-Frame scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('arjs', `sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;`);
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; antialias: true;');

    // Add markers
    markers.forEach((marker, index) => {
      const markerEl = document.createElement('a-marker');
      markerEl.setAttribute('preset', 'hiro'); // Or use custom marker
      markerEl.setAttribute('id', `marker-${index}`);

      // Add 3D content
      const entity = document.createElement('a-entity');
      entity.setAttribute('gltf-model', marker.model || '');
      entity.setAttribute('scale', '0.5 0.5 0.5');
      entity.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 10000');

      // Add info panel
      const panel = document.createElement('a-plane');
      panel.setAttribute('position', '0 1 0');
      panel.setAttribute('rotation', '-45 0 0');
      panel.setAttribute('width', '2');
      panel.setAttribute('height', '1');
      panel.setAttribute('color', '#1e293b');
      panel.setAttribute('opacity', '0.9');

      const text = document.createElement('a-text');
      text.setAttribute('value', marker.title);
      text.setAttribute('position', '0 0.2 0.01');
      text.setAttribute('align', 'center');
      text.setAttribute('color', 'white');
      text.setAttribute('width', '1.8');

      panel.appendChild(text);
      markerEl.appendChild(entity);
      markerEl.appendChild(panel);

      // Event listeners
      markerEl.addEventListener('markerFound', () => {
        setActiveMarker(marker);
        onMarkerFound?.(marker);
      });

      markerEl.addEventListener('markerLost', () => {
        if (activeMarker?.id === marker.id) {
          setActiveMarker(null);
        }
      });

      scene.appendChild(markerEl);
    });

    // Add camera
    const camera = document.createElement('a-entity');
    camera.setAttribute('camera', '');
    scene.appendChild(camera);

    containerRef.current.appendChild(scene);
  };

  const cleanupAR = () => {
    if (containerRef.current) {
      const scene = containerRef.current.querySelector('a-scene');
      if (scene) {
        scene.remove();
      }
    }
  };

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="text-center p-8">
          <Camera className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Camera Access Required</h2>
          <p className="text-dark-400 mb-6">
            Please allow camera access to use AR features
          </p>
          <button onClick={onClose} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* AR Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading State */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-white">Initializing AR...</p>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-3 bg-dark-800/80 backdrop-blur-sm rounded-full text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-dark-800/80 backdrop-blur-sm rounded-full text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-dark-800/80 backdrop-blur-sm rounded-full text-white"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* AR Mode Selector */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 p-1.5 bg-dark-800/80 backdrop-blur-sm rounded-2xl">
          {[
            { id: 'marker', icon: Layers, label: 'Marker' },
            { id: 'location', icon: MapPin, label: 'Location' },
            { id: 'image', icon: Camera, label: 'Image' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setArMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                arMode === mode.id
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex items-center justify-center gap-4">
          <button className="p-4 bg-dark-800/80 backdrop-blur-sm rounded-full text-white">
            <RotateCcw className="w-6 h-6" />
          </button>
          <button className="p-6 bg-primary-500 rounded-full text-white shadow-lg shadow-primary-500/50">
            <Camera className="w-8 h-8" />
          </button>
          <button className="p-4 bg-dark-800/80 backdrop-blur-sm rounded-full text-white">
            <Compass className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Active Marker Info */}
      <AnimatePresence>
        {activeMarker && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-40 left-4 right-4"
          >
            <div className="bg-dark-800/95 backdrop-blur-lg rounded-2xl p-4 border border-dark-700">
              <div className="flex items-start gap-4">
                {activeMarker.image && (
                  <img
                    src={activeMarker.image}
                    alt={activeMarker.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{activeMarker.title}</h3>
                  <p className="text-sm text-dark-400 mt-1">{activeMarker.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="btn-primary text-sm py-2">
                      Learn More
                    </button>
                    <button className="btn-secondary text-sm py-2">
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-dark-800/95 backdrop-blur-lg border-l border-dark-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">AR Guide</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-dark-700/50 rounded-xl">
                  <h4 className="font-medium text-white mb-2">How to Use</h4>
                  <ul className="space-y-2 text-sm text-dark-300">
                    <li>• Point your camera at AR markers</li>
                    <li>• 3D models will appear on markers</li>
                    <li>• Tap on objects for more info</li>
                    <li>• Use location mode for GPS-based AR</li>
                  </ul>
                </div>

                <div className="p-4 bg-dark-700/50 rounded-xl">
                  <h4 className="font-medium text-white mb-2">Points of Interest</h4>
                  <div className="space-y-2">
                    {markers.map((marker) => (
                      <div
                        key={marker.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-600"
                      >
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <span className="text-dark-200">{marker.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARViewer;
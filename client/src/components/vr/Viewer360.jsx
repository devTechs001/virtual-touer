import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Maximize, 
  Minimize, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Compass,
  Info,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Viewer360 = ({ 
  images = [], 
  hotspots = [], 
  initialImage = 0,
  autoRotate = true,
  showControls = true,
  onHotspotClick 
}) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(initialImage);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    // Initialize Pannellum viewer
    const initViewer = async () => {
      const pannellum = await import('pannellum');
      
      viewerRef.current = pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: images[currentScene].url,
        autoLoad: true,
        autoRotate: autoRotate ? -2 : 0,
        compass: true,
        showControls: false,
        hotSpots: hotspots.map(hs => ({
          ...hs,
          clickHandlerFunc: () => {
            setActiveHotspot(hs);
            onHotspotClick?.(hs);
          }
        })),
        onLoad: () => setIsLoading(false)
      });
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [currentScene, images]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const zoomIn = () => viewerRef.current?.setHfov(viewerRef.current.getHfov() - 10);
  const zoomOut = () => viewerRef.current?.setHfov(viewerRef.current.getHfov() + 10);
  const resetView = () => {
    viewerRef.current?.setYaw(0);
    viewerRef.current?.setPitch(0);
    viewerRef.current?.setHfov(100);
  };

  const nextScene = () => {
    setCurrentScene(prev => (prev + 1) % images.length);
    setIsLoading(true);
  };

  const prevScene = () => {
    setCurrentScene(prev => (prev - 1 + images.length) % images.length);
    setIsLoading(true);
  };

  return (
    <div className="relative w-full h-full bg-dark-900 rounded-2xl overflow-hidden">
      {/* 360 Viewer Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-900/90 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
            />
            <p className="text-dark-400">Loading panorama...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <>
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 bg-dark-900/70 backdrop-blur-sm rounded-lg text-white hover:bg-dark-800 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-dark-900/70 backdrop-blur-sm rounded-xl p-1.5">
              <button
                onClick={zoomOut}
                className="p-2 text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={resetView}
                className="p-2 text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scene Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevScene}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-dark-900/70 backdrop-blur-sm rounded-lg text-white hover:bg-dark-800 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextScene}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-dark-900/70 backdrop-blur-sm rounded-lg text-white hover:bg-dark-800 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Scene Indicators */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentScene(index);
                      setIsLoading(true);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentScene
                        ? 'bg-primary-500 scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Compass */}
          <div className="absolute bottom-4 right-4 p-2.5 bg-dark-900/70 backdrop-blur-sm rounded-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
        </>
      )}

      {/* Hotspot Info Modal */}
      {activeHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-xl"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-dark-100">
                {activeHotspot.title}
              </h3>
              <button
                onClick={() => setActiveHotspot(null)}
                className="p-1 text-dark-500 hover:text-dark-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-dark-400">
              {activeHotspot.description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Viewer360;
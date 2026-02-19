import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../common';

export default function VRViewer({ images, autoRotate = true }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const viewerRef = useRef(null);

  const currentImage = images?.[currentImageIndex] || images?.[0];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 1));
  const handleReset = () => {
    setZoom(1);
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      className={`relative bg-dark-900 rounded-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-96 md:h-[500px]'
      }`}
    >
      {/* VR Viewer */}
      <div
        ref={viewerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        {currentImage ? (
          <img
            src={currentImage.url}
            alt={currentImage.alt || 'VR View'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-white/60">
            <p className="text-lg font-medium">360° View</p>
            <p className="text-sm mt-2">Drag to explore</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
        <Button variant="ghost" size="sm" className="p-2 text-white" onClick={handleZoomIn}>
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="p-2 text-white" onClick={handleZoomOut}>
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="p-2 text-white" onClick={handleReset}>
          <RotateCcw className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-white"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Image Thumbnails */}
      {images?.length > 1 && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img src={image.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info Overlay */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        360° Virtual Tour
      </div>
    </motion.div>
  );
}

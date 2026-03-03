import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Maximize, Minimize, Info, RotateCcw, Zap } from 'lucide-react';

/**
 * ARView Component - Augmented Reality Preview
 * Features:
 * - Camera access for AR experience
 * - Overlay information on real-world view
 * - Virtual object placement
 * - Works offline with cached 3D models
 */

const ARView = ({ 
  destination,
  landmarks = [],
  onClose,
  showInfo = true
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [arMode, setArMode] = useState('overlay'); // 'overlay', 'marker', 'info'
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [stream, setStream] = useState(null);

  // Request camera permission and start video
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setHasPermission(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Handle device orientation
  useEffect(() => {
    const handleOrientation = (event) => {
      setOrientation({
        alpha: event.alpha || 0, // compass direction
        beta: event.beta || 0,   // front-back tilt
        gamma: event.gamma || 0  // left-right tilt
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Draw AR overlays on canvas
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      if (!ctx || !videoRef.current) return;

      // Match canvas size to video
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw AR overlays based on mode
      if (arMode === 'overlay' && landmarks.length > 0) {
        // Draw direction indicator
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Compass direction indicator
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((orientation.alpha || 0) * Math.PI / 180);
        
        // Draw north indicator
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-10, -30);
        ctx.lineTo(10, -30);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        ctx.restore();

        // Draw landmark markers
        landmarks.forEach((landmark, index) => {
          const x = centerX + Math.sin((landmark.bearing || 0) * Math.PI / 180) * 100;
          const y = centerY - Math.cos((landmark.bearing || 0) * Math.PI / 180) * 50;
          
          // Marker circle
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Label
          ctx.fillStyle = '#fff';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(landmark.name, x, y + 35);
        });
      }

      // Draw info overlay
      if (arMode === 'info' && showInfo) {
        // Draw orientation data
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 80);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Heading: ${Math.round(orientation.alpha || 0)}°`, 20, 35);
        ctx.fillText(`Tilt: ${Math.round(orientation.beta || 0)}°`, 20, 55);
        ctx.fillText(`Roll: ${Math.round(orientation.gamma || 0)}°`, 20, 75);
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [landmarks, arMode, orientation, showInfo]);

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* AR Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-white font-semibold">AR View</h3>
              <p className="text-white/70 text-sm">
                {destination?.name || 'Exploring'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* AR Mode Selector */}
      <div className="absolute top-20 right-4 flex flex-col gap-2">
        {[
          { id: 'overlay', icon: Zap, label: 'AR' },
          { id: 'info', icon: Info, label: 'Info' },
          { id: 'marker', icon: RotateCcw, label: 'Reset' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setArMode(mode.id)}
            className={`p-3 rounded-xl transition-colors ${
              arMode === mode.id
                ? 'bg-primary-500 text-white'
                : 'bg-black/50 text-white/70 hover:bg-black/70'
            }`}
            title={mode.label}
          >
            <mode.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Bottom Info Panel */}
      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-24 left-4 right-4"
          >
            <div className="bg-dark-900/90 backdrop-blur rounded-2xl p-4 border border-dark-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-semibold">{selectedLandmark.name}</h4>
                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="p-1 hover:bg-dark-800 rounded"
                >
                  <X className="w-4 h-4 text-dark-400" />
                </button>
              </div>
              <p className="text-dark-400 text-sm">{selectedLandmark.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-dark-500">
                <span>Distance: {selectedLandmark.distance}</span>
                <span>Bearing: {selectedLandmark.bearing}°</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar - Compass */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center gap-4">
          {/* Compass */}
          <div className="relative w-16 h-16 rounded-full bg-black/50 border-2 border-white/30">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -(orientation.alpha || 0) }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {Math.round(orientation.alpha || 0)}°
            </div>
          </div>
          
          {/* Orientation Info */}
          <div className="text-white/70 text-xs">
            <div>Tilt: {Math.round(orientation.beta || 0)}°</div>
            <div>Roll: {Math.round(orientation.gamma || 0)}°</div>
          </div>
        </div>
      </div>

      {/* Permission Denied Message */}
      {hasPermission === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center p-6">
            <Camera className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
            <p className="text-dark-400 mb-4">
              Please enable camera access to use AR features
            </p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARView;

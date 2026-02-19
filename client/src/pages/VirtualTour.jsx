import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Info,
  Map,
  List,
  Settings,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Layers,
  MessageCircle,
  Users,
  Share2,
  Heart,
  Download
} from 'lucide-react';

import Viewer360 from '../components/vr/Viewer360';
import { useTour } from '../hooks/useTours';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';

const VirtualTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [viewers, setViewers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const containerRef = useRef(null);
  const audioRef = useRef(null);

  const { data, isLoading, error } = useTour(id);
  const tour = data?.tour;

  // Socket connection for live features
  useEffect(() => {
    if (socket && id) {
      socket.emit('join-tour', id);

      socket.on('viewer-joined', (data) => {
        setViewers(data.viewers);
      });

      socket.on('viewer-left', (data) => {
        setViewers(data.viewers);
      });

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.emit('leave-tour', id);
        socket.off('viewer-joined');
        socket.off('viewer-left');
        socket.off('new-message');
      };
    }
  }, [socket, id]);

  // Auto-play tour
  useEffect(() => {
    if (isPlaying && tour?.panoramas) {
      const interval = setInterval(() => {
        setCurrentScene(prev => 
          prev < tour.panoramas.length - 1 ? prev + 1 : 0
        );
      }, 10000); // 10 seconds per scene

      return () => clearInterval(interval);
    }
  }, [isPlaying, tour]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          nextScene();
          break;
        case 'ArrowLeft':
          prevScene();
          break;
        case 'Escape':
          if (isFullscreen) toggleFullscreen();
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentScene, tour]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const nextScene = () => {
    if (tour?.panoramas && currentScene < tour.panoramas.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot);
    if (hotspot.type === 'scene' && hotspot.targetScene !== undefined) {
      setCurrentScene(hotspot.targetScene);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('chat-message', {
        tourId: id,
        userId: user?.id,
        userName: user?.name || 'Guest',
        message: newMessage
      });
      setNewMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-dark-400">Loading virtual tour...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tour not found</h2>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentPanorama = tour.panoramas?.[currentScene];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-dark-900">
      {/* 360 Viewer */}
      <Viewer360
        images={tour.panoramas || []}
        initialImage={currentScene}
        hotspots={currentPanorama?.hotspots || []}
        onHotspotClick={handleHotspotClick}
        autoRotate={isPlaying}
        showControls={false}
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-900/90 to-transparent">
        <div className="flex items-center justify-between p-4">
          {/* Left - Back & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-semibold line-clamp-1">
                {tour.title}
              </h1>
              <p className="text-sm text-dark-400">
                {tour.location?.city}, {tour.location?.country}
              </p>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {viewers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-800/70 backdrop-blur-sm rounded-full">
                <Users className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-white">{viewers.length}</span>
              </div>
            )}
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700 transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-dark-900/90 to-transparent">
        <div className="p-4">
          {/* Scene Progress */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-dark-400">
              {currentScene + 1} / {tour.panoramas?.length || 1}
            </span>
            <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentScene + 1) / (tour.panoramas?.length || 1)) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevScene}
                disabled={currentScene === 0}
                className="p-3 bg-dark-800/70 backdrop-blur-sm rounded-xl text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-primary-500 rounded-xl text-white hover:bg-primary-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={nextScene}
                disabled={!tour.panoramas || currentScene === tour.panoramas.length - 1}
                className="p-3 bg-dark-800/70 backdrop-blur-sm rounded-xl text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Center - Scene Info */}
            <div className="hidden md:block text-center">
              <p className="text-white font-medium">
                {currentPanorama?.title || `Scene ${currentScene + 1}`}
              </p>
              <p className="text-sm text-dark-400">
                {currentPanorama?.description}
              </p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-dark-800/70 backdrop-blur-sm rounded-xl text-white hover:bg-dark-700 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowMinimap(!showMinimap)}
                className="p-3 bg-dark-800/70 backdrop-blur-sm rounded-xl text-white hover:bg-dark-700 transition-colors"
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimap */}
      <AnimatePresence>
        {showMinimap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-32 right-4 w-48 h-48 bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-dark-700 overflow-hidden"
          >
            <div className="relative w-full h-full p-2">
              <img
                src={tour.images?.[0]?.url || '/placeholder-map.png'}
                alt="Tour map"
                className="w-full h-full object-cover rounded-xl opacity-50"
              />
              {/* Scene markers */}
              {tour.panoramas?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScene(index)}
                  className={`absolute w-3 h-3 rounded-full transition-all ${
                    index === currentScene
                      ? 'bg-primary-500 scale-125 ring-2 ring-primary-500/50'
                      : 'bg-white/70 hover:bg-white'
                  }`}
                  style={{
                    left: `${20 + (index * 20)}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene List Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-dark-800 border-l border-dark-700 z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Tour Scenes</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 text-dark-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {tour.panoramas?.map((panorama, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentScene(index);
                      setShowSidebar(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      index === currentScene
                        ? 'bg-primary-500/20 border border-primary-500/50'
                        : 'bg-dark-700/50 hover:bg-dark-700'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-dark-600">
                      <img
                        src={panorama.url}
                        alt={panorama.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${index === currentScene ? 'text-primary-400' : 'text-white'}`}>
                        {panorama.title || `Scene ${index + 1}`}
                      </p>
                      <p className="text-sm text-dark-400 line-clamp-1">
                        {panorama.description}
                      </p>
                    </div>
                    {index === currentScene && (
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-20 bottom-36 w-80 bg-dark-800/95 backdrop-blur-lg rounded-2xl border border-dark-700 flex flex-col overflow-hidden z-40"
          >
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Live Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 text-dark-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-dark-500 text-sm">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${msg.userId === user?.id ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm text-primary-400 font-medium">
                      {msg.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className={`max-w-[70%] ${msg.userId === user?.id ? 'text-right' : ''}`}>
                      <p className="text-xs text-dark-500 mb-1">{msg.userName}</p>
                      <p className={`px-3 py-2 rounded-2xl text-sm ${
                        msg.userId === user?.id
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-dark-700 text-dark-200 rounded-bl-md'
                      }`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-dark-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 rounded-xl text-white hover:bg-primary-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspot Info Modal */}
      <AnimatePresence>
        {activeHotspot && activeHotspot.type === 'info' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 w-full max-w-md mx-4 bg-dark-800/95 backdrop-blur-lg rounded-2xl border border-dark-700 overflow-hidden z-40"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {activeHotspot.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-1 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-dark-300 leading-relaxed">
                {activeHotspot.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element */}
      <audio ref={audioRef} muted={isMuted}>
        {tour.audio && <source src={tour.audio} type="audio/mpeg" />}
      </audio>
    </div>
  );
};

export default VirtualTour;
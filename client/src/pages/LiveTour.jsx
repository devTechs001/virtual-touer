import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageCircle,
  Users,
  Hand,
  Share2,
  Settings,
  X,
  Send,
  ThumbsUp,
  Gift,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import Viewer360 from '../components/vr/Viewer360';

const LiveTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  // Video states
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);

  // UI states
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  // Data states
  const [tourInfo, setTourInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState([]);

  // Refs
  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const containerRef = useRef(null);

  // Connect to live tour
  useEffect(() => {
    if (socket && id) {
      socket.emit('join-live-tour', { tourId: id, userId: user?.id, userName: user?.name });

      socket.on('tour-info', (info) => {
        setTourInfo(info);
        setIsStreaming(true);
      });

      socket.on('participants-update', (data) => {
        setParticipants(data.participants);
      });

      socket.on('chat-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('reaction', (reaction) => {
        setReactions(prev => [...prev, { ...reaction, id: Date.now() }]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 3000);
      });

      socket.on('tour-ended', () => {
        alert('The live tour has ended');
        navigate('/');
      });

      return () => {
        socket.emit('leave-live-tour', { tourId: id });
        socket.off('tour-info');
        socket.off('participants-update');
        socket.off('chat-message');
        socket.off('reaction');
        socket.off('tour-ended');
      };
    }
  }, [socket, id, user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('live-chat-message', {
        tourId: id,
        userId: user?.id,
        userName: user?.name,
        message: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const sendReaction = (emoji) => {
    if (socket) {
      socket.emit('live-reaction', {
        tourId: id,
        userId: user?.id,
        emoji
      });
    }
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    if (socket) {
      socket.emit('raise-hand', {
        tourId: id,
        userId: user?.id,
        raised: !handRaised
      });
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isStreaming) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-white mb-2">Connecting to live tour...</h2>
          <p className="text-dark-400">Please wait while we connect you to the guide</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-dark-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* 360 View or Guide Video */}
        <div className="absolute inset-0">
          {tourInfo?.is360 ? (
            <Viewer360
              images={tourInfo.panoramas || []}
              showControls={true}
            />
          ) : (
            <div className="w-full h-full bg-dark-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Floating Reactions */}
        <div className="absolute bottom-32 left-8 pointer-events-none">
          <AnimatePresence>
            {reactions.map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 1, y: 0, scale: 0 }}
                animate={{ opacity: 0, y: -200, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
                className="absolute text-4xl"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-dark-900/90 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-500 rounded text-white text-xs font-semibold animate-pulse">
                    LIVE
                  </span>
                  <h1 className="text-white font-semibold">{tourInfo?.title}</h1>
                </div>
                <p className="text-dark-400 text-sm">{tourInfo?.guide?.name} • {participants.length} watching</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-2.5 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2.5 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-900/90 to-transparent">
          <div className="flex items-center justify-between">
            {/* Reactions */}
            <div className="flex items-center gap-2">
              {['👏', '❤️', '🔥', '😮', '🎉'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="w-10 h-10 bg-dark-800/70 backdrop-blur-sm rounded-full text-xl hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-dark-800/70 backdrop-blur-sm'} text-white`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleHandRaise}
                className={`p-3 rounded-full ${handRaised ? 'bg-yellow-500' : 'bg-dark-800/70 backdrop-blur-sm'} text-white`}
              >
                <Hand className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full ${showChat ? 'bg-primary-500' : 'bg-dark-800/70 backdrop-blur-sm'} text-white`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700">
                <Gift className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-dark-800/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-700">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Guide Video PiP */}
        {tourInfo?.is360 && (
          <div className="absolute bottom-24 left-4 w-48 aspect-video bg-dark-800 rounded-xl overflow-hidden shadow-xl border border-dark-700">
            <video autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">{tourInfo?.guide?.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-dark-800 border-l border-dark-700 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Live Chat</h3>
                <span className="text-sm text-dark-400">{messages.length} messages</span>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-4"
            >
              {messages.map((msg, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {msg.userName?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary-400">{msg.userName}</span>
                      <span className="text-xs text-dark-500">{msg.time}</span>
                    </div>
                    <p className="text-dark-200 text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-dark-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary-500 rounded-xl text-white hover:bg-primary-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Panel */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-dark-800 border-l border-dark-700 z-50"
          >
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Participants ({participants.length})</h3>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="p-1 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              {/* Guide */}
              <div className="flex items-center gap-3 p-3 bg-primary-500/10 rounded-xl">
                <div className="relative">
                  <img
                    src={tourInfo?.guide?.avatar || '/default-avatar.png'}
                    alt={tourInfo?.guide?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-primary-500 rounded text-xs text-white font-semibold">
                    Host
                  </div>
                </div>
                <div>
                  <p className="font-medium text-white">{tourInfo?.guide?.name}</p>
                  <p className="text-sm text-primary-400">Tour Guide</p>
                </div>
              </div>

              {/* Participants */}
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {participant.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{participant.name}</p>
                  </div>
                  {participant.handRaised && (
                    <Hand className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTour;
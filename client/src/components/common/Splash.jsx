import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe2, Sparkles, Compass, Mountain, Waves, Sun } from 'lucide-react';

const Splash = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const phase1 = setTimeout(() => setCurrentPhase(1), 1200);
    const phase2 = setTimeout(() => setCurrentPhase(2), 2400);
    const phase3 = setTimeout(() => setCurrentPhase(3), 3600);

    // Animate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const complete = setTimeout(() => onComplete(), 4800);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(complete);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  // Enhanced background with rotating gradient
  const backgroundVariants = {
    animate: {
      background: [
        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)',
        'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%)',
        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      ],
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Enhanced Animated Background */}
      <motion.div
        variants={backgroundVariants}
        animate="animate"
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Animated Grid Pattern - African-inspired */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M40 30v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM10 30v-4H8v4H4v2h4v4h2v-4h4v-2H10zM10 4V0H8v4H4v2h4v4h2V6h4V4H10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Enhanced Floating Particles with multiple colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: '100vh',
              x: Math.random() * 100 + 'vw',
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: '-100vh',
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-primary-400' :
              i % 3 === 1 ? 'w-1.5 h-1.5 bg-secondary-400' :
              'w-1 h-1 bg-accent-400'
            }`}
            style={{
              boxShadow: i % 3 === 0 ? '0 0 10px rgba(251, 146, 60, 0.6)' :
                         i % 3 === 1 ? '0 0 8px rgba(236, 72, 153, 0.6)' :
                         '0 0 6px rgba(139, 92, 246, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Pulsing Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: [0, 2 + i * 0.5], opacity: [0.3, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
            className="absolute w-64 h-64 rounded-full border-2 border-primary-500/30"
          />
        ))}
      </div>

      {/* African Map Silhouette - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Globe2 className="w-[700px] h-[700px] text-white" strokeWidth={0.5} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* Phase 1: Logo & Name - Enhanced */}
          {currentPhase === 0 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 1.1 }}
              className="text-center"
            >
              {/* Animated Logo Container */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-40 h-40 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/50 relative overflow-hidden"
              >
                {/* Inner glow effect */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-3xl"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <MapPin className="w-20 h-20 text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>

              {/* Title with glow effect */}
              <motion.div className="relative">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-6xl font-display font-bold text-white mb-3 drop-shadow-2xl"
                >
                  Virtual Tourist
                </motion.h1>
                {/* Text glow */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-0 left-0 text-5xl md:text-6xl font-display font-bold text-primary-400 blur-xl -z-10"
                >
                  Virtual Tourist
                </motion.h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-dark-300 text-xl font-light tracking-wide"
              >
                Discover the World
              </motion.p>

              {/* Animated underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent mx-auto mt-4"
              />
            </motion.div>
          )}

          {/* Phase 2: Africa Focus Tagline - Enhanced */}
          {currentPhase === 1 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="text-center"
            >
              {/* Animated badge */}
              <motion.div
                initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 text-primary-300 text-xl font-semibold mb-8 border border-primary-500/40 shadow-lg shadow-primary-500/20 relative overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.span>
                Africa First
                <motion.span
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
              >
                Experience Kenya & Beyond
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-dark-300 text-xl max-w-xl mx-auto leading-relaxed"
              >
                From the <span className="text-primary-400 font-semibold">Maasai Mara</span> to <span className="text-secondary-400 font-semibold">Mount Kenya</span>,
                discover the breathtaking beauty of Africa
              </motion.p>

              {/* Icon row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-6 mt-8"
              >
                {[
                  { icon: Mountain, label: 'Mountains' },
                  { icon: Waves, label: 'Beaches' },
                  { icon: Compass, label: 'Safaris' },
                  { icon: Sun, label: 'Culture' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-dark-800/80 border border-dark-600 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <span className="text-dark-400 text-xs">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Phase 3: Featured Destinations Preview - Enhanced */}
          {currentPhase === 2 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center w-full max-w-2xl"
            >
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-display font-bold text-white mb-8"
              >
                Featured Destinations
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                {[
                  { name: 'Maasai Mara', icon: '🦁', color: 'from-orange-500 to-amber-500' },
                  { name: 'Diani Beach', icon: '🏖️', color: 'from-blue-400 to-cyan-500' },
                  { name: 'Mount Kenya', icon: '⛰️', color: 'from-green-500 to-emerald-600' },
                  { name: 'Nairobi', icon: '🏙️', color: 'from-purple-500 to-pink-500' },
                ].map((dest, index) => (
                  <motion.div
                    key={dest.name}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`px-4 py-4 rounded-2xl bg-gradient-to-br ${dest.color} bg-opacity-10 border border-white/20 backdrop-blur-sm shadow-lg cursor-pointer group`}
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="text-4xl mb-2 block group-hover:scale-125 transition-transform"
                    >
                      {dest.icon}
                    </motion.span>
                    <span className="text-white/90 text-sm font-medium">{dest.name}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-dark-300 text-lg"
              >
                And <span className="text-primary-400 font-semibold">25+ more</span> African destinations
              </motion.p>
            </motion.div>
          )}

          {/* Phase 4: Loading Progress - Enhanced */}
          {currentPhase === 3 && (
            <motion.div
              key="phase4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full max-w-md"
            >
              {/* Circular progress indicator */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                {/* Outer ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-dark-700"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '352', strokeDashoffset: '352' }}
                    animate={{ strokeDashoffset: 352 - (352 * loadingProgress) / 100 }}
                    transition={{ duration: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={loadingProgress}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {loadingProgress}%
                  </motion.span>
                </div>
              </div>

              {/* Loading bar */}
              <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full"
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-dark-300 text-sm"
              >
                Preparing your African adventure...
              </motion.p>

              {/* Loading dots animation */}
              <div className="flex justify-center gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-primary-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Branding - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-dark-500 text-sm">
          © 2026 Virtual Tourist - Your Gateway to <span className="text-primary-400">Africa</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Splash;

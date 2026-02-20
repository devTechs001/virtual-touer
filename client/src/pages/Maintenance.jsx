import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Clock, 
  Mail, 
  Twitter, 
  Facebook, 
  RefreshCw,
  Bell,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { systemService } from '../services/api';

const Maintenance = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const { data: maintenanceData, refetch } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: () => systemService.getMaintenanceStatus().then(res => res.data),
    refetchInterval: 30000 // Check every 30 seconds
  });

  const maintenance = maintenanceData?.maintenance;

  // Countdown timer
  useEffect(() => {
    if (!maintenance?.estimatedEndTime || !maintenance?.showCountdown) return;

    const calculateTimeLeft = () => {
      const end = new Date(maintenance.estimatedEndTime).getTime();
      const now = Date.now();
      const difference = end - now;

      if (difference <= 0) {
        refetch();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [maintenance?.estimatedEndTime, maintenance?.showCountdown, refetch]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await systemService.subscribeMaintenanceNotification(email);
      setSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-secondary-900/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="text-center mb-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-primary-500/30 rounded-3xl animate-ping" />
            <div className="relative w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Wrench className="w-12 h-12 text-white animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
          >
            Under Maintenance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-dark-300 text-lg max-w-md mx-auto"
          >
            {maintenance?.message || 
              "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!"}
          </motion.p>
        </div>

        {/* Countdown Timer */}
        {timeLeft && maintenance?.showCountdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-dark-400 text-center mb-4 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated time remaining
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <motion.div
                    key={`${item.label}-${item.value}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="bg-dark-800 rounded-2xl p-4 border border-dark-700"
                  >
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <span className="text-sm text-dark-500 mt-2 block">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Subscribe for Notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-800/50 rounded-2xl p-6 border border-dark-700 mb-6"
        >
          {subscribed ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
              <p className="text-white font-medium">You're subscribed!</p>
              <p className="text-dark-400 text-sm">
                We'll notify you when we're back online.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-primary-400" />
                <h3 className="font-semibold text-white">Get Notified</h3>
              </div>
              <p className="text-dark-400 text-sm mb-4">
                Enter your email to receive a notification when we're back online.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
                <button type="submit" className="btn-primary px-6">
                  Notify Me
                </button>
              </form>
            </>
          )}
        </motion.div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          {maintenance?.contactEmail && (
            <p className="text-dark-400 mb-4">
              Need urgent help?{' '}
              <a 
                href={`mailto:${maintenance.contactEmail}`}
                className="text-primary-400 hover:text-primary-300"
              >
                Contact Support
              </a>
            </p>
          )}

          {maintenance?.socialLinks && (
            <div className="flex items-center justify-center gap-4">
              <span className="text-dark-500 text-sm">Follow us for updates:</span>
              {maintenance.socialLinks.twitter && (
                <a
                  href={maintenance.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-dark-800 rounded-lg text-dark-400 hover:text-[#1da1f2] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {maintenance.socialLinks.facebook && (
                <a
                  href={maintenance.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-dark-800 rounded-lg text-dark-400 hover:text-[#1877f2] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="mt-6 flex items-center gap-2 mx-auto text-dark-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Check Status</span>
          </button>
        </motion.div>

        {/* Development Mode Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm font-medium">
              Development Mode
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
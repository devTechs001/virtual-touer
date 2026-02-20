import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { systemService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle
};

const colorMap = {
  info: 'bg-primary-500/90 border-primary-400',
  warning: 'bg-yellow-500/90 border-yellow-400 text-dark-900',
  success: 'bg-secondary-500/90 border-secondary-400',
  error: 'bg-red-500/90 border-red-400'
};

const AnnouncementBanner = () => {
  const { isAuthenticated, user } = useAuth();
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem('dismissedAnnouncements');
    return saved ? JSON.parse(saved) : [];
  });

  const { data } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => systemService.getAnnouncements().then(res => res.data),
    refetchInterval: 300000 // 5 minutes
  });

  // Filter announcements
  const visibleAnnouncements = (data?.announcements || []).filter(announcement => {
    // Check if dismissed
    if (dismissedIds.includes(announcement.id)) return false;
    
    // Check target audience
    if (announcement.targetAudience === 'users' && !isAuthenticated) return false;
    if (announcement.targetAudience === 'guests' && isAuthenticated) return false;
    
    // Check expiration
    if (announcement.expiresAt && new Date(announcement.expiresAt) < new Date()) return false;
    
    return true;
  });

  const handleDismiss = (id) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {visibleAnnouncements.map((announcement, index) => {
          const Icon = iconMap[announcement.type] || Info;
          const colors = colorMap[announcement.type] || colorMap.info;

          return (
            <motion.div
              key={announcement.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`border-b ${colors}`}
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      {announcement.title && (
                        <span className="font-semibold mr-2">{announcement.title}:</span>
                      )}
                      <span>{announcement.message}</span>
                      {announcement.link && (
                        <a
                          href={announcement.link}
                          className="inline-flex items-center gap-1 ml-2 underline hover:no-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {announcement.dismissible && (
                    <button
                      onClick={() => handleDismiss(announcement.id)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBanner;
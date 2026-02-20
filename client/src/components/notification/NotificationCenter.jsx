import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Calendar, 
  Star, 
  Trophy, 
  Gift,
  MapPin,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import { notificationService } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';

const notificationIcons = {
  booking_confirmed: Calendar,
  booking_reminder: Clock,
  tour_recommendation: MapPin,
  achievement_unlocked: Trophy,
  new_review: Star,
  price_drop: Gift,
  live_tour_starting: Bell,
  system: Bell
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll().then(res => res.data),
    refetchInterval: 60000
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  // Real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        queryClient.setQueryData(['notifications'], (old) => ({
          ...old,
          notifications: [notification, ...(old?.notifications || [])],
          unreadCount: (old?.unreadCount || 0) + 1
        }));

        // Show toast notification
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icons/icon-192x192.png'
          });
        }
      });

      return () => socket.off('notification');
    }
  }, [socket, queryClient]);

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800/50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {data?.unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
            {data.unreadCount > 9 ? '9+' : data.unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-dark-800 rounded-2xl border border-dark-700 shadow-xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {data?.unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-primary-400 hover:text-primary-300"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-dark-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : data?.notifications?.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                    <p className="text-dark-400">No notifications yet</p>
                  </div>
                ) : (
                  data?.notifications?.map((notification) => {
                    const Icon = notificationIcons[notification.type] || Bell;
                    
                    return (
                      <div
                        key={notification._id}
                        className={`p-4 border-b border-dark-700/50 hover:bg-dark-700/50 transition-colors ${
                          !notification.read ? 'bg-primary-500/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'achievement_unlocked' ? 'bg-yellow-500/20 text-yellow-400' :
                            notification.type === 'booking_confirmed' ? 'bg-secondary-500/20 text-secondary-400' :
                            notification.type === 'price_drop' ? 'bg-red-500/20 text-red-400' :
                            'bg-primary-500/20 text-primary-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-white text-sm line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="p-1 text-dark-500 hover:text-primary-400 flex-shrink-0"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-dark-400 text-sm line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-dark-500 text-xs mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {notification.data?.url && (
                          <Link
                            to={notification.data.url}
                            onClick={() => {
                              handleMarkAsRead(notification._id);
                              setIsOpen(false);
                            }}
                            className="block mt-2 text-sm text-primary-400 hover:text-primary-300"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-dark-700">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm text-primary-400 hover:text-primary-300 py-2"
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
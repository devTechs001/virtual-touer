import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Settings, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';

/**
 * NotificationCenter Component
 * Features:
 * - Real-time notifications
 * - Multiple notification types
 * - Mark as read/unread
 * - Delete notifications
 * - Filter by type
 * - Search notifications
 */

const NOTIFICATION_TYPES = {
  booking: { icon: Calendar, color: 'bg-blue-500', label: 'Booking' },
  review: { icon: Star, color: 'bg-yellow-500', label: 'Review' },
  message: { icon: MessageSquare, color: 'bg-purple-500', label: 'Message' },
  alert: { icon: AlertTriangle, color: 'bg-orange-500', label: 'Alert' },
  success: { icon: CheckCircle, color: 'bg-green-500', label: 'Success' },
  info: { icon: Info, color: 'bg-blue-500', label: 'Info' },
  system: { icon: Settings, color: 'bg-gray-500', label: 'System' }
};

// Sample notifications data
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Received',
    message: 'John Doe booked "Pyramids of Giza Tour" for March 15',
    time: '5 minutes ago',
    read: false,
    action: { label: 'View Booking', url: '/admin/bookings/123' }
  },
  {
    id: '2',
    type: 'review',
    title: 'New 5-Star Review',
    message: 'Sarah left a 5-star review for "Tokyo Virtual Experience"',
    time: '1 hour ago',
    read: false,
    rating: 5
  },
  {
    id: '3',
    type: 'alert',
    title: 'Payment Failed',
    message: 'Payment failed for booking #456. Customer notified.',
    time: '2 hours ago',
    read: false,
    priority: 'high'
  },
  {
    id: '4',
    type: 'success',
    title: 'Tour Published',
    message: '"Sahara Desert Adventure" is now live and visible to users',
    time: '3 hours ago',
    read: true
  },
  {
    id: '5',
    type: 'message',
    title: 'New Support Ticket',
    message: 'User reported an issue with VR playback',
    time: '5 hours ago',
    read: false,
    action: { label: 'Respond', url: '/admin/support/789' }
  },
  {
    id: '6',
    type: 'info',
    title: 'System Update',
    message: 'Scheduled maintenance on March 20, 2:00 AM - 4:00 AM UTC',
    time: '1 day ago',
    read: true
  },
  {
    id: '7',
    type: 'booking',
    title: 'Booking Cancelled',
    message: 'Booking #789 was cancelled by customer',
    time: '1 day ago',
    read: true
  },
  {
    id: '8',
    type: 'system',
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully',
    time: '2 days ago',
    read: true
  }
];

const NotificationCenter = ({ 
  notifications: propNotifications, 
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  compact = false
}) => {
  const [notifications, setNotifications] = useState(propNotifications || SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !notification.read :
      filter === 'read' ? notification.read : true;
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Mark as read
  const handleMarkAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    onMarkAsRead?.(id);
  }, [onMarkAsRead]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const handleDelete = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    onDelete?.(id);
  }, [onDelete]);

  // Clear all notifications
  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 5);

  if (compact) {
    return (
      <div className="relative">
        <button className="relative p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-sm text-dark-400">
              {unreadCount} unread out of {notifications.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-dark-400 hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dark-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayedNotifications.map((notification, index) => {
            const TypeIcon = NOTIFICATION_TYPES[notification.type]?.icon || Bell;
            const typeColor = NOTIFICATION_TYPES[notification.type]?.color || 'bg-gray-500';

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className={`p-4 rounded-xl border transition-colors ${
                  notification.read
                    ? 'bg-dark-800/50 border-dark-700'
                    : 'bg-dark-800 border-primary-500/30'
                }`}
                onClick={() => {
                  if (!notification.read) handleMarkAsRead(notification.id);
                  onNotificationClick?.(notification);
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${typeColor} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            notification.read ? 'text-dark-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                          {notification.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              High
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-dark-400">{notification.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-dark-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            notification.read ? 'bg-dark-700 text-dark-400' : 'bg-primary-500/20 text-primary-400'
                          }`}>
                            {NOTIFICATION_TYPES[notification.type]?.label}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1.5 hover:bg-dark-700 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-dark-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-dark-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.action && (
                      <a
                        href={notification.action.url}
                        className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notification.action.label}
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No notifications found</p>
          </div>
        )}

        {/* Show More Button */}
        {filteredNotifications.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 text-center text-primary-400 hover:text-primary-300 font-medium"
          >
            {showAll ? 'Show Less' : `Show All (${filteredNotifications.length})`}
          </button>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-4 pt-4 border-t border-dark-700 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{notifications.length}</p>
          <p className="text-xs text-dark-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-400">{unreadCount}</p>
          <p className="text-xs text-dark-500">Unread</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-dark-400">{notifications.length - unreadCount}</p>
          <p className="text-xs text-dark-500">Read</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Star, 
  Eye, 
  Clock,
  Calendar,
  Map,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Filter,
  Download
} from 'lucide-react';

/**
 * ActivityFeed Component
 * Features:
 * - Real-time activity stream
 * - Filter by type
 * - User activity tracking
 * - Export functionality
 */

const ACTIVITY_TYPES = {
  booking: { 
    icon: ShoppingCart, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20',
    label: 'Booking' 
  },
  user: { 
    icon: Users, 
    color: 'text-green-400', 
    bg: 'bg-green-500/20',
    label: 'User' 
  },
  review: { 
    icon: Star, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/20',
    label: 'Review' 
  },
  view: { 
    icon: Eye, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/20',
    label: 'View' 
  },
  tour: { 
    icon: Map, 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/20',
    label: 'Tour' 
  },
  message: { 
    icon: MessageSquare, 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500/20',
    label: 'Message' 
  },
  system: { 
    icon: Activity, 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/20',
    label: 'System' 
  }
};

// Sample activity data
const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking',
    description: 'John Doe booked "Pyramids of Giza Tour"',
    amount: 299.00,
    user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
    time: '2 minutes ago',
    timestamp: Date.now() - 120000
  },
  {
    id: '2',
    type: 'review',
    title: '5-Star Review',
    description: 'Sarah gave 5 stars to "Tokyo Virtual Experience"',
    rating: 5,
    user: { name: 'Sarah Smith', avatar: '/avatars/sarah.jpg' },
    time: '15 minutes ago',
    timestamp: Date.now() - 900000
  },
  {
    id: '3',
    type: 'user',
    title: 'New User Registered',
    description: 'Welcome Mike Johnson to the platform',
    user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    time: '1 hour ago',
    timestamp: Date.now() - 3600000
  },
  {
    id: '4',
    type: 'view',
    title: 'Tour Milestone',
    description: '"Sahara Adventure" reached 10,000 views',
    views: 10000,
    tour: { title: 'Sahara Adventure', image: '/tours/sahara.jpg' },
    time: '2 hours ago',
    timestamp: Date.now() - 7200000
  },
  {
    id: '5',
    type: 'booking',
    title: 'Booking Completed',
    description: 'Emma Wilson completed "Paris City Tour"',
    amount: 199.00,
    user: { name: 'Emma Wilson', avatar: '/avatars/emma.jpg' },
    time: '3 hours ago',
    timestamp: Date.now() - 10800000
  },
  {
    id: '6',
    type: 'tour',
    title: 'New Tour Published',
    description: '"Amazon Rainforest Expedition" is now live',
    tour: { title: 'Amazon Rainforest', image: '/tours/amazon.jpg' },
    time: '5 hours ago',
    timestamp: Date.now() - 18000000
  },
  {
    id: '7',
    type: 'message',
    title: 'Support Ticket',
    description: 'New support ticket from Alex Brown',
    user: { name: 'Alex Brown', avatar: '/avatars/alex.jpg' },
    time: '6 hours ago',
    timestamp: Date.now() - 21600000
  },
  {
    id: '8',
    type: 'system',
    title: 'System Backup',
    description: 'Daily database backup completed successfully',
    time: '12 hours ago',
    timestamp: Date.now() - 43200000
  }
];

const ActivityFeed = ({ 
  activities: propActivities, 
  limit = 10,
  showFilter = true,
  compact = false,
  onActivityClick 
}) => {
  const [activities] = useState(propActivities || SAMPLE_ACTIVITIES);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h'); // 1h, 24h, 7d, 30d, all

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Type filter
    if (filter !== 'all') {
      filtered = filtered.filter(a => a.type === filter);
    }

    // Time range filter
    const now = Date.now();
    const timeRanges = {
      '1h': 3600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000
    };

    if (timeRange !== 'all' && timeRanges[timeRange]) {
      filtered = filtered.filter(a => now - a.timestamp < timeRanges[timeRange]);
    }

    return filtered.slice(0, limit);
  }, [activities, filter, timeRange, limit]);

  // Calculate stats
  const stats = useMemo(() => {
    const baseStats = {
      bookings: activities.filter(a => a.type === 'booking').length,
      reviews: activities.filter(a => a.type === 'review').length,
      users: activities.filter(a => a.type === 'user').length,
      views: activities.filter(a => a.type === 'view').length
    };

    return baseStats;
  }, [activities]);

  // Export activities
  const handleExport = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-feed-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredActivities.slice(0, 5).map((activity, index) => {
          const TypeIcon = ACTIVITY_TYPES[activity.type]?.icon || Activity;
          const typeColor = ACTIVITY_TYPES[activity.type]?.color || 'text-gray-400';
          const typeBg = ACTIVITY_TYPES[activity.type]?.bg || 'bg-gray-500/20';

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={`w-8 h-8 rounded-lg ${typeBg} flex items-center justify-center`}>
                <TypeIcon className={`w-4 h-4 ${typeColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-300 truncate">{activity.description}</p>
                <p className="text-xs text-dark-500">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Activity Feed</h2>
          <p className="text-sm text-dark-400">Real-time platform activity</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-white text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <ShoppingCart className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.bookings}</p>
          <p className="text-xs text-dark-500">Bookings</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.reviews}</p>
          <p className="text-xs text-dark-500">Reviews</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.users}</p>
          <p className="text-xs text-dark-500">Users</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Eye className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.views}</p>
          <p className="text-xs text-dark-500">Views</p>
        </div>
      </div>

      {/* Filters */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="all">All Types</option>
              {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-dark-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => {
            const TypeIcon = ACTIVITY_TYPES[activity.type]?.icon || Activity;
            const typeColor = ACTIVITY_TYPES[activity.type]?.color || 'text-gray-400';
            const typeBg = ACTIVITY_TYPES[activity.type]?.bg || 'bg-gray-500/20';

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onActivityClick?.(activity)}
                className="p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl border border-dark-700 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${typeBg} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{activity.title}</h3>
                        <p className="text-sm text-dark-400">{activity.description}</p>
                        
                        {/* Additional Info */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-dark-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                          {activity.amount && (
                            <span className="text-xs font-medium text-green-400">
                              +${activity.amount.toFixed(2)}
                            </span>
                          )}
                          {activity.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-yellow-400">{activity.rating}</span>
                            </div>
                          )}
                          {activity.views && (
                            <span className="text-xs text-purple-400">
                              {activity.views.toLocaleString()} views
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {activity.user?.avatar && (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

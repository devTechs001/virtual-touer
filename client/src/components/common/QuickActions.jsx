import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Zap, 
  Calendar, 
  Map, 
  Users, 
  DollarSign, 
  Settings, 
  BarChart3,
  MessageSquare,
  Bell,
  TrendingUp,
  Globe,
  Star,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickActions Component
 * Features:
 * - Common admin actions
 * - Keyboard shortcuts
 * - Recently used actions
 * - Customizable shortcuts
 */

const QUICK_ACTIONS = [
  { 
    id: 'create-tour', 
    label: 'Create Tour', 
    icon: Map, 
    color: 'bg-blue-500',
    shortcut: '⌘+N',
    url: '/admin/tours/create',
    description: 'Add a new virtual tour'
  },
  { 
    id: 'add-destination', 
    label: 'Add Destination', 
    icon: Globe, 
    color: 'bg-green-500',
    shortcut: '⌘+D',
    url: '/admin/destinations/new',
    description: 'Create new destination'
  },
  { 
    id: 'view-bookings', 
    label: 'View Bookings', 
    icon: Calendar, 
    color: 'bg-purple-500',
    shortcut: '⌘+B',
    url: '/admin/bookings',
    description: 'Manage all bookings'
  },
  { 
    id: 'manage-users', 
    label: 'Manage Users', 
    icon: Users, 
    color: 'bg-orange-500',
    shortcut: '⌘+U',
    url: '/admin/users',
    description: 'View and edit users'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    color: 'bg-pink-500',
    shortcut: '⌘+A',
    url: '/admin/analytics',
    description: 'View statistics'
  },
  { 
    id: 'revenue', 
    label: 'Revenue', 
    icon: DollarSign, 
    color: 'bg-emerald-500',
    shortcut: '⌘+R',
    url: '/admin/analytics?tab=revenue',
    description: 'Financial overview'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star, 
    color: 'bg-yellow-500',
    shortcut: '⌘+E',
    url: '/admin/reviews',
    description: 'Moderate reviews'
  },
  { 
    id: 'messages', 
    label: 'Messages', 
    icon: MessageSquare, 
    color: 'bg-indigo-500',
    shortcut: '⌘+M',
    url: '/admin/messages',
    description: 'Support tickets'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell, 
    color: 'bg-red-500',
    shortcut: '⌘+L',
    url: '/admin/notifications',
    description: 'Alert center'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    color: 'bg-gray-500',
    shortcut: '⌘+,',
    url: '/admin/settings',
    description: 'System configuration'
  }
];

const QuickActions = ({ onActionClick, showShortcuts = true }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActions, setRecentActions] = useState([]);

  const filteredActions = useMemo(() => {
    if (!searchQuery) return QUICK_ACTIONS;
    return QUICK_ACTIONS.filter(action =>
      action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleActionClick = (action) => {
    // Add to recent actions
    setRecentActions(prev => {
      const filtered = prev.filter(a => a.id !== action.id);
      return [action, ...filtered].slice(0, 5);
    });
    
    onActionClick?.(action);
    navigate(action.url);
  };

  // Keyboard shortcuts
  useState(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        const action = QUICK_ACTIONS.find(a => a.shortcut.toLowerCase().includes(e.key.toLowerCase()));
        if (action) {
          e.preventDefault();
          handleActionClick(action);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Quick Actions</h2>
        <p className="text-sm text-dark-400">Frequently used commands and shortcuts</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search actions... (or press ⌘+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
        />
        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
      </div>

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 mb-3">Recently Used</h3>
          <div className="flex flex-wrap gap-2">
            {recentActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4 text-dark-400" />
                  <span className="text-sm text-white">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleActionClick(action)}
              className="group p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{action.label}</h3>
              <p className="text-xs text-dark-400 mb-2">{action.description}</p>
              {showShortcuts && action.shortcut && (
                <div className="flex items-center justify-between">
                  <kbd className="px-2 py-0.5 bg-dark-900 rounded text-xs text-dark-500 font-mono">
                    {action.shortcut}
                  </kbd>
                  <ChevronRight className="w-3 h-3 text-dark-500 group-hover:text-primary-400 transition-colors" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* All Actions Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/admin/settings/shortcuts')}
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center justify-center gap-2 mx-auto"
        >
          <Settings className="w-4 h-4" />
          Customize keyboard shortcuts
        </button>
      </div>
    </div>
  );
};

export default QuickActions;

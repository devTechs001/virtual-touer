import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Calendar,
  Heart,
  Trophy,
  Settings,
  Clock,
  Map,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserSidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/dashboard?tab=achievements', icon: Trophy, label: 'Achievements' },
    { to: '/dashboard?tab=history', icon: Clock, label: 'History' },
    { to: '/map', icon: Map, label: 'Explore Map' },
    { to: '/dashboard?tab=settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 bg-dark-900 border-r border-dark-800 flex-col"
        style={{ width: collapsed ? 80 : 280 }}
      >
        {/* Logo & Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          <motion.div 
            className="flex items-center gap-3"
            animate={{ opacity: collapsed ? 0 : 1 }}
            style={{ display: collapsed ? 'none' : 'flex' }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">My Dashboard</span>
          </motion.div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <p className="text-white font-medium truncate">{user?.name}</p>
                <p className="text-xs text-dark-500 truncate">{user?.email}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-dark-800"
          >
            <div className="bg-dark-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-dark-400">Your Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-500">Level 5 Explorer</span>
                  <span className="text-primary-400">75%</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="p-4 border-t border-dark-800">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`
            }
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium">Back to Home</span>
            )}
          </NavLink>
        </div>
      </motion.div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-lg border-t border-dark-800 safe-bottom z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-dark-500 hover:text-dark-300'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default UserSidebar;

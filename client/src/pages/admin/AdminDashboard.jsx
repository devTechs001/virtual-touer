import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Globe,
  Globe2,
  MessageSquare,
  Bell,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { adminService } from '../../services/api';
import StatCard from './statCard';
import RevenueChart from './charts/RevenueChart';
import UserGrowthChart from './charts/userGrowthChart';
import TourViewsChart from './charts/TourViewsChat';
import RecentBookings from './RecentBookings';
import TopTours from './TopTours';
import WorldMapStats from './WorldMapStats';
import { useStatsComparison } from '../../hooks/useDashboard';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats().then(res => res.data),
    refetchInterval: 60000
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminService.getRecentActivity().then(res => res.data)
  });

  // Get comparison data showing admin impact on user dashboards
  const { comparison } = useStatsComparison();

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/tours', icon: Map, label: 'Tours' },
    { path: '/admin/destinations', icon: Globe, label: 'Destinations' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 bg-dark-900 border-r border-dark-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-display font-bold text-white">
                Admin
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-lg border-b border-dark-800 sticky top-0 z-30">
          <div className="h-full flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-white">
              {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Render dashboard stats only on exact /admin path */}
          {location.pathname === '/admin' ? (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={`$${stats?.revenue?.total?.toLocaleString() || 0}`}
                  change={stats?.revenue?.change || 0}
                  icon={DollarSign}
                  color="primary"
                  loading={isLoading}
                />
                <StatCard
                  title="Total Users"
                  value={stats?.users?.total?.toLocaleString() || 0}
                  change={stats?.users?.change || 0}
                  icon={Users}
                  color="secondary"
                  loading={isLoading}
                />
                <StatCard
                  title="Tour Views"
                  value={stats?.views?.total?.toLocaleString() || 0}
                  change={stats?.views?.change || 0}
                  icon={Eye}
                  color="purple"
                  loading={isLoading}
                />
                <StatCard
                  title="Bookings"
                  value={stats?.bookings?.total?.toLocaleString() || 0}
                  change={stats?.bookings?.change || 0}
                  icon={Calendar}
                  color="orange"
                  loading={isLoading}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
                  <RevenueChart data={stats?.revenueChart || []} />
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
                  <UserGrowthChart data={stats?.userGrowthChart || []} />
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tour Views</h3>
                  <TourViewsChart data={stats?.tourViewsChart || []} />
                </div>
              </div>

              {/* World Map */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Global Tour Distribution</h3>
                <WorldMapStats data={stats?.geoData || []} />
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentBookings bookings={stats?.recentBookings || []} />
                </div>
                <div>
                  <TopTours tours={stats?.topTours || []} />
                </div>
              </div>

              {/* Admin Impact on User Dashboards */}
              <div className="card p-6 border-primary-500/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-400" />
                  Your Impact on User Dashboards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400 text-sm">Tours Available</span>
                      <Globe2 className="w-4 h-4 text-primary-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{comparison.tours.total}</p>
                    <p className="text-sm text-dark-500 mt-1">
                      Users completed: {comparison.tours.userCompleted} ({comparison.tours.total > 0 ? ((comparison.tours.userCompleted / comparison.tours.total) * 100).toFixed(1) : 0}%)
                    </p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400 text-sm">Total Bookings</span>
                      <Calendar className="w-4 h-4 text-secondary-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{comparison.bookings.total}</p>
                    <p className="text-sm text-dark-500 mt-1">
                      Active bookings across all users
                    </p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400 text-sm">Registered Users</span>
                      <Users className="w-4 h-4 text-orange-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{comparison.users.total}</p>
                    <p className="text-sm text-dark-500 mt-1">
                      Active: {comparison.users.active || 0} this month
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary-500/10 rounded-xl border border-primary-500/30">
                  <p className="text-sm text-primary-300">
                    💡 <strong>Pro Tip:</strong> When you create new tours or update bookings, users will see these changes immediately in their dashboards under "Recommended Tours" and "My Bookings".
                  </p>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity?.activities?.map((activity, index) => (
                    <motion.div
                      key={activity._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'booking' ? 'bg-primary-500/20 text-primary-400' :
                        activity.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                        activity.type === 'user' ? 'bg-secondary-500/20 text-secondary-400' :
                        'bg-dark-700 text-dark-400'
                      }`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-dark-200">{activity.message}</p>
                        <p className="text-sm text-dark-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
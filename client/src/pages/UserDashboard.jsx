import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Map,
  Clock,
  Heart,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Play,
  Star,
  Globe2,
  Award,
  Flame,
  MapPin,
  Zap,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Eye,
  Share2,
  MessageCircle,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useDashboardData } from '../hooks/useDashboard';
import TourCard from '../components/tours/TourCard';
import UserSidebar from '../components/layout/UserSidebar';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchParams] = useSearchParams();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: async () => {
      try {
        const response = await userService.getDashboard();
        return response.data.data;
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        throw err; // Re-throw to let React Query handle it
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000
  });

  const { data: achievements, error: achievementsError } = useQuery({
    queryKey: ['user', 'achievements'],
    queryFn: async () => {
      try {
        const response = await userService.getAchievements();
        return response.data.data;
      } catch (err) {
        console.error('Achievements fetch error:', err);
        return { achievements: [], totalPoints: 0, level: 'Explorer' };
      }
    },
    retry: 1
  });

  const { data: recommendations, error: recommendationsError } = useQuery({
    queryKey: ['user', 'recommendations'],
    queryFn: async () => {
      try {
        const response = await userService.getRecommendations();
        return response.data.data;
      } catch (err) {
        console.error('Recommendations fetch error:', err);
        return { tours: [] };
      }
    },
    retry: 1
  });

  const stats = dashboardData?.stats || {
    toursCompleted: 12,
    totalWatchTime: 8.5,
    countriesVisited: 7,
    currentStreak: 5,
    totalPoints: 2450,
    level: 'Explorer',
    lastMonthTours: 8,
    lastMonthWatchTime: 6.2,
    levelProgress: 65
  };

  const categoryData = dashboardData?.categoryBreakdown || [
    { name: 'Cultural', value: 35, color: '#3b82f6' },
    { name: 'Nature', value: 25, color: '#22c55e' },
    { name: 'Historical', value: 20, color: '#f59e0b' },
    { name: 'Urban', value: 15, color: '#8b5cf6' },
    { name: 'Adventure', value: 5, color: '#ef4444' }
  ];

  const recentActivity = dashboardData?.recentActivity || [];
  const continueWatching = dashboardData?.continueWatching || [];
  const newDestinations = dashboardData?.newDestinations || [];
  const featuredTours = dashboardData?.featuredTours || [];

  // Calculate trends
  const toursTrend = stats.toursCompleted > stats.lastMonthTours
    ? ((stats.toursCompleted - stats.lastMonthTours) / stats.lastMonthTours * 100).toFixed(1)
    : 0;
  const watchTimeTrend = stats.totalWatchTime > stats.lastMonthWatchTime
    ? ((stats.totalWatchTime - stats.lastMonthWatchTime) / stats.lastMonthWatchTime * 100).toFixed(1)
    : 0;

  // Activity data for chart
  const activityData = dashboardData?.activityData || [
    { day: 'Mon', tours: 2, hours: 1.5 },
    { day: 'Tue', tours: 3, hours: 2.0 },
    { day: 'Wed', tours: 1, hours: 0.5 },
    { day: 'Thu', tours: 4, hours: 3.0 },
    { day: 'Fri', tours: 2, hours: 1.8 },
    { day: 'Sat', tours: 5, hours: 4.2 },
    { day: 'Sun', tours: 3, hours: 2.5 }
  ];

  // Get active tab from URL params
  const tabFromUrl = searchParams.get('tab');

  // Show error state
  if (error) {
    const isAuthError = error.response?.status === 401;
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isAuthError ? 'Authentication Required' : 'Error Loading Dashboard'}
          </h2>
          <p className="text-dark-400 mb-6">
            {isAuthError
              ? 'Please log in to view your dashboard'
              : 'Something went wrong. Please try again later.'}
          </p>
          {isAuthError ? (
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              Go to Login
            </a>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              Refresh Page
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 relative">
      {/* Side Navigation */}
      <UserSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area - positioned below NavBar (z-50) */}
      <main
        className={`relative transition-all duration-300 pt-20 pb-20 lg:pb-8 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        }`}
        style={{ zIndex: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-dark-400">
                You've explored {stats.countriesVisited} countries virtually. Keep going!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-xl">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-semibold">{stats.currentStreak} day streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-xl">
                <Trophy className="w-5 h-5 text-primary-400" />
                <span className="text-primary-400 font-semibold">{stats.totalPoints} pts</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Map className="w-5 h-5 text-primary-400" />
              </div>
              {toursTrend > 0 ? (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{toursTrend}%</span>
                </div>
              ) : toursTrend < 0 ? (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <TrendingDown className="w-3 h-3" />
                  <span>{toursTrend}%</span>
                </div>
              ) : null}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.toursCompleted}</p>
            <p className="text-dark-400 text-sm">Tours Completed</p>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-500/5 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary-400" />
              </div>
              {watchTimeTrend > 0 ? (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{watchTimeTrend}%</span>
                </div>
              ) : watchTimeTrend < 0 ? (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <TrendingDown className="w-3 h-3" />
                  <span>{watchTimeTrend}%</span>
                </div>
              ) : null}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.totalWatchTime}h</p>
            <p className="text-dark-400 text-sm">Watch Time</p>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-500/5 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.countriesVisited}</p>
            <p className="text-dark-400 text-sm">Countries Visited</p>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <p className="text-3xl font-bold text-white">{stats.level}</p>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-dark-400">Progress to next level</span>
                <span className="text-yellow-400">{stats.levelProgress || 65}%</span>
              </div>
              <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.levelProgress || 65}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-500/5 rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Destinations from Admin */}
            {newDestinations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 border-primary-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-primary-400" />
                    New Destinations Added
                  </h2>
                  <Link to="/destinations" className="text-sm text-primary-400 hover:text-primary-300">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newDestinations.slice(0, 4).map((destination) => (
                    <Link
                      key={destination._id}
                      to={`/destination/${destination._id}`}
                      className="group relative rounded-xl overflow-hidden aspect-video"
                    >
                      <img
                        src={destination.image || destination.images?.[0]}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium truncate">{destination.name}</p>
                        <p className="text-xs text-dark-300">{destination.country}</p>
                      </div>
                      {destination.isNew && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                          New
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-dark-500 mt-3">
                  ✨ These destinations were recently added by our admin team
                </p>
              </motion.div>
            )}

            {/* Featured Tours (Admin Enabled) */}
            {featuredTours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Featured Tours
                  </h2>
                  <Link to="/explore?featured=true" className="text-sm text-primary-400 hover:text-primary-300">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredTours.slice(0, 4).map((tour) => (
                    <Link
                      key={tour._id}
                      to={`/tour/${tour._id}`}
                      className="group relative rounded-xl overflow-hidden aspect-video"
                    >
                      <img
                        src={tour.images?.[0]}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium truncate">{tour.title}</p>
                        <p className="text-xs text-dark-300">{tour.location}</p>
                      </div>
                      {tour.isFeatured && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-dark-500 mt-3">
                  ⭐ Handpicked experiences selected by our team
                </p>
              </motion.div>
            )}
            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Weekly Activity
                </h2>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span>Tours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-secondary-500" />
                    <span>Hours</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="toursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 shadow-xl">
                              <p className="text-dark-400 text-sm mb-2">{label}</p>
                              {payload.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-dark-300 text-sm">{item.name}:</span>
                                  <span className="text-white font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tours"
                      name="Tours"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#toursGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      name="Hours"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#hoursGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            {continueWatching.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Continue Watching</h2>
                <div className="space-y-4">
                  {continueWatching.map((item) => (
                    <Link
                      key={item._id}
                      to={`/virtual-tour/${item.tour._id}`}
                      className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
                    >
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.tour.images?.[0]?.url}
                          alt={item.tour.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium line-clamp-1">{item.tour.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-dark-400">{item.progress}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommended For You */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recommended For You</h2>
                <Link to="/explore" className="text-sm text-primary-400 hover:text-primary-300">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(recommendations?.tours || []).slice(0, 4).map((tour, index) => (
                  <TourCard key={tour._id} tour={tour} index={index} />
                ))}
              </div>
            </motion.div>

            {/* World Map Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Your Travel Map</h2>
              <div className="aspect-[2/1] bg-dark-800 rounded-xl relative overflow-hidden">
                <img
                  src="/images/world-map.svg"
                  alt="World Map"
                  className="w-full h-full object-contain opacity-30"
                />
                {/* Visited countries markers would go here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary-400">{stats.countriesVisited}</p>
                    <p className="text-dark-400">countries explored</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['France', 'Japan', 'Italy', 'USA', 'Indonesia', 'Egypt', 'Brazil'].map((country) => (
                  <span key={country} className="badge-primary">
                    <MapPin className="w-3 h-3 mr-1" />
                    {country}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Your Interests</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-dark-800 border border-dark-700 rounded-lg p-2">
                              <p className="text-white text-sm">
                                {payload[0].name}: {payload[0].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-dark-300 text-sm">{cat.name}</span>
                    </div>
                    <span className="text-dark-400 text-sm">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Achievements</h3>
                <a href="#achievements" className="text-sm text-primary-400">
                  View all
                </a>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {(achievements?.badges || [
                  { icon: '🌍', name: 'World Traveler', unlocked: true },
                  { icon: '🎯', name: 'First Tour', unlocked: true },
                  { icon: '⭐', name: '5 Star Reviewer', unlocked: true },
                  { icon: '🔥', name: '7 Day Streak', unlocked: false },
                  { icon: '🏆', name: 'Tour Master', unlocked: false },
                  { icon: '💎', name: 'Premium', unlocked: false },
                  { icon: '🌟', name: 'Super Fan', unlocked: true },
                  { icon: '🎨', name: 'Art Lover', unlocked: false }
                ]).map((badge, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${
                      badge.unlocked
                        ? 'bg-dark-700'
                        : 'bg-dark-800 opacity-40 grayscale'
                    }`}
                    title={badge.name}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300 text-sm">Complete 3 tours</span>
                    <span className="text-dark-400 text-sm">2/3</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300 text-sm">Watch 2 hours</span>
                    <span className="text-dark-400 text-sm">1.5/2h</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300 text-sm">Leave 2 reviews</span>
                    <span className="text-dark-400 text-sm">1/2</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {(recentActivity.length > 0 ? recentActivity : [
                  { type: 'tour', message: 'Completed Paris tour', time: '2 hours ago' },
                  { type: 'review', message: 'Left a review', time: '1 day ago' },
                  { type: 'badge', message: 'Earned World Traveler badge', time: '2 days ago' },
                  { type: 'favorite', message: 'Saved Tokyo tour', time: '3 days ago' }
                ]).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'tour' ? 'bg-primary-500/20 text-primary-400' :
                      activity.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                      activity.type === 'badge' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.type === 'tour' && <Map className="w-4 h-4" />}
                      {activity.type === 'review' && <Star className="w-4 h-4" />}
                      {activity.type === 'badge' && <Trophy className="w-4 h-4" />}
                      {activity.type === 'favorite' && <Heart className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-dark-200 text-sm">{activity.message}</p>
                      <p className="text-dark-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
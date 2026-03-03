import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  MapPin
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
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

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: () => userService.getDashboard().then(res => res.data)
  });

  const { data: achievements } = useQuery({
    queryKey: ['user', 'achievements'],
    queryFn: () => userService.getAchievements().then(res => res.data)
  });

  const { data: recommendations } = useQuery({
    queryKey: ['user', 'recommendations'],
    queryFn: () => userService.getRecommendations().then(res => res.data)
  });

  const stats = dashboardData?.stats || {
    toursCompleted: 12,
    totalWatchTime: 8.5,
    countriesVisited: 7,
    currentStreak: 5,
    totalPoints: 2450,
    level: 'Explorer'
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

  // Get active tab from URL params
  const tabFromUrl = searchParams.get('tab');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Side Navigation */}
      <UserSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-20 pb-20 lg:pb-8 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        }`}
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
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Map className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-dark-400 text-sm">Tours Completed</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.toursCompleted}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary-400" />
              </div>
              <span className="text-dark-400 text-sm">Watch Time</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalWatchTime}h</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-dark-400 text-sm">Countries</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.countriesVisited}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-dark-400 text-sm">Level</span>
            </div>
            <p className="text-xl font-bold text-white">{stats.level}</p>
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
            {/* Continue Watching */}
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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Globe2,
  TrendingUp,
  Eye,
  Heart,
  Calendar,
  Award,
  ArrowRight,
  Download
} from 'lucide-react';

const stats = [
  { icon: Eye, label: 'Total Tours Viewed', value: '1,234', change: '+12%' },
  { icon: Heart, label: 'Favorites', value: '45', change: '+5' },
  { icon: Calendar, label: 'Bookings', value: '12', change: '+3' },
  { icon: Globe2, label: 'Countries Visited', value: '18', change: '+2' }
];

const recentTours = [
  { id: 1, title: 'Northern Lights Aurora', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', date: '2 days ago', rating: 4.8 },
  { id: 2, title: 'Tokyo Night Life', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300', date: '1 week ago', rating: 4.9 },
  { id: 3, title: 'Paris Landmarks', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300', date: '2 weeks ago', rating: 4.7 }
];

const achievements = [
  { icon: Award, title: 'Explorer', description: 'Visited 10 destinations' },
  { icon: TrendingUp, title: 'Rising Star', description: '50+ tours completed' },
  { icon: Users, title: 'Community Leader', description: '100+ followers' }
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
              <p className="text-dark-400">Here's your virtual travel dashboard</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-white transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              This {range}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                </div>
                <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-dark-800 border border-dark-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Tours</h2>
              <Link to="/explore" className="text-primary-500 hover:text-primary-400 flex items-center gap-1 text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTours.map((tour, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-dark-700/50 hover:bg-dark-700 transition-colors group cursor-pointer"
                >
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{tour.title}</h3>
                    <p className="text-dark-400 text-sm mb-2">{tour.date}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={`text-sm ${j < Math.floor(tour.rating) ? 'text-yellow-400' : 'text-dark-600'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-dark-400 text-sm">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-dark-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-dark-800 border border-dark-700"
          >
            <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>

            <div className="space-y-4">
              {achievements.map((achievement, i) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                    className="p-4 rounded-xl bg-dark-700/50 hover:bg-dark-700 transition-colors text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{achievement.title}</h3>
                    <p className="text-dark-400 text-xs">{achievement.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <Link
              to="/explore"
              className="mt-6 w-full px-4 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors text-center block"
            >
              Continue Exploring
            </Link>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-dark-800 border border-dark-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-bold text-white">Viewing Activity</h2>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 mb-6">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ duration: 0.8, delay: 0.7 + i * 0.05 }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 hover:shadow-lg hover:shadow-primary-500/50 transition-all"
              />
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm text-dark-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

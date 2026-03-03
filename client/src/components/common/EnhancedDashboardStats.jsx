import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Eye, 
  Star,
  Calendar,
  Clock,
  Map,
  Globe,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * Enhanced DashboardStats Component
 * Features:
 * - Multiple chart types
 * - Time range comparison
 * - Revenue breakdown
 * - User analytics
 * - Tour performance
 */

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4'
};

// Sample data
const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, bookings: 18 },
  { name: 'Tue', revenue: 3800, bookings: 15 },
  { name: 'Wed', revenue: 5100, bookings: 22 },
  { name: 'Thu', revenue: 4700, bookings: 19 },
  { name: 'Fri', revenue: 6200, bookings: 28 },
  { name: 'Sat', revenue: 7800, bookings: 35 },
  { name: 'Sun', revenue: 7200, bookings: 32 }
];

const USER_GROWTH_DATA = [
  { name: 'Week 1', users: 1200, active: 800 },
  { name: 'Week 2', users: 1350, active: 920 },
  { name: 'Week 3', users: 1480, active: 1050 },
  { name: 'Week 4', users: 1650, active: 1180 }
];

const TOUR_CATEGORY_DATA = [
  { name: 'Cultural', value: 35, color: COLORS.primary },
  { name: 'Nature', value: 25, color: COLORS.success },
  { name: 'Historical', value: 20, color: COLORS.warning },
  { name: 'Adventure', value: 12, color: COLORS.danger },
  { name: 'Urban', value: 8, color: COLORS.secondary }
];

const TOP_DESTINATIONS = [
  { name: 'Paris', views: 45200, bookings: 892, revenue: 89200, growth: 12.5 },
  { name: 'Tokyo', views: 38900, bookings: 756, revenue: 75600, growth: 8.3 },
  { name: 'Rome', views: 32100, bookings: 623, revenue: 62300, growth: 15.2 },
  { name: 'New York', views: 29800, bookings: 589, revenue: 58900, growth: -3.1 },
  { name: 'Dubai', views: 27500, bookings: 534, revenue: 53400, growth: 22.7 }
];

const EnhancedDashboardStats = ({ 
  stats,
  timeRange = '7d',
  showCharts = true 
}) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [chartType, setChartType] = useState('area'); // line, area, bar

  const summaryStats = [
    {
      title: 'Total Revenue',
      value: '$45,280',
      change: 12.5,
      icon: DollarSign,
      color: 'primary',
      subtitle: 'This week'
    },
    {
      title: 'Total Users',
      value: '2,847',
      change: 8.3,
      icon: Users,
      color: 'secondary',
      subtitle: '+186 new this week'
    },
    {
      title: 'Total Bookings',
      value: '1,234',
      change: 15.2,
      icon: ShoppingCart,
      color: 'success',
      subtitle: 'Active bookings'
    },
    {
      title: 'Tour Views',
      value: '89.5K',
      change: -2.4,
      icon: Eye,
      color: 'warning',
      subtitle: 'This week'
    }
  ];

  const performanceMetrics = [
    { label: 'Avg. Booking Value', value: '$245', change: 5.2 },
    { label: 'Conversion Rate', value: '3.8%', change: 0.4 },
    { label: 'User Retention', value: '78%', change: 2.1 },
    { label: 'Avg. Session', value: '12m 34s', change: -1.2 }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-dark-400">{stat.title}</p>
              <p className="text-xs text-dark-500 mt-1">{stat.subtitle}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={metric.label} className="bg-dark-800/50 rounded-xl p-4">
              <p className="text-sm text-dark-400 mb-1">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      {showCharts && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
              <p className="text-sm text-dark-400">Daily revenue and bookings</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm"
              >
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="bar">Bar</option>
              </select>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={COLORS.primary} 
                    fill={`${COLORS.primary}30`}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke={COLORS.secondary} 
                    fill={`${COLORS.secondary}30`}
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : (
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke={COLORS.secondary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.secondary, strokeWidth: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Destinations & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Destinations</h3>
          <div className="space-y-4">
            {TOP_DESTINATIONS.map((dest, index) => (
              <div key={dest.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{dest.name}</span>
                    <div className={`flex items-center gap-1 text-sm ${
                      dest.growth >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {dest.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(dest.growth)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-400">
                    <span>{dest.views.toLocaleString()} views</span>
                    <span>{dest.bookings} bookings</span>
                    <span className="text-white">${dest.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tour Categories</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TOUR_CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {TOUR_CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {TOUR_CATEGORY_DATA.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="text-sm text-dark-300">{cat.name}</span>
                <span className="text-sm text-dark-500 ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      {showCharts && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">User Growth</h3>
              <p className="text-sm text-dark-400">Total vs Active users</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke={COLORS.primary} 
                  fill={`${COLORS.primary}30`}
                  strokeWidth={2}
                  name="Total Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke={COLORS.success} 
                  fill={`${COLORS.success}30`}
                  strokeWidth={2}
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboardStats;

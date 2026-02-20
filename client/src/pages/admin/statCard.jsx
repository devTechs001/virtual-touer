import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorClasses = {
  primary: {
    bg: 'bg-primary-500/20',
    text: 'text-primary-400',
    glow: 'shadow-primary-500/20'
  },
  secondary: {
    bg: 'bg-secondary-500/20',
    text: 'text-secondary-400',
    glow: 'shadow-secondary-500/20'
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20'
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20'
  }
};

const StatCard = ({ title, value, change, icon: Icon, color = 'primary', loading }) => {
  const colors = colorClasses[color];
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 skeleton rounded" />
            <div className="h-8 w-32 skeleton rounded" />
            <div className="h-4 w-20 skeleton rounded" />
          </div>
          <div className="w-12 h-12 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 hover:shadow-lg ${colors.glow} transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-secondary-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
            <span className="text-dark-500">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
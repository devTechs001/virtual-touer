import Activity from '../models/Activity.model.js';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';
import Tour from '../models/Tour.model.js';
import Review from '../models/Review.model.js';

class AnalyticsService {
  /**
   * Get dashboard stats for admin
   */
  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    // Revenue stats
    const currentRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const previousRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const revenueTotal = currentRevenue[0]?.total || 0;
    const revenuePrevious = previousRevenue[0]?.total || 1;
    const revenueChange = ((revenueTotal - revenuePrevious) / revenuePrevious) * 100;

    // User stats
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousNewUsers = await User.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    const userChange = previousNewUsers > 0 
      ? ((newUsers - previousNewUsers) / previousNewUsers) * 100 
      : 100;

    // View stats
    const currentViews = await Activity.countDocuments({
      type: 'tour_view',
      createdAt: { $gte: thirtyDaysAgo }
    });

    const previousViews = await Activity.countDocuments({
      type: 'tour_view',
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const viewChange = previousViews > 0 
      ? ((currentViews - previousViews) / previousViews) * 100 
      : 100;

    // Booking stats
    const currentBookings = await Booking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const previousBookings = await Booking.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const bookingChange = previousBookings > 0 
      ? ((currentBookings - previousBookings) / previousBookings) * 100 
      : 100;

    return {
      revenue: {
        total: revenueTotal,
        change: Math.round(revenueChange)
      },
      users: {
        total: totalUsers,
        new: newUsers,
        change: Math.round(userChange)
      },
      views: {
        total: currentViews,
        change: Math.round(viewChange)
      },
      bookings: {
        total: currentBookings,
        change: Math.round(bookingChange)
      }
    };
  }

  /**
   * Get revenue chart data
   */
  async getRevenueChart(days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return data.map(item => ({
      date: item._id,
      revenue: item.revenue,
      bookings: item.bookings
    }));
  }

  /**
   * Get user growth chart data
   */
  async getUserGrowthChart(days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get active users per day
    const activeUsers = await Activity.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            user: '$user'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          activeUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const activeMap = new Map(activeUsers.map(a => [a._id, a.activeUsers]));

    return data.map(item => ({
      date: item._id,
      newUsers: item.newUsers,
      activeUsers: activeMap.get(item._id) || 0
    }));
  }

  /**
   * Get geographic distribution
   */
  async getGeoDistribution() {
    const data = await Tour.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: '$location.country',
          tours: { $sum: 1 },
          totalViews: { $sum: '$participants' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 }
    ]);

    // Get revenue by country
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $lookup: {
          from: 'tours',
          localField: 'tour',
          foreignField: '_id',
          as: 'tourData'
        }
      },
      { $unwind: '$tourData' },
      {
        $group: {
          _id: '$tourData.location.country',
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const revenueMap = new Map(revenueData.map(r => [r._id, r.revenue]));

    return data.map(item => ({
      country: item._id,
      tours: item.tours,
      views: item.totalViews,
      revenue: revenueMap.get(item._id) || 0
    }));
  }

  /**
   * Get top performing tours
   */
  async getTopTours(limit = 10) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get bookings and revenue
    const bookingData = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$tour',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const bookingMap = new Map(bookingData.map(b => [b._id.toString(), b]));

    const tours = await Tour.find({ published: true })
      .sort('-participants -rating')
      .limit(limit)
      .select('title images location rating participants');

    return tours.map(tour => {
      const booking = bookingMap.get(tour._id.toString()) || { bookings: 0, revenue: 0 };
      return {
        ...tour.toObject(),
        bookings: booking.bookings,
        revenue: booking.revenue
      };
    });
  }

  /**
   * Get recent activity feed
   */
  async getRecentActivity(limit = 20) {
    const activities = [];

    // Recent bookings
    const bookings = await Booking.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name')
      .populate('tour', 'title');

    bookings.forEach(b => {
      activities.push({
        type: 'booking',
        message: `${b.user?.name || 'A user'} booked "${b.tour?.title}"`,
        time: this.formatTimeAgo(b.createdAt),
        createdAt: b.createdAt
      });
    });

    // Recent reviews
    const reviews = await Review.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name')
      .populate('tour', 'title');

    reviews.forEach(r => {
      activities.push({
        type: 'review',
        message: `${r.user?.name || 'A user'} reviewed "${r.tour?.title}" with ${r.rating} stars`,
        time: this.formatTimeAgo(r.createdAt),
        createdAt: r.createdAt
      });
    });

    // Recent users
    const users = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name createdAt');

    users.forEach(u => {
      activities.push({
        type: 'user',
        message: `${u.name} joined Virtual Tourist`,
        time: this.formatTimeAgo(u.createdAt),
        createdAt: u.createdAt
      });
    });

    // Sort by date and limit
    activities.sort((a, b) => b.createdAt - a.createdAt);
    return { activities: activities.slice(0, limit) };
  }

  formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  }
}

export default new AnalyticsService();
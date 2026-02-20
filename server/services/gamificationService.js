import Achievement from '../models/Achievement.model.js';
import UserAchievement from '../models/UserAchievement.model.js';
import User from '../models/User.model.js';
import Activity from '../models/Activity.model.js';

class GamificationService {
  /**
   * Check and award achievements for a user
   */
  async checkAchievements(userId) {
    const user = await User.findById(userId);
    const achievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ user: userId });
    const unlockedIds = userAchievements.map(ua => ua.achievement.toString());

    const newlyUnlocked = [];

    for (const achievement of achievements) {
      if (unlockedIds.includes(achievement._id.toString())) continue;

      const progress = await this.calculateProgress(userId, achievement);
      
      if (progress.current >= progress.target) {
        // Unlock achievement
        await UserAchievement.create({
          user: userId,
          achievement: achievement._id,
          progress
        });

        // Award points
        await User.findByIdAndUpdate(userId, {
          $inc: { 'stats.totalPoints': achievement.points }
        });

        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Calculate progress for a specific achievement
   */
  async calculateProgress(userId, achievement) {
    let current = 0;
    const target = achievement.criteria.value;

    switch (achievement.criteria.type) {
      case 'tours_completed':
        current = await Activity.countDocuments({
          user: userId,
          type: 'tour_complete'
        });
        break;

      case 'countries_visited':
        const countries = await Activity.distinct('tour', { user: userId });
        // Count unique countries from tours
        current = countries.length;
        break;

      case 'reviews_written':
        const Review = (await import('../models/Review.model.js')).default;
        current = await Review.countDocuments({ user: userId });
        break;

      case 'streak_days':
        current = await this.calculateStreak(userId);
        break;

      case 'watch_time':
        const result = await Activity.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, total: { $sum: '$metadata.duration' } } }
        ]);
        current = Math.floor((result[0]?.total || 0) / 3600); // Convert to hours
        break;

      case 'points_earned':
        const user = await User.findById(userId);
        current = user?.stats?.totalPoints || 0;
        break;
    }

    return { current, target };
  }

  /**
   * Calculate current streak
   */
  async calculateStreak(userId) {
    const activities = await Activity.find({ user: userId })
      .sort('-createdAt')
      .select('createdAt');

    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const activity of activities) {
      const activityDate = new Date(activity.createdAt);
      activityDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  }

  /**
   * Get user's level based on points
   */
  getLevel(points) {
    const levels = [
      { name: 'Newcomer', minPoints: 0, icon: '🌱' },
      { name: 'Explorer', minPoints: 500, icon: '🧭' },
      { name: 'Adventurer', minPoints: 1500, icon: '🎒' },
      { name: 'Traveler', minPoints: 3000, icon: '✈️' },
      { name: 'Globetrotter', minPoints: 5000, icon: '🌍' },
      { name: 'World Expert', minPoints: 10000, icon: '🏆' },
      { name: 'Travel Legend', minPoints: 25000, icon: '👑' }
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].minPoints) {
        const nextLevel = levels[i + 1];
        return {
          ...levels[i],
          currentPoints: points,
          nextLevel: nextLevel?.name,
          pointsToNextLevel: nextLevel ? nextLevel.minPoints - points : 0,
          progress: nextLevel 
            ? ((points - levels[i].minPoints) / (nextLevel.minPoints - levels[i].minPoints)) * 100
            : 100
        };
      }
    }

    return levels[0];
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 100, timeframe = 'all') {
    let dateFilter = {};
    
    if (timeframe === 'weekly') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: oneWeekAgo } };
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: oneMonthAgo } };
    }

    const leaderboard = await User.find({ 'stats.totalPoints': { $gt: 0 } })
      .sort('-stats.totalPoints')
      .limit(limit)
      .select('name avatar stats.totalPoints stats.toursCompleted');

    return leaderboard.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      },
      points: user.stats?.totalPoints || 0,
      toursCompleted: user.stats?.toursCompleted || 0,
      level: this.getLevel(user.stats?.totalPoints || 0)
    }));
  }

  /**
   * Award points for an action
   */
  async awardPoints(userId, action, metadata = {}) {
    const pointsMap = {
      tour_view: 5,
      tour_complete: 25,
      review_written: 15,
      first_tour: 50,
      daily_login: 10,
      share: 5,
      invite_friend: 100
    };

    const points = pointsMap[action] || 0;
    
    if (points > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.totalPoints': points }
      });

      // Check for new achievements
      const newAchievements = await this.checkAchievements(userId);

      return { points, newAchievements };
    }

    return { points: 0, newAchievements: [] };
  }
}

export default new GamificationService();
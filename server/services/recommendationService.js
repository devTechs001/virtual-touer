import Tour from '../models/Tour.js';
import Activity from '../models/Activity.js';
import Favorite from '../models/Favourite.js';

class RecommendationService {
  /**
   * Get personalized tour recommendations for a user
   */
  async getRecommendations(userId, limit = 10) {
    // Get user's activity history
    const activities = await Activity.find({ user: userId })
      .sort('-createdAt')
      .limit(100)
      .populate('tour', 'category tags location');

    // Get user's favorites
    const favorites = await Favorite.find({ user: userId })
      .populate('tour', 'category tags location');

    // Analyze user preferences
    const preferences = this.analyzePreferences(activities, favorites);

    // Get recommendations based on preferences
    const recommendations = await this.generateRecommendations(preferences, userId, limit);

    return recommendations;
  }

  /**
   * Analyze user preferences from activity and favorites
   */
  analyzePreferences(activities, favorites) {
    const categoryScores = {};
    const tagScores = {};
    const countryScores = {};

    // Score from activities (views, completions)
    activities.forEach((activity) => {
      if (!activity.tour) return;

      const multiplier = activity.type === 'tour_complete' ? 3 :
                         activity.type === 'tour_view' ? 1 : 0.5;

      // Category scoring
      const category = activity.tour.category;
      categoryScores[category] = (categoryScores[category] || 0) + multiplier;

      // Tag scoring
      activity.tour.tags?.forEach((tag) => {
        tagScores[tag] = (tagScores[tag] || 0) + multiplier * 0.5;
      });

      // Location scoring
      const country = activity.tour.location?.country;
      if (country) {
        countryScores[country] = (countryScores[country] || 0) + multiplier * 0.3;
      }
    });

    // Score from favorites (higher weight)
    favorites.forEach((fav) => {
      if (!fav.tour) return;

      const category = fav.tour.category;
      categoryScores[category] = (categoryScores[category] || 0) + 5;

      fav.tour.tags?.forEach((tag) => {
        tagScores[tag] = (tagScores[tag] || 0) + 2;
      });

      const country = fav.tour.location?.country;
      if (country) {
        countryScores[country] = (countryScores[country] || 0) + 1.5;
      }
    });

    // Normalize and sort
    const sortByScore = (obj) => 
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([key, score]) => ({ key, score }));

    return {
      categories: sortByScore(categoryScores),
      tags: sortByScore(tagScores),
      countries: sortByScore(countryScores)
    };
  }

  /**
   * Generate tour recommendations based on preferences
   */
  async generateRecommendations(preferences, userId, limit) {
    // Get tours the user has already interacted with
    const viewedTourIds = await Activity.distinct('tour', { user: userId });
    const favoriteTourIds = await Favorite.distinct('tour', { user: userId });
    const excludeIds = [...new Set([...viewedTourIds, ...favoriteTourIds])];

    // Build query based on preferences
    const query = {
      _id: { $nin: excludeIds },
      published: true
    };

    // Add category preferences
    if (preferences.categories.length > 0) {
      const topCategories = preferences.categories.slice(0, 3).map(c => c.key);
      query.category = { $in: topCategories };
    }

    // Find matching tours
    let tours = await Tour.find(query)
      .sort('-rating -participants')
      .limit(limit * 2)
      .populate('destination', 'name');

    // Score and rank tours
    const scoredTours = tours.map((tour) => {
      let score = 0;

      // Category match
      const categoryPref = preferences.categories.find(c => c.key === tour.category);
      if (categoryPref) score += categoryPref.score * 2;

      // Tag matches
      tour.tags?.forEach((tag) => {
        const tagPref = preferences.tags.find(t => t.key === tag);
        if (tagPref) score += tagPref.score;
      });

      // Country match
      const countryPref = preferences.countries.find(c => c.key === tour.location?.country);
      if (countryPref) score += countryPref.score;

      // Boost highly rated tours
      score += tour.rating * 2;

      // Boost featured tours
      if (tour.featured) score += 5;

      return { tour, score };
    });

    // Sort by score and return top recommendations
    scoredTours.sort((a, b) => b.score - a.score);

    return scoredTours.slice(0, limit).map(item => ({
      ...item.tour.toObject(),
      recommendationScore: item.score,
      matchReason: this.getMatchReason(item.tour, preferences)
    }));
  }

  /**
   * Get human-readable reason for recommendation
   */
  getMatchReason(tour, preferences) {
    const reasons = [];

    // Category match
    const categoryPref = preferences.categories.find(c => c.key === tour.category);
    if (categoryPref && categoryPref.score > 3) {
      reasons.push(`You love ${tour.category} tours`);
    }

    // Tag matches
    const matchedTags = tour.tags?.filter(tag => 
      preferences.tags.some(t => t.key === tag && t.score > 2)
    );
    if (matchedTags?.length > 0) {
      reasons.push(`Matches your interest in ${matchedTags[0]}`);
    }

    // Country match
    const countryPref = preferences.countries.find(c => c.key === tour.location?.country);
    if (countryPref && countryPref.score > 2) {
      reasons.push(`You've explored ${tour.location.country} before`);
    }

    // Rating
    if (tour.rating >= 4.8) {
      reasons.push('Highly rated by travelers');
    }

    // Featured
    if (tour.featured) {
      reasons.push('Featured experience');
    }

    return reasons.slice(0, 2);
  }

  /**
   * Get similar tours based on a specific tour
   */
  async getSimilarTours(tourId, limit = 6) {
    const tour = await Tour.findById(tourId);
    if (!tour) return [];

    const similarTours = await Tour.find({
      _id: { $ne: tourId },
      published: true,
      $or: [
        { category: tour.category },
        { tags: { $in: tour.tags } },
        { 'location.country': tour.location?.country }
      ]
    })
      .sort('-rating -participants')
      .limit(limit)
      .populate('destination', 'name');

    return similarTours;
  }

  /**
   * Get trending tours based on recent activity
   */
  async getTrendingTours(limit = 10) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trending = await Activity.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo },
          type: { $in: ['tour_view', 'tour_complete'] }
        }
      },
      {
        $group: {
          _id: '$tour',
          viewCount: { $sum: 1 },
          completions: {
            $sum: { $cond: [{ $eq: ['$type', 'tour_complete'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          score: { $add: ['$viewCount', { $multiply: ['$completions', 3] }] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit }
    ]);

    const tourIds = trending.map(t => t._id);
    const tours = await Tour.find({ _id: { $in: tourIds }, published: true })
      .populate('destination', 'name');

    // Maintain order
    const tourMap = new Map(tours.map(t => [t._id.toString(), t]));
    return trending.map(t => ({
      ...tourMap.get(t._id.toString())?.toObject(),
      trendingScore: t.score
    })).filter(Boolean);
  }
}

export default new RecommendationService();
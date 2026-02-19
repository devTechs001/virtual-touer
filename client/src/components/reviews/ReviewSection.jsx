import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Flag, ChevronDown, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

import { useAuth } from '../../context/AuthContext';
import { useAddReview } from '../../hooks/useTours';
import ReviewForm from './ReviewForm';

const ReviewSection = ({ tourId, reviews = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const addReview = useAddReview();

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0);
      default:
        return 0;
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 5);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => Math.round(r.rating) === rating).length,
    percentage: (reviews.filter(r => Math.round(r.rating) === rating).length / reviews.length) * 100 || 0
  }));

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmitReview = async (data) => {
    await addReview.mutateAsync({ tourId, data });
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-1">{averageRating}</div>
            <div className="flex items-center gap-1 justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-dark-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-dark-400">{reviews.length} reviews</p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-dark-400 w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-dark-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review CTA */}
        <div className="flex flex-col items-center justify-center p-6 bg-dark-800/50 rounded-2xl">
          {isAuthenticated ? (
            <>
              <MessageCircle className="w-10 h-10 text-primary-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Share Your Experience</h3>
              <p className="text-dark-400 text-sm mb-4 text-center">
                Help others by sharing your thoughts about this tour
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Write a Review
              </button>
            </>
          ) : (
            <>
              <MessageCircle className="w-10 h-10 text-dark-500 mb-3" />
              <p className="text-dark-400 text-sm mb-4 text-center">
                Sign in to leave a review
              </p>
              <a href="/login" className="btn-primary">
                Sign In
              </a>
            </>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onClose={() => setShowReviewForm(false)}
            isSubmitting={addReview.isPending}
          />
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div>
        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-dark-200 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews */}
        <div className="space-y-6">
          {displayedReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            displayedReviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-dark-800/50 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.user?.avatar || '/default-avatar.png'}
                    alt={review.user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{review.user?.name}</h4>
                        <p className="text-sm text-dark-500">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-dark-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-dark-300 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-primary-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful || 0})
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-red-400 transition-colors">
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Show More */}
        {reviews.length > 5 && !showAllReviews && (
          <button
            onClick={() => setShowAllReviews(true)}
            className="w-full mt-6 py-3 bg-dark-800 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
          >
            Show all {reviews.length} reviews
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
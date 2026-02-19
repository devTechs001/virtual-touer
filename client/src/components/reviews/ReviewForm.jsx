import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';

const ReviewForm = ({ onSubmit, onClose, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    onSubmit({ rating, comment });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-dark-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-dark-400">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              rows={5}
              placeholder="Share your experience with this tour..."
              className="input resize-none"
            />
            <p className="mt-2 text-sm text-dark-500">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
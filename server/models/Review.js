import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.tour);
});

// Call calculateAverageRating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
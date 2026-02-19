import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['tour_view', 'tour_complete', 'review', 'favorite', 'share', 'booking'],
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  metadata: {
    duration: Number, // Watch time in seconds
    progress: Number, // Percentage completed
    device: String,
    browser: String
  }
}, {
  timestamps: true
});

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ tour: 1, type: 1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['exploration', 'engagement', 'social', 'milestone', 'special'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['tours_completed', 'countries_visited', 'reviews_written', 'streak_days', 'watch_time', 'points_earned', 'special'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  points: {
    type: Number,
    default: 100
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isSecret: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
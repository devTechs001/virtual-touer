import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email', 'copy', 'other'],
    required: true
  },
  message: String
}, {
  timestamps: true
});

shareSchema.index({ tour: 1 });
shareSchema.index({ user: 1 });

const Share = mongoose.model('Share', shareSchema);
export default Share;
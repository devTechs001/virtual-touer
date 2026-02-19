import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: String,
  confirmationCode: String,
  specialRequests: String,
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Generate confirmation code before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = `VT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
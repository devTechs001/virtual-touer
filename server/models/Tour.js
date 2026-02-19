import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  panoramas: [{
    url: { type: String, required: true },
    title: String,
    description: String,
    hotspots: [{
      pitch: Number,
      yaw: Number,
      type: { type: String, enum: ['info', 'link', 'scene'] },
      title: String,
      description: String,
      targetScene: Number
    }]
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number
  }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    city: String,
    country: String,
    continent: String
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  category: {
    type: String,
    enum: ['cultural', 'nature', 'adventure', 'historical', 'urban', 'relaxation', 'food', 'art'],
    required: true
  },
  tags: [String],
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isVirtual: {
    type: Boolean,
    default: true
  },
  is360: {
    type: Boolean,
    default: false
  },
  hasAR: {
    type: Boolean,
    default: false
  },
  isLive: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  participants: {
    type: Number,
    default: 0
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  languages: [{
    type: String,
    default: ['en']
  }],
  accessibility: {
    wheelchairAccessible: { type: Boolean, default: false },
    audioDescription: { type: Boolean, default: false },
    signLanguage: { type: Boolean, default: false }
  },
  schedule: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String
  }],
  maxParticipants: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tourSchema.index({ location: '2dsphere' });
tourSchema.index({ title: 'text', description: 'text', tags: 'text' });
tourSchema.index({ category: 1, featured: 1, published: 1 });
tourSchema.index({ rating: -1, reviewCount: -1 });

// Generate slug before saving
tourSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual for reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour'
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
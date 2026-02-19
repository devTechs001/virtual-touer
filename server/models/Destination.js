import mongoose from 'mongoose';
import slugify from 'slugify';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  images: [{
    url: String,
    caption: String
  }],
  coverImage: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
    city: String,
    country: String,
    continent: String
  },
  highlights: [String],
  bestTimeToVisit: String,
  climate: String,
  language: String,
  currency: String,
  timezone: String,
  featured: {
    type: Boolean,
    default: false
  },
  tourCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

destinationSchema.index({ location: '2dsphere' });
destinationSchema.index({ name: 'text', description: 'text' });

destinationSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

destinationSchema.virtual('tours', {
  ref: 'Tour',
  localField: '_id',
  foreignField: 'destination'
});

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
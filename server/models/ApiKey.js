import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  scopes: {
    type: [String],
    default: []
  },
  active: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ApiKey', apiKeySchema);

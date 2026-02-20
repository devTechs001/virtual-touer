import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Default configurations
systemConfigSchema.statics.getDefaults = function() {
  return {
    maintenance: {
      enabled: false,
      message: 'We are currently performing scheduled maintenance. Please check back soon.',
      allowedIPs: [],
      allowedRoles: ['admin'],
      estimatedEndTime: null,
      scheduledStart: null,
      scheduledEnd: null,
      showCountdown: true,
      contactEmail: 'support@virtualtourist.com',
      socialLinks: {
        twitter: 'https://twitter.com/virtualtourist',
        facebook: 'https://facebook.com/virtualtourist'
      }
    },
    features: {
      registration: true,
      booking: true,
      reviews: true,
      liveChat: true,
      payments: true,
      socialLogin: true,
      emailVerification: true
    },
    announcements: [],
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100
    },
    security: {
      maxLoginAttempts: 5,
      lockoutDuration: 30 * 60 * 1000,
      sessionTimeout: 7 * 24 * 60 * 60 * 1000
    }
  };
};

// Get configuration value
systemConfigSchema.statics.get = async function(key) {
  const config = await this.findOne({ key });
  if (config) return config.value;
  
  const defaults = this.getDefaults();
  return defaults[key] || null;
};

// Set configuration value
systemConfigSchema.statics.set = async function(key, value, userId = null) {
  return this.findOneAndUpdate(
    { key },
    { 
      value, 
      updatedBy: userId,
      updatedAt: new Date()
    },
    { upsert: true, new: true }
  );
};

// Get all configurations
systemConfigSchema.statics.getAll = async function() {
  const configs = await this.find();
  const defaults = this.getDefaults();
  
  const result = { ...defaults };
  configs.forEach(config => {
    result[config.key] = config.value;
  });
  
  return result;
};

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
export default SystemConfig;
import SystemConfig from '../models/SystemConfig.models.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get maintenance status (public)
// @route   GET /api/maintenance/status
export const getMaintenanceStatus = asyncHandler(async (req, res) => {
  const maintenance = await SystemConfig.get('maintenance');
  
  res.json({
    success: true,
    maintenance: {
      enabled: maintenance?.enabled || false,
      message: maintenance?.message,
      estimatedEndTime: maintenance?.estimatedEndTime,
      showCountdown: maintenance?.showCountdown,
      contactEmail: maintenance?.contactEmail,
      socialLinks: maintenance?.socialLinks
    }
  });
});

// @desc    Get system configuration (admin only)
// @route   GET /api/system/config
export const getSystemConfig = asyncHandler(async (req, res) => {
  const config = await SystemConfig.getAll();
  
  res.json({
    success: true,
    config
  });
});

// @desc    Update system configuration
// @route   PUT /api/system/config/:key
export const updateSystemConfig = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  const allowedKeys = ['maintenance', 'features', 'announcements', 'rateLimit', 'security'];
  
  if (!allowedKeys.includes(key)) {
    throw new ApiError('Invalid configuration key', 400);
  }
  
  const config = await SystemConfig.set(key, value, req.user.id);
  
  // If enabling maintenance, notify users
  if (key === 'maintenance' && value.enabled) {
    await notifyMaintenanceStart(value);
  }
  
  // Emit socket event for real-time updates
  const io = req.app.get('io');
  if (io) {
    io.emit('system-config-update', { key, value });
  }
  
  res.json({
    success: true,
    config
  });
});

// @desc    Toggle maintenance mode
// @route   POST /api/system/maintenance/toggle
export const toggleMaintenance = asyncHandler(async (req, res) => {
  const { 
    enabled, 
    message, 
    estimatedEndTime, 
    scheduledStart,
    scheduledEnd,
    notifyUsers = true 
  } = req.body;
  
  const currentMaintenance = await SystemConfig.get('maintenance') || {};
  
  const newMaintenance = {
    ...currentMaintenance,
    enabled,
    message: message || currentMaintenance.message,
    estimatedEndTime: estimatedEndTime || null,
    scheduledStart: scheduledStart || null,
    scheduledEnd: scheduledEnd || null,
    updatedAt: new Date()
  };
  
  await SystemConfig.set('maintenance', newMaintenance, req.user.id);
  
  // Notify users if requested
  if (notifyUsers && enabled) {
    await notifyMaintenanceStart(newMaintenance);
  }
  
  // Emit socket event
  const io = req.app.get('io');
  if (io) {
    io.emit('maintenance-mode', { enabled, maintenance: newMaintenance });
  }
  
  res.json({
    success: true,
    maintenance: newMaintenance
  });
});

// @desc    Schedule maintenance
// @route   POST /api/system/maintenance/schedule
export const scheduleMaintenance = asyncHandler(async (req, res) => {
  const { 
    startTime, 
    endTime, 
    message,
    notifyBefore = [24, 1] // Hours before to notify
  } = req.body;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (start >= end) {
    throw new ApiError('End time must be after start time', 400);
  }
  
  if (start < new Date()) {
    throw new ApiError('Start time must be in the future', 400);
  }
  
  const currentMaintenance = await SystemConfig.get('maintenance') || {};
  
  const scheduledMaintenance = {
    ...currentMaintenance,
    enabled: false, // Will be enabled at scheduled time
    scheduledStart: start,
    scheduledEnd: end,
    message: message || currentMaintenance.message,
    notifyBefore
  };
  
  await SystemConfig.set('maintenance', scheduledMaintenance, req.user.id);
  
  // Schedule notifications
  for (const hours of notifyBefore) {
    const notifyTime = new Date(start.getTime() - hours * 60 * 60 * 1000);
    if (notifyTime > new Date()) {
      scheduleMaintenanceNotification(notifyTime, hours, scheduledMaintenance);
    }
  }
  
  // Schedule auto-enable
  scheduleMaintenanceToggle(start, true, scheduledMaintenance);
  
  // Schedule auto-disable
  scheduleMaintenanceToggle(end, false, scheduledMaintenance);
  
  res.json({
    success: true,
    maintenance: scheduledMaintenance
  });
});

// @desc    Cancel scheduled maintenance
// @route   DELETE /api/system/maintenance/schedule
export const cancelScheduledMaintenance = asyncHandler(async (req, res) => {
  const currentMaintenance = await SystemConfig.get('maintenance') || {};
  
  const updatedMaintenance = {
    ...currentMaintenance,
    scheduledStart: null,
    scheduledEnd: null,
    enabled: false
  };
  
  await SystemConfig.set('maintenance', updatedMaintenance, req.user.id);
  
  // TODO: Cancel scheduled jobs
  
  res.json({
    success: true,
    message: 'Scheduled maintenance cancelled'
  });
});

// @desc    Get feature flags
// @route   GET /api/system/features
export const getFeatureFlags = asyncHandler(async (req, res) => {
  const features = await SystemConfig.get('features');
  
  res.json({
    success: true,
    features
  });
});

// @desc    Toggle feature flag
// @route   PUT /api/system/features/:feature
export const toggleFeature = asyncHandler(async (req, res) => {
  const { feature } = req.params;
  const { enabled } = req.body;
  
  const currentFeatures = await SystemConfig.get('features') || {};
  
  if (!(feature in currentFeatures)) {
    throw new ApiError('Invalid feature flag', 400);
  }
  
  currentFeatures[feature] = enabled;
  
  await SystemConfig.set('features', currentFeatures, req.user.id);
  
  // Emit socket event
  const io = req.app.get('io');
  if (io) {
    io.emit('feature-toggle', { feature, enabled });
  }
  
  res.json({
    success: true,
    features: currentFeatures
  });
});

// @desc    Create announcement
// @route   POST /api/system/announcements
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, type, link, expiresAt, dismissible, targetAudience } = req.body;
  
  const announcements = await SystemConfig.get('announcements') || [];
  
  const newAnnouncement = {
    id: `ann-${Date.now()}`,
    title,
    message,
    type: type || 'info', // info, warning, success, error
    link,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    dismissible: dismissible !== false,
    targetAudience: targetAudience || 'all', // all, users, guests
    createdAt: new Date(),
    createdBy: req.user.id
  };
  
  announcements.push(newAnnouncement);
  
  await SystemConfig.set('announcements', announcements, req.user.id);
  
  // Emit socket event
  const io = req.app.get('io');
  if (io) {
    io.emit('new-announcement', newAnnouncement);
  }
  
  res.status(201).json({
    success: true,
    announcement: newAnnouncement
  });
});

// @desc    Delete announcement
// @route   DELETE /api/system/announcements/:id
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let announcements = await SystemConfig.get('announcements') || [];
  announcements = announcements.filter(a => a.id !== id);
  
  await SystemConfig.set('announcements', announcements, req.user.id);
  
  res.json({
    success: true,
    message: 'Announcement deleted'
  });
});

// @desc    Get active announcements (public)
// @route   GET /api/announcements
export const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await SystemConfig.get('announcements') || [];
  const now = new Date();
  
  // Filter active announcements
  const activeAnnouncements = announcements.filter(a => {
    if (a.expiresAt && new Date(a.expiresAt) < now) return false;
    return true;
  });
  
  res.json({
    success: true,
    announcements: activeAnnouncements
  });
});

// @desc    Get system health
// @route   GET /api/system/health
export const getSystemHealth = asyncHandler(async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      cache: 'connected', // Add Redis check if using
      storage: 'connected' // Add storage check
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };
  
  // Check if any service is down
  if (Object.values(health.services).includes('disconnected')) {
    health.status = 'degraded';
  }
  
  res.json(health);
});

// Helper functions
async function notifyMaintenanceStart(maintenance) {
  try {
    // Get all users with notifications enabled
    const users = await User.find({ 
      'preferences.notifications': true,
      isVerified: true
    }).select('email name');
    
    const emailPromises = users.map(user => 
      sendEmail({
        to: user.email,
        subject: '🔧 Scheduled Maintenance - Virtual Tourist',
        template: 'maintenance-notification',
        data: {
          name: user.name,
          message: maintenance.message,
          estimatedEndTime: maintenance.estimatedEndTime,
          contactEmail: maintenance.contactEmail
        }
      }).catch(err => console.error(`Failed to send to ${user.email}:`, err))
    );
    
    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Failed to send maintenance notifications:', error);
  }
}

function scheduleMaintenanceNotification(time, hoursBefore, maintenance) {
  const delay = time.getTime() - Date.now();
  
  setTimeout(async () => {
    // Send notification
    const users = await User.find({ 
      'preferences.notifications': true 
    }).select('email name');
    
    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `⚠️ Maintenance in ${hoursBefore} hour(s) - Virtual Tourist`,
        template: 'maintenance-reminder',
        data: {
          name: user.name,
          hoursBefore,
          startTime: maintenance.scheduledStart,
          message: maintenance.message
        }
      }).catch(console.error);
    }
  }, delay);
}

function scheduleMaintenanceToggle(time, enabled, maintenance) {
  const delay = time.getTime() - Date.now();
  
  setTimeout(async () => {
    await SystemConfig.set('maintenance', {
      ...maintenance,
      enabled
    });
    
    // Emit socket event
    const io = global.io;
    if (io) {
      io.emit('maintenance-mode', { enabled, maintenance });
    }
  }, delay);
}
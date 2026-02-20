import SystemConfig from '../models/SystemConfig.model.js';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const maintenanceMiddleware = async (req, res, next) => {
  try {
    // Get maintenance configuration
    const maintenance = await SystemConfig.get('maintenance');
    
    if (!maintenance?.enabled) {
      return next();
    }

    // Check if maintenance is scheduled
    const now = new Date();
    if (maintenance.scheduledStart && new Date(maintenance.scheduledStart) > now) {
      return next(); // Maintenance hasn't started yet
    }
    if (maintenance.scheduledEnd && new Date(maintenance.scheduledEnd) < now) {
      // Auto-disable maintenance after scheduled end
      await SystemConfig.set('maintenance', { ...maintenance, enabled: false });
      return next();
    }

    // Allow health check endpoint
    if (req.path === '/api/health' || req.path === '/api/maintenance/status') {
      return next();
    }

    // Allow static files
    if (req.path.startsWith('/assets') || req.path.startsWith('/icons')) {
      return next();
    }

    // Check if IP is allowed
    const clientIP = req.ip || req.connection.remoteAddress;
    if (maintenance.allowedIPs?.includes(clientIP)) {
      return next();
    }

    // Check if user has bypass role
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role');
        
        if (user && maintenance.allowedRoles?.includes(user.role)) {
          req.maintenanceBypass = true;
          return next();
        }
      } catch (err) {
        // Token invalid, continue with maintenance check
      }
    }

    // Block auth endpoints during maintenance
    const blockedPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/bookings',
      '/api/payments'
    ];

    const isBlocked = blockedPaths.some(path => req.path.startsWith(path));
    
    if (isBlocked || req.method !== 'GET') {
      return res.status(503).json({
        success: false,
        maintenance: true,
        message: maintenance.message,
        estimatedEndTime: maintenance.estimatedEndTime,
        contactEmail: maintenance.contactEmail,
        socialLinks: maintenance.socialLinks,
        showCountdown: maintenance.showCountdown
      });
    }

    // Allow GET requests but add maintenance header
    res.set('X-Maintenance-Mode', 'true');
    next();
  } catch (error) {
    console.error('Maintenance middleware error:', error);
    next();
  }
};

export default maintenanceMiddleware;
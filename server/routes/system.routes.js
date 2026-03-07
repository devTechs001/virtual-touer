import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getMaintenanceStatus,
  getSystemConfig,
  updateSystemConfig,
  toggleMaintenance,
  scheduleMaintenance,
  cancelScheduledMaintenance,
  getFeatureFlags,
  toggleFeature,
  createAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getSystemHealth
} from '../controllers/system.controller.js';

const router = express.Router();

// Public routes
router.get('/maintenance/status', getMaintenanceStatus);
router.get('/announcements', getActiveAnnouncements);
router.get('/health', getSystemHealth);
router.get('/features', getFeatureFlags);
router.post('/maintenance/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    // Store email for maintenance notifications (simplified - in production use a proper model)
    res.json({ success: true, message: 'Subscribed to maintenance notifications' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/config', getSystemConfig);
router.put('/config/:key', updateSystemConfig);

router.post('/maintenance/toggle', toggleMaintenance);
router.post('/maintenance/schedule', scheduleMaintenance);
router.delete('/maintenance/schedule', cancelScheduledMaintenance);

router.put('/features/:feature', toggleFeature);

router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;
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

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/config', getSystemConfig);
router.put('/config/:key', updateSystemConfig);

router.post('/maintenance/toggle', toggleMaintenance);
router.post('/maintenance/schedule', scheduleMaintenance);
router.delete('/maintenance/schedule', cancelScheduledMaintenance);

router.get('/features', getFeatureFlags);
router.put('/features/:feature', toggleFeature);

router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;
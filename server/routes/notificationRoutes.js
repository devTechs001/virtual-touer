import express from 'express';
import { protect } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

// Get notifications
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const result = await notificationService.getNotifications(req.user.id, {
    page: Number(page),
    limit: Number(limit),
    unreadOnly: unreadOnly === 'true'
  });
  res.json({ success: true, ...result });
}));

// Mark as read
router.put('/:id/read', asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);
  res.json({ success: true, notification });
}));

// Mark all as read
router.put('/read-all', asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json({ success: true, message: 'All notifications marked as read' });
}));

// Subscribe to push notifications
router.post('/subscribe', asyncHandler(async (req, res) => {
  const { subscription } = req.body;
  await User.findByIdAndUpdate(req.user.id, { pushSubscription: subscription });
  res.json({ success: true, message: 'Subscribed to push notifications' });
}));

export default router;
import express from 'express';
import { protect } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

// Get notifications
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const query = { user: req.user.id };
  if (unreadOnly === 'true') query.read = false;

  const notifications = await Notification.find(query)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Mark as read
router.put('/:id/read', asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true, readAt: new Date() },
    { new: true }
  );
  res.json({ success: true, notification });
}));

// Mark all as read
router.put('/read-all', asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, read: false },
    { read: true, readAt: new Date() }
  );
  res.json({ success: true, message: 'All notifications marked as read' });
}));

// Delete notification
router.delete('/:id', asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ success: true, message: 'Notification deleted' });
}));

export default router;
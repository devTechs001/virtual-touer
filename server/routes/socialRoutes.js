import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowing,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  shareTour,
  getShareStats,
  getFeed
} from '../controllers/social.controller.js';

const router = express.Router();

// Follow routes
router.post('/follow/:userId', protect, followUser);
router.delete('/follow/:userId', protect, unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/follow/check/:userId', protect, checkFollowing);

// Comment routes
router.get('/comments/:tourId', optionalAuth, getComments);
router.post('/comments/:tourId', protect, addComment);
router.put('/comments/:commentId', protect, updateComment);
router.delete('/comments/:commentId', protect, deleteComment);
router.post('/comments/:commentId/like', protect, likeComment);

// Share routes
router.post('/share/:tourId', protect, shareTour);
router.get('/share/:tourId/stats', getShareStats);

// Feed
router.get('/feed', protect, getFeed);

export default router;
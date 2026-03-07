import express from 'express';
import {
  getTours,
  getTour,
  getFeaturedTours,
  getPopularTours,
  searchTours,
  getToursByDestination,
  createTour,
  updateTour,
  deleteTour,
  addReview
} from '../controllers/tourController.js';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  shareTour,
  getShareStats
} from '../controllers/socialControllers.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateTour, validateReview } from '../middleware/validatiors.js';

const router = express.Router();

router.get('/', getTours);
router.get('/featured', getFeaturedTours);
router.get('/popular', getPopularTours);
router.get('/search', searchTours);
router.get('/destination/:destinationId', getToursByDestination);
router.get('/:id', getTour);

router.post('/', protect, authorize('admin', 'guide'), validateTour, createTour);
router.put('/:id', protect, authorize('admin', 'guide'), validateTour, updateTour);
router.delete('/:id', protect, authorize('admin'), deleteTour);

router.post('/:id/reviews', protect, validateReview, addReview);

// Share and comment routes
router.post('/:id/share', protect, shareTour);
router.get('/:id/share/stats', getShareStats);
router.get('/:id/comments', optionalAuth, getComments);
router.post('/:id/comments', protect, addComment);
router.put('/:id/comments/:commentId', protect, updateComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
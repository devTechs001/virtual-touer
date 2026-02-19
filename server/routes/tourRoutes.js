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
} from '../controllers/tour.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateTour, validateReview } from '../middleware/validators.js';

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

export default router;
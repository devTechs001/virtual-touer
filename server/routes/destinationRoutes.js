import express from 'express';
import {
  getDestinations,
  getDestination,
  getFeaturedDestinations,
  getPopularDestinations,
  searchDestinations,
  createDestination,
  updateDestination,
  deleteDestination
} from '../controllers/destination.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/popular', getPopularDestinations);
router.get('/search', searchDestinations);
router.get('/:id', getDestination);

router.post('/', protect, authorize('admin'), createDestination);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

export default router;
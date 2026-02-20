import express from 'express';
import {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.get('/:id', getReview);

router.use(protect);

router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);

export default router;
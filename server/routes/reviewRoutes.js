import express from 'express';
import {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.get('/:id', getReview);

router.use(protect);

router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/report', reportReview);

export default router;
import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import recommendationService from '../services/recommendationService.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Get personalized recommendations
router.get('/personal', protect, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const recommendations = await recommendationService.getRecommendations(
    req.user.id,
    Number(limit)
  );
  res.json({ success: true, tours: recommendations });
}));

// Get similar tours
router.get('/similar/:tourId', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const tours = await recommendationService.getSimilarTours(
    req.params.tourId,
    Number(limit)
  );
  res.json({ success: true, tours });
}));

// Get trending tours
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const tours = await recommendationService.getTrendingTours(Number(limit));
  res.json({ success: true, tours });
}));

export default router;
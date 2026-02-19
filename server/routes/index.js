import express from 'express';
import authRoutes from './authRoutes.js';
import tourRoutes from './tourRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

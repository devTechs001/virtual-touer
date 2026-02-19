import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getPaymentIntent,
  confirmPayment,
  webhookHandler
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook needs raw body, so it's handled separately
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

router.use(protect);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/payment-intent', getPaymentIntent);
router.post('/:id/confirm', confirmPayment);

export default router;
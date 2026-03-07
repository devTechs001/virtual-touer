import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createCheckoutSession,
  handlePaymentSuccess,
  createPaymentIntent,
  processRefund,
  stripeWebhook,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getPaymentStatus
} from '../controllers/payment.js';

const router = express.Router();

// Webhook needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Public routes
router.post('/:bookingId/payment-intent', createPaymentIntent);
router.get('/:paymentId/status', getPaymentStatus);

// Protected routes
router.use(protect);

router.post('/create-checkout-session', createCheckoutSession);
router.get('/success', handlePaymentSuccess);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/refund', processRefund);
router.post('/confirm', createPaymentIntent);

// Payment methods
router.get('/methods', getPaymentMethods);
router.post('/methods', addPaymentMethod);
router.delete('/methods/:methodId', removePaymentMethod);

export default router;
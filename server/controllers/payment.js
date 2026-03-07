import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create checkout session
// @route   POST /api/payments/create-checkout-session
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { tourId, date, participants } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  if (tour.price === 0) {
    throw new ApiError('This tour is free', 400);
  }

  // Create or get Stripe customer
  let stripeCustomerId = req.user.stripeCustomerId;
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
      metadata: {
        userId: req.user.id
      }
    });
    stripeCustomerId = customer.id;
    
    await User.findByIdAndUpdate(req.user.id, { stripeCustomerId });
  }

  // Create booking (pending)
  const booking = await Booking.create({
    user: req.user.id,
    tour: tourId,
    date,
    participants,
    totalPrice: tour.price * participants,
    status: 'pending',
    paymentStatus: 'pending'
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/booking/cancelled?booking_id=${booking._id}`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: tour.title,
            description: `Virtual Tour - ${participants} participant(s)`,
            images: tour.images?.slice(0, 1).map(img => img.url) || []
          },
          unit_amount: Math.round(tour.price * 100) // Stripe expects cents
        },
        quantity: participants
      }
    ],
    metadata: {
      bookingId: booking._id.toString(),
      tourId: tour._id.toString(),
      userId: req.user.id
    },
    customer_email: req.user.email,
    billing_address_collection: 'auto',
    allow_promotion_codes: true,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60 // 30 minutes
  });

  // Save session ID to booking
  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
});

// @desc    Handle successful payment
// @route   GET /api/payments/success
export const handlePaymentSuccess = asyncHandler(async (req, res) => {
  const { session_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['payment_intent']
  });

  if (session.payment_status !== 'paid') {
    throw new ApiError('Payment not completed', 400);
  }

  const booking = await Booking.findOne({ stripeSessionId: session_id })
    .populate('tour', 'title')
    .populate('user', 'name email');

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  if (booking.status === 'confirmed') {
    return res.json({ success: true, booking });
  }

  // Update booking
  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
  booking.paymentIntentId = session.payment_intent.id;
  await booking.save();

  // Send confirmation email
  try {
    await sendEmail({
      to: booking.user.email,
      subject: 'Booking Confirmed - Virtual Tourist',
      template: 'booking-confirmation',
      data: {
        name: booking.user.name,
        tourTitle: booking.tour.title,
        confirmationCode: booking.confirmationCode,
        date: booking.date,
        participants: booking.participants,
        totalPrice: booking.totalPrice
      }
    });
  } catch (error) {
    console.error('Email send error:', error);
  }

  res.json({ success: true, booking });
});

// @desc    Create payment intent (alternative to checkout session)
// @route   POST /api/payments/create-payment-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate('tour', 'title');
  
  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  if (booking.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized', 403);
  }

  if (booking.paymentStatus === 'paid') {
    throw new ApiError('Booking already paid', 400);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: 'usd',
    customer: req.user.stripeCustomerId,
    metadata: {
      bookingId: booking._id.toString(),
      tourId: booking.tour._id.toString()
    },
    automatic_payment_methods: {
      enabled: true
    }
  });

  booking.paymentIntentId = paymentIntent.id;
  await booking.save();

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Process refund
// @route   POST /api/payments/refund
export const processRefund = asyncHandler(async (req, res) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  if (booking.paymentStatus !== 'paid') {
    throw new ApiError('Booking has not been paid', 400);
  }

  if (booking.paymentStatus === 'refunded') {
    throw new ApiError('Booking already refunded', 400);
  }

  // Check refund eligibility (e.g., 24 hours before)
  const bookingDate = new Date(booking.date);
  const now = new Date();
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

  let refundAmount = booking.totalPrice;
  let refundType = 'full';

  if (hoursUntilBooking < 24) {
    // No refund within 24 hours
    throw new ApiError('Refunds not available within 24 hours of booking', 400);
  } else if (hoursUntilBooking < 48) {
    // 50% refund within 48 hours
    refundAmount = booking.totalPrice * 0.5;
    refundType = 'partial';
  }

  // Process Stripe refund
  const refund = await stripe.refunds.create({
    payment_intent: booking.paymentIntentId,
    amount: Math.round(refundAmount * 100),
    reason: 'requested_by_customer',
    metadata: {
      bookingId: booking._id.toString(),
      refundType,
      reason
    }
  });

  // Update booking
  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  booking.cancellationReason = reason;
  booking.cancelledAt = new Date();
  booking.refundAmount = refundAmount;
  booking.refundId = refund.id;
  await booking.save();

  res.json({
    success: true,
    refund: {
      amount: refundAmount,
      type: refundType,
      id: refund.id
    }
  });
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      const booking = await Booking.findOne({ stripeSessionId: session.id });
      if (booking && booking.status === 'pending') {
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        booking.paymentIntentId = session.payment_intent;
        await booking.save();
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      
      const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
      if (booking && booking.paymentStatus !== 'paid') {
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      
      const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
      if (booking) {
        booking.status = 'pending';
        await booking.save();
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      
      const booking = await Booking.findOne({ paymentIntentId: charge.payment_intent });
      if (booking) {
        booking.paymentStatus = 'refunded';
        await booking.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
export const getPaymentMethods = asyncHandler(async (req, res) => {
  if (!req.user.stripeCustomerId) {
    return res.json({ success: true, paymentMethods: [] });
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: req.user.stripeCustomerId,
    type: 'card'
  });

  res.json({
    success: true,
    paymentMethods: paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year,
      isDefault: pm.id === req.user.defaultPaymentMethod
    }))
  });
});

// @desc    Add payment method
// @route   POST /api/payments/methods
export const addPaymentMethod = asyncHandler(async (req, res) => {
  const { paymentMethodId } = req.body;

  let stripeCustomerId = req.user.stripeCustomerId;
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name
    });
    stripeCustomerId = customer.id;
    await User.findByIdAndUpdate(req.user.id, { stripeCustomerId });
  }

  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: stripeCustomerId
  });

  // Set as default if first payment method
  const existingMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: 'card'
  });

  if (existingMethods.data.length === 1) {
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    await User.findByIdAndUpdate(req.user.id, { defaultPaymentMethod: paymentMethodId });
  }

  res.json({ success: true, message: 'Payment method added' });
});

// @desc    Remove payment method
// @route   DELETE /api/payments/methods/:methodId
export const removePaymentMethod = asyncHandler(async (req, res) => {
  const { methodId } = req.params;

  await stripe.paymentMethods.detach(methodId);

  if (req.user.defaultPaymentMethod === methodId) {
    await User.findByIdAndUpdate(req.user.id, { defaultPaymentMethod: null });
  }

  res.json({ success: true, message: 'Payment method removed' });
});

// @desc    Get payment status
// @route   GET /api/payments/:paymentId/status
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
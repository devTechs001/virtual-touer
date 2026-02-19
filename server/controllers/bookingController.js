import Stripe from 'stripe';
import Booking from '../models/Booking.model.js';
import Tour from '../models/Tour.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { tour: tourId, date, participants, specialRequests } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  const totalPrice = tour.price * participants;

  const booking = await Booking.create({
    user: req.user.id,
    tour: tourId,
    date,
    participants,
    totalPrice,
    specialRequests,
    status: totalPrice === 0 ? 'confirmed' : 'pending',
    paymentStatus: totalPrice === 0 ? 'paid' : 'pending'
  });

  await booking.populate('tour', 'title images location');

  res.status(201).json({ success: true, booking });
});

// @desc    Get user bookings
// @route   GET /api/bookings
export const getBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { user: req.user.id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('tour', 'title images location duration');

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    bookings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('tour')
    .populate('user', 'name email');

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  // Check ownership
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  res.json({ success: true, booking });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  // Check ownership
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  // Check if can be cancelled
  if (booking.status === 'cancelled') {
    throw new ApiError('Booking already cancelled', 400);
  }

  if (booking.status === 'completed') {
    throw new ApiError('Cannot cancel completed booking', 400);
  }

  // Check cancellation deadline (24 hours before)
  const bookingDate = new Date(booking.date);
  const now = new Date();
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursUntilBooking < 24) {
    throw new ApiError('Cannot cancel within 24 hours of booking', 400);
  }

  // Process refund if paid
  if (booking.paymentStatus === 'paid' && booking.paymentIntentId) {
    try {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId
      });
      booking.paymentStatus = 'refunded';
    } catch (error) {
      throw new ApiError('Refund failed. Please contact support.', 500);
    }
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason;
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({ success: true, booking });
});

// @desc    Get payment intent
// @route   POST /api/bookings/:id/payment-intent
export const getPaymentIntent = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('tour', 'title');

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
    amount: Math.round(booking.totalPrice * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      bookingId: booking._id.toString(),
      tourTitle: booking.tour.title
    }
  });

  booking.paymentIntentId = paymentIntent.id;
  await booking.save();

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Confirm payment
// @route   POST /api/bookings/:id/confirm
export const confirmPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('tour', 'title images')
    .populate('user', 'name email');

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
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

// @desc    Stripe webhook handler
// @route   POST /api/bookings/webhook
export const webhookHandler = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
      
      if (booking) {
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedBooking = await Booking.findOne({ paymentIntentId: failedPayment.id });
      
      if (failedBooking) {
        failedBooking.status = 'pending';
        failedBooking.paymentStatus = 'pending';
        await failedBooking.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
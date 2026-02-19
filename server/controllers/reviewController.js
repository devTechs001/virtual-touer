import { asyncHandler } from '../middleware/error.js';
import { Review, Tour, Booking } from '../models/index.js';

// @desc    Get all reviews for a tour
// @route   GET /api/tours/:tourId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tour: req.params.tourId })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: { reviews },
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('tour', 'name');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.status(200).json({
    success: true,
    data: { review },
  });
});

// @desc    Create review
// @route   POST /api/tours/:tourId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const tourId = req.params.tourId;

  // Check if user has booked this tour
  const hasBooking = await Booking.findOne({
    user: req.user.id,
    tour: tourId,
    status: 'completed',
  });

  if (!hasBooking) {
    res.status(403);
    throw new Error('You can only review tours you have completed');
  }

  // Check if user already reviewed this tour
  const existingReview = await Review.findOne({
    tour: tourId,
    user: req.user.id,
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this tour');
  }

  const review = await Review.create({
    tour: tourId,
    user: req.user.id,
    rating,
    title,
    comment,
    isVerifiedPurchase: true,
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review },
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: { review },
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Public
export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.helpful += 1;
  await review.save();

  res.status(200).json({
    success: true,
    data: { review },
  });
});

import Tour from '../models/Tour.model.js';
import Review from '../models/Review.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get all tours
// @route   GET /api/tours
export const getTours = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    rating,
    sort = '-createdAt',
    isVirtual,
    is360,
    country
  } = req.query;

  const query = { published: true };

  if (category) query.category = category;
  if (isVirtual) query.isVirtual = isVirtual === 'true';
  if (is360) query.is360 = is360 === 'true';
  if (country) query['location.country'] = country;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };

  const tours = await Tour.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('destination', 'name slug')
    .populate('guide', 'name avatar');

  const total = await Tour.countDocuments(query);

  res.json({
    success: true,
    tours,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single tour
// @route   GET /api/tours/:id
export const getTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)
    .populate('destination')
    .populate('guide', 'name avatar bio')
    .populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 }, limit: 10 },
      populate: { path: 'user', select: 'name avatar' }
    });

  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  // Increment view count
  tour.participants += 1;
  await tour.save();

  res.json({ success: true, tour });
});

// @desc    Get featured tours
// @route   GET /api/tours/featured
export const getFeaturedTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ featured: true, published: true })
    .sort('-rating')
    .limit(8)
    .populate('destination', 'name slug');

  res.json({ success: true, tours });
});

// @desc    Get popular tours
// @route   GET /api/tours/popular
export const getPopularTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ published: true })
    .sort('-participants -rating')
    .limit(8)
    .populate('destination', 'name slug');

  res.json({ success: true, tours });
});

// @desc    Search tours
// @route   GET /api/tours/search
export const searchTours = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q || q.length < 2) {
    return res.json({ success: true, tours: [] });
  }

  const tours = await Tour.find(
    { $text: { $search: q }, published: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(Number(limit))
    .select('title slug images location rating category');

  res.json({ success: true, tours });
});

// @desc    Get tours by destination
// @route   GET /api/tours/destination/:destinationId
export const getToursByDestination = asyncHandler(async (req, res) => {
  const tours = await Tour.find({
    destination: req.params.destinationId,
    published: true
  })
    .sort('-rating')
    .populate('guide', 'name avatar');

  res.json({ success: true, tours });
});

// @desc    Create tour
// @route   POST /api/tours
export const createTour = asyncHandler(async (req, res) => {
  req.body.guide = req.user.id;
  const tour = await Tour.create(req.body);

  res.status(201).json({ success: true, tour });
});

// @desc    Update tour
// @route   PUT /api/tours/:id
export const updateTour = asyncHandler(async (req, res) => {
  let tour = await Tour.findById(req.params.id);

  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  // Check ownership
  if (tour.guide.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to update this tour', 403);
  }

  tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, tour });
});

// @desc    Delete tour
// @route   DELETE /api/tours/:id
export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  await tour.deleteOne();

  res.json({ success: true, message: 'Tour deleted' });
});

// @desc    Add review to tour
// @route   POST /api/tours/:id/reviews
export const addReview = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({
    tour: req.params.id,
    user: req.user.id
  });

  if (existingReview) {
    throw new ApiError('You have already reviewed this tour', 400);
  }

  const review = await Review.create({
    tour: req.params.id,
    user: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment
  });

  // Update tour rating
  const reviews = await Review.find({ tour: req.params.id });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await Tour.findByIdAndUpdate(req.params.id, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  // Emit socket event
  req.app.get('io').to(`tour:${req.params.id}`).emit('new-review', {
    review: await review.populate('user', 'name avatar')
  });

  res.status(201).json({ success: true, review });
});
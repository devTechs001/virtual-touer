import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get all destinations
// @route   GET /api/destinations
export const getDestinations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, continent, country, sort = '-tourCount' } = req.query;

  const query = {};
  if (continent) query['location.continent'] = continent;
  if (country) query['location.country'] = country;

  const destinations = await Destination.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Destination.countDocuments(query);

  res.json({
    success: true,
    destinations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single destination
// @route   GET /api/destinations/:id
export const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    throw new ApiError('Destination not found', 404);
  }

  // Get tours for this destination
  const tours = await Tour.find({ destination: destination._id, published: true })
    .sort('-rating')
    .limit(12);

  res.json({
    success: true,
    destination,
    tours
  });
});

// @desc    Get featured destinations
// @route   GET /api/destinations/featured
export const getFeaturedDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ featured: true })
    .sort('-tourCount')
    .limit(6);

  res.json({ success: true, destinations });
});

// @desc    Get popular destinations
// @route   GET /api/destinations/popular
export const getPopularDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find()
    .sort('-tourCount -rating')
    .limit(10);

  res.json({ success: true, destinations });
});

// @desc    Search destinations
// @route   GET /api/destinations/search
export const searchDestinations = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || q.length < 2) {
    return res.json({ success: true, destinations: [] });
  }

  const destinations = await Destination.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(Number(limit))
    .select('name slug coverImage location tourCount');

  res.json({ success: true, destinations });
});

// @desc    Create destination
// @route   POST /api/destinations
export const createDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body);
  res.status(201).json({ success: true, destination });
});

// @desc    Update destination
// @route   PUT /api/destinations/:id
export const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!destination) {
    throw new ApiError('Destination not found', 404);
  }

  res.json({ success: true, destination });
});

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    throw new ApiError('Destination not found', 404);
  }

  // Check if destination has tours
  const tourCount = await Tour.countDocuments({ destination: destination._id });
  if (tourCount > 0) {
    throw new ApiError('Cannot delete destination with existing tours', 400);
  }

  await destination.deleteOne();
  res.json({ success: true, message: 'Destination deleted' });
});
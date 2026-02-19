import Favorite from '../models/Favorite.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get user favorites
// @route   GET /api/favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id })
    .sort('-createdAt')
    .populate({
      path: 'tour',
      select: 'title slug images location rating reviewCount duration price isVirtual is360 category',
      populate: { path: 'destination', select: 'name slug' }
    });

  res.json({ success: true, favorites });
});

// @desc    Add to favorites
// @route   POST /api/favorites
export const addFavorite = asyncHandler(async (req, res) => {
  const { tourId } = req.body;

  // Check if already favorited
  const existing = await Favorite.findOne({ user: req.user.id, tour: tourId });
  if (existing) {
    throw new ApiError('Tour already in favorites', 400);
  }

  const favorite = await Favorite.create({
    user: req.user.id,
    tour: tourId
  });

  await favorite.populate('tour', 'title images');

  res.status(201).json({ success: true, favorite });
});

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:tourId
export const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    user: req.user.id,
    tour: req.params.tourId
  });

  if (!favorite) {
    throw new ApiError('Favorite not found', 404);
  }

  res.json({ success: true, message: 'Removed from favorites' });
});

// @desc    Check if tour is favorited
// @route   GET /api/favorites/check/:tourId
export const checkFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    user: req.user.id,
    tour: req.params.tourId
  });

  res.json({ success: true, isFavorite: !!favorite });
});
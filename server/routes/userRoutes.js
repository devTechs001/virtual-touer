import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Favourite from '../models/Favourite.js';
import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/:id', protect, async (req, res) => {
  try {
    // Only allow users to update themselves
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user bookings
router.get('/:id/bookings', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const bookings = await Booking.find({ user: req.params.id }).populate('tour');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user favorites
router.get('/:id/favorites', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const favorites = await Favourite.find({ user: req.params.id }).populate('tour');
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.id }).populate('tour');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user stats
router.get('/:id/stats', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const user = await User.findById(req.params.id);
    res.json({ 
      success: true, 
      data: {
        toursCompleted: user.stats?.toursCompleted || 0,
        totalWatchTime: user.stats?.totalWatchTime || 0,
        toursViewed: user.stats?.toursViewed || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get continue watching
router.get('/continue-watching', protect, async (req, res) => {
  try {
    // Get bookings with progress < 100
    const bookings = await Booking.find({ 
      user: req.user.id,
      progress: { $lt: 100, $gt: 0 }
    }).populate('tour').limit(10);
    
    const continueWatching = bookings.map(b => ({
      _id: b._id,
      tour: b.tour,
      progress: b.progress || 0,
      lastWatched: b.updatedAt
    }));
    
    res.json({ success: true, data: continueWatching });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent activity
router.get('/activity', protect, async (req, res) => {
  try {
    const [recentBookings, recentReviews] = await Promise.all([
      Booking.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5).populate('tour'),
      Review.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5).populate('tour')
    ]);
    
    const activity = [
      ...recentBookings.map(b => ({
        _id: b._id,
        type: 'booking',
        message: `Booked ${b.tour?.title || 'a tour'}`,
        time: new Date(b.createdAt).toLocaleString()
      })),
      ...recentReviews.map(r => ({
        _id: r._id,
        type: 'review',
        message: `Reviewed ${r.tour?.title || 'a tour'}`,
        time: new Date(r.createdAt).toLocaleString()
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    
    res.json({ success: true, data: { activity } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

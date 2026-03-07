import express from 'express';
import ApiKey from '../models/ApiKey.js';
import Webhook from '../models/Webhook.js';
import AuditLog from '../models/AuditLog.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { backupCollections, restoreCollections } from '../utils/backup.js';
import crypto from 'crypto';

const router = express.Router();

// Simple admin auth placeholder (should be replaced by real auth)
function requireAdmin(req, res, next) {
  // allow if req.user && req.user.isAdmin, else 401
  if (req.user && req.user.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}

// Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalTours,
      totalBookings,
      totalRevenue,
      totalReviews,
      recentBookings,
      topTours
    ] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Review.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').populate('tour', 'title location'),
      Tour.aggregate([
        { $lookup: { from: 'bookings', localField: '_id', foreignField: 'tour', as: 'bookings' } },
        { $addFields: { bookingCount: { $size: '$bookings' } } },
        { $sort: { bookingCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, change: 5 },
        tours: { total: totalTours, change: 2 },
        bookings: { total: totalBookings, change: 10 },
        revenue: { total: revenue, change: 15 },
        reviews: { total: totalReviews, change: 3 },
        recentBookings,
        topTours,
        revenueChart: [],
        userGrowthChart: [],
        tourViewsChart: [],
        geoData: []
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Activity Feed
router.get('/activity', async (req, res) => {
  try {
    const [recentBookings, recentReviews, recentUsers] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('tour', 'title'),
      Review.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('tour', 'title'),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const activities = [
      ...recentBookings.map(b => ({
        _id: b._id,
        type: 'booking',
        message: `${b.user?.name || 'User'} booked ${b.tour?.title || 'a tour'}`,
        time: new Date(b.createdAt).toLocaleString()
      })),
      ...recentReviews.map(r => ({
        _id: r._id,
        type: 'review',
        message: `${r.user?.name || 'User'} reviewed ${r.tour?.title || 'a tour'}`,
        time: new Date(r.createdAt).toLocaleString()
      })),
      ...recentUsers.map(u => ({
        _id: u._id,
        type: 'user',
        message: `${u.name} joined`,
        time: new Date(u.createdAt).toLocaleString()
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Admin activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(50);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Tours management
router.get('/tours', async (req, res) => {
  try {
    const tours = await Tour.find().populate('destination').limit(50);
    res.json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('destination');
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/tours', async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/tours/:id', async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Bookings management
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('tour').limit(50);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Reviews management
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user').populate('tour').limit(50);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Key management
router.post('/api-keys', requireAdmin, async (req, res) => {
  const { name, scopes } = req.body;
  const key = crypto.randomBytes(32).toString('hex');
  const apiKey = await ApiKey.create({ name, key, scopes: scopes || [] });
  res.json({ success: true, data: apiKey });
});

router.get('/api-keys', requireAdmin, async (req, res) => {
  const keys = await ApiKey.find().select('-__v');
  res.json({ success: true, data: keys });
});

router.delete('/api-keys/:id', requireAdmin, async (req, res) => {
  await ApiKey.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ success: true });
});

// Webhooks
router.post('/webhooks', requireAdmin, async (req, res) => {
  const { url, events } = req.body;
  const wh = await Webhook.create({ url, events });
  res.json({ success: true, data: wh });
});

router.get('/webhooks', requireAdmin, async (req, res) => {
  const hooks = await Webhook.find();
  res.json({ success: true, data: hooks });
});

// Trigger seed for destinations (Africa-focused sample)
router.post('/seed-destinations', requireAdmin, async (req, res) => {
  const items = getSeedDestinations();
  // upsert by name
  const ops = items.map(d => ({ updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true } }));
  await Destination.bulkWrite(ops);
  res.json({ success: true, seeded: items.length });
});

// Backup and restore
router.post('/backup', requireAdmin, async (req, res) => {
  const collections = req.body.collections || ['Destination', 'Tour', 'User'];
  const out = await backupCollections('./backups', collections);
  res.json({ success: true, out });
});

router.post('/restore', requireAdmin, async (req, res) => {
  const collections = req.body.collections || ['Destination', 'Tour', 'User'];
  const out = await restoreCollections('./backups', collections);
  res.json({ success: true, out });
});

// Audit logs
router.get('/audit-logs', requireAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ success: true, data: logs });
});

// Rate limiting dashboard: returns current rate-limit counts if present
router.get('/rate-stats', requireAdmin, async (req, res) => {
  // If you use a shared store, expose its metrics here. Fallback: return basic info
  res.json({ success: true, message: 'Rate limiter stats are store-specific. Implement custom store to expose metrics.' });
});

export default router;

function getSeedDestinations() {
  return [
    {
      name: 'Cape Town',
      description: 'Iconic coastal city at the foot of Table Mountain.',
      shortDescription: 'Coastal city with Table Mountain.',
      location: { type: 'Point', coordinates: [18.4241, -33.9249], city: 'Cape Town', country: 'South Africa', continent: 'Africa' },
      highlights: ['Table Mountain', 'Robben Island', 'V&A Waterfront'],
      language: 'English',
      currency: 'ZAR'
    },
    {
      name: 'Marrakech',
      description: 'Historic city with vibrant souks and palaces.',
      shortDescription: 'Red city full of markets and palaces.',
      location: { type: 'Point', coordinates: [-7.9811, 31.6295], city: 'Marrakech', country: 'Morocco', continent: 'Africa' },
      highlights: ['Jemaa el-Fnaa', 'Bahia Palace', 'Majorelle Garden'],
      language: 'Arabic',
      currency: 'MAD'
    },
    {
      name: 'Victoria Falls',
      description: 'One of the largest and most famous waterfalls in the world.',
      shortDescription: 'Spectacular waterfall on Zambezi River.',
      location: { type: 'Point', coordinates: [25.8572, -17.9243], city: 'Livingstone', country: 'Zambia/Zimbabwe', continent: 'Africa' },
      highlights: ['Falls viewing', 'Helicopter tours', 'Devil\'s Pool'],
      language: 'English',
      currency: 'ZMW' }
  ].concat(getMiscDestinations());
}

function getMiscDestinations() {
  return [
    { name: 'Easter Island', description: 'Remote island with Moai statues.', shortDescription: 'Mysterious statues and remote island.', location: { type: 'Point', coordinates: [-109.3497, -27.1127], city: 'Hanga Roa', country: 'Chile', continent: 'Oceania' }, highlights: ['Moai'], language: 'Spanish', currency: 'CLP' },
    { name: 'Socotra', description: 'Island known for otherworldly flora.', shortDescription: 'Unique landscapes and endemic species.', location: { type: 'Point', coordinates: [53.9939, 12.4634], city: 'Hadibu', country: 'Yemen', continent: 'Asia' }, highlights: ['Dragon\'s Blood Tree'], language: 'Arabic', currency: 'YER' }
  ];
}

import express from 'express';
import ApiKey from '../models/ApiKey.js';
import Webhook from '../models/Webhook.js';
import AuditLog from '../models/AuditLog.js';
import Destination from '../models/Destination.js';
import { backupCollections, restoreCollections } from '../utils/backup.js';
import crypto from 'crypto';

const router = express.Router();

// Simple admin auth placeholder (should be replaced by real auth)
function requireAdmin(req, res, next) {
  // allow if req.user && req.user.isAdmin, else 401
  if (req.user && req.user.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}

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

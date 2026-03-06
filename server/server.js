import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Database import
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import favoriteRoutes from './routes/favouriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import systemRoutes from './routes/system.routes.js';
import logsRoutes from './routes/logs.routes.js';
import socialRoutes from './routes/socialRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/payment.js';

// Middleware imports
import { errorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import auditLogger from './middleware/auditLogger.js';
import adminRoutes from './routes/adminRoutes.js';

// (connectDB will be called after httpServer is created further down)

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // More requests in dev
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many requests, please try again later.',
    retryAfter: Math.ceil((15 * 60 * 1000) / 1000) // seconds
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    if (req.path === '/health') return true;
    // Skip for localhost in development
    if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') return true;
    return false;
  }
});

// API-specific rate limits
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 500 : 50,
  message: { message: 'Too many API requests, please slow down.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Strict limit for auth
  message: { message: 'Too many authentication attempts.' }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', limiter);

// Apply stricter limits to auth endpoints
app.use('/api/auth', authLimiter);

// Apply API limiter to data endpoints
app.use('/api/tours', apiLimiter);
app.use('/api/destinations', apiLimiter);

// Audit logger (non-blocking) - logs important requests
app.use(auditLogger);

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
// Admin endpoints for backups, api-keys, webhooks, audit logs, seeding
app.use('/api/admin', adminRoutes);

// Health check (skip rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-tour', (tourId) => {
    socket.join(`tour:${tourId}`);
    console.log(`User ${socket.id} joined tour:${tourId}`);
  });

  socket.on('leave-tour', (tourId) => {
    socket.leave(`tour:${tourId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 5000;

// Connect to DB (uses imported connectDB from ./config/db.js) and then start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB before starting server:', err);
  process.exit(1);
});

export default app;
// Test fixtures - reusable test data factories

import {
  mockTours,
  mockUser,
  mockAdminUser,
  mockDestinations,
  mockBookings,
  mockReviews,
  mockAchievements,
  mockDashboardStats,
  mockChartData,
  mockActivities
} from '../mocks/data';

// Tour fixtures
export const createTourFixture = (overrides = {}) => ({
  _id: `tour-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Tour',
  description: 'A test tour for testing purposes',
  shortDescription: 'Test tour description',
  images: [{ url: 'https://example.com/test.jpg', caption: 'Test', isPrimary: true }],
  location: {
    city: 'Test City',
    country: 'Test Country',
    continent: 'Test Continent',
    coordinates: [0, 0]
  },
  category: 'cultural',
  duration: '30 minutes',
  price: 29,
  rating: 4.5,
  reviewCount: 10,
  participants: 100,
  isVirtual: true,
  is360: true,
  hasAR: false,
  isLive: false,
  featured: false,
  published: true,
  difficulty: 'easy',
  languages: ['en'],
  tags: ['test'],
  ...overrides
});

// User fixtures
export const createUserFixture = (overrides = {}) => ({
  id: `user-${Date.now()}`,
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  avatar: null,
  bio: null,
  role: 'user',
  isVerified: true,
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: true
  },
  stats: {
    toursCompleted: 0,
    totalWatchTime: 0,
    countriesVisited: 0
  },
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createAdminUserFixture = (overrides = {}) => ({
  ...createUserFixture({
    role: 'admin',
    name: 'Test Admin',
    email: `admin-${Date.now()}@example.com`
  }),
  ...overrides
});

// Destination fixtures
export const createDestinationFixture = (overrides = {}) => ({
  _id: `dest-${Date.now()}`,
  name: 'Test Destination',
  country: 'Test Country',
  continent: 'Test Continent',
  description: 'A test destination',
  shortDescription: 'Test destination description',
  images: [{ url: 'https://example.com/test-dest.jpg', caption: 'Test' }],
  location: {
    type: 'Point',
    coordinates: [0, 0],
    city: 'Test City',
    country: 'Test Country',
    continent: 'Test Continent'
  },
  featured: false,
  tourCount: 0,
  ...overrides
});

// Booking fixtures
export const createBookingFixture = (overrides = {}) => ({
  _id: `booking-${Date.now()}`,
  tour: createTourFixture(),
  user: createUserFixture(),
  status: 'pending',
  paymentStatus: 'pending',
  amount: 29,
  confirmationCode: `VT${Date.now()}`,
  date: new Date().toISOString(),
  participants: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Review fixtures
export const createReviewFixture = (overrides = {}) => ({
  _id: `review-${Date.now()}`,
  tour: 'tour-id',
  user: {
    id: 'user-id',
    name: 'Test Reviewer',
    avatar: null
  },
  rating: 5,
  comment: 'Great experience!',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Form data fixtures
export const createLoginFormFixture = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'password123',
  ...overrides
});

export const createRegisterFormFixture = (overrides = {}) => ({
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  confirmPassword: 'password123',
  ...overrides
});

export const createTourFormFixture = (overrides = {}) => ({
  title: 'New Test Tour',
  description: 'A new test tour description',
  shortDescription: 'New test tour',
  category: 'cultural',
  duration: '45 minutes',
  price: 49,
  location: {
    city: 'Test City',
    country: 'Test Country',
    address: '123 Test St'
  },
  tags: ['test', 'new'],
  languages: ['en'],
  difficulty: 'easy',
  isVirtual: true,
  is360: true,
  featured: false,
  published: true,
  ...overrides
});

// API response fixtures
export const createSuccessResponseFixture = (data = {}) => ({
  success: true,
  ...data
});

export const createErrorResponseFixture = (message = 'An error occurred', status = 400) => ({
  success: false,
  message,
  status
});

export const createPaginationResponseFixture = (items = [], page = 1, limit = 10) => ({
  success: true,
  [Array.isArray(items) ? 'items' : 'data']: items,
  pagination: {
    page,
    limit,
    total: items.length,
    pages: Math.ceil(items.length / limit)
  }
});

// Pre-built fixture collections
export const fixtures = {
  tours: {
    single: mockTours[0],
    list: mockTours,
    create: createTourFixture
  },
  users: {
    regular: mockUser,
    admin: mockAdminUser,
    create: createUserFixture,
    createAdmin: createAdminUserFixture
  },
  destinations: {
    single: mockDestinations[0],
    list: mockDestinations,
    create: createDestinationFixture
  },
  bookings: {
    single: mockBookings[0],
    list: mockBookings,
    create: createBookingFixture
  },
  reviews: {
    single: mockReviews[0],
    list: mockReviews,
    create: createReviewFixture
  },
  achievements: mockAchievements,
  stats: mockDashboardStats,
  charts: mockChartData,
  activities: mockActivities
};

export default fixtures;

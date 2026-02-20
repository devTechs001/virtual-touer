// Centralized mock data for tests

export const mockTours = [
  {
    _id: 'tour-1',
    title: 'Paris: Eiffel Tower Experience',
    description: 'Experience the magic of Paris from the iconic Eiffel Tower',
    shortDescription: 'Iconic Eiffel Tower tour with breathtaking views',
    images: [
      { url: 'https://example.com/paris-1.jpg', caption: 'Eiffel Tower', isPrimary: true },
      { url: 'https://example.com/paris-2.jpg', caption: 'Paris Skyline' }
    ],
    location: {
      city: 'Paris',
      country: 'France',
      continent: 'Europe',
      coordinates: [2.2945, 48.8584]
    },
    category: 'cultural',
    duration: '45 minutes',
    price: 49,
    rating: 4.8,
    reviewCount: 234,
    participants: 15420,
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    difficulty: 'easy',
    languages: ['en', 'fr'],
    tags: ['paris', 'france', 'eiffel tower', 'landmark']
  },
  {
    _id: 'tour-2',
    title: 'Tokyo: Shibuya Street Culture',
    description: 'Explore Tokyo\'s vibrant streets and modern culture',
    shortDescription: 'Dynamic Tokyo street experience',
    images: [
      { url: 'https://example.com/tokyo-1.jpg', caption: 'Shibuya Crossing', isPrimary: true }
    ],
    location: {
      city: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      coordinates: [139.7016, 35.6595]
    },
    category: 'urban',
    duration: '35 minutes',
    price: 39,
    rating: 4.9,
    reviewCount: 189,
    participants: 12350,
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    difficulty: 'easy',
    languages: ['en', 'ja'],
    tags: ['tokyo', 'japan', 'shibuya', 'urban']
  },
  {
    _id: 'tour-3',
    title: 'Pyramids of Giza Virtual Tour',
    description: 'Explore the last wonder of the ancient world',
    shortDescription: 'Ancient Egyptian marvel',
    images: [
      { url: 'https://example.com/pyramids-1.jpg', caption: 'Great Pyramid', isPrimary: true }
    ],
    location: {
      city: 'Giza',
      country: 'Egypt',
      continent: 'Africa',
      coordinates: [31.1342, 29.9792]
    },
    category: 'historical',
    duration: '60 minutes',
    price: 59,
    rating: 4.9,
    reviewCount: 512,
    participants: 1890,
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    difficulty: 'easy',
    languages: ['en', 'ar'],
    tags: ['egypt', 'pyramids', 'ancient', 'wonder']
  }
];

export const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
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
    toursCompleted: 12,
    totalWatchTime: 8.5,
    countriesVisited: 7
  },
  createdAt: new Date().toISOString()
};

export const mockAdminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'devtechs842@gmail.com',
  avatar: null,
  bio: null,
  role: 'admin',
  isVerified: true,
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: true
  },
  stats: {},
  createdAt: new Date().toISOString()
};

export const mockDestinations = [
  {
    _id: 'dest-1',
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    description: 'The City of Light awaits with iconic landmarks',
    shortDescription: 'Iconic landmarks and world-class museums',
    images: [
      { url: 'https://example.com/paris-dest.jpg', caption: 'Paris' }
    ],
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566],
      city: 'Paris',
      country: 'France',
      continent: 'Europe'
    },
    featured: true,
    tourCount: 12
  },
  {
    _id: 'dest-2',
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    description: 'Experience the perfect blend of ancient and modern',
    shortDescription: 'Ancient traditions meet cutting-edge technology',
    images: [
      { url: 'https://example.com/tokyo-dest.jpg', caption: 'Tokyo' }
    ],
    location: {
      type: 'Point',
      coordinates: [139.6917, 35.6895],
      city: 'Tokyo',
      country: 'Japan',
      continent: 'Asia'
    },
    featured: true,
    tourCount: 8
  },
  {
    _id: 'dest-3',
    name: 'Pyramids of Giza',
    country: 'Egypt',
    continent: 'Africa',
    description: 'Stand before the last remaining wonder of the ancient world',
    shortDescription: 'The last remaining wonder of the ancient world',
    images: [
      { url: 'https://example.com/pyramids-dest.jpg', caption: 'Pyramids' }
    ],
    location: {
      type: 'Point',
      coordinates: [31.1342, 29.9792],
      city: 'Giza',
      country: 'Egypt',
      continent: 'Africa'
    },
    featured: true,
    tourCount: 5
  }
];

export const mockBookings = [
  {
    _id: 'booking-1',
    tour: mockTours[0],
    user: mockUser,
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 49,
    confirmationCode: 'VT123ABC',
    date: new Date().toISOString(),
    participants: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'booking-2',
    tour: mockTours[1],
    user: mockUser,
    status: 'pending',
    paymentStatus: 'pending',
    amount: 39,
    confirmationCode: 'VT456DEF',
    date: new Date(Date.now() + 86400000).toISOString(),
    participants: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockReviews = [
  {
    _id: 'review-1',
    tour: mockTours[0]._id,
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      avatar: null
    },
    rating: 5,
    comment: 'Amazing experience! Felt like I was really there.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'review-2',
    tour: mockTours[0]._id,
    user: {
      id: 'user-3',
      name: 'Bob Wilson',
      avatar: null
    },
    rating: 4,
    comment: 'Great tour, very informative guide.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockAchievements = {
  badges: [
    { id: 'badge-1', icon: '🌍', name: 'World Traveler', description: 'Visit 10 countries', unlocked: true, unlockedAt: new Date().toISOString() },
    { id: 'badge-2', icon: '🎯', name: 'First Tour', description: 'Complete your first tour', unlocked: true, unlockedAt: new Date().toISOString() },
    { id: 'badge-3', icon: '⭐', name: '5 Star Reviewer', description: 'Leave a 5-star review', unlocked: true, unlockedAt: new Date().toISOString() },
    { id: 'badge-4', icon: '🔥', name: '7 Day Streak', description: '7 days in a row', unlocked: false, unlockedAt: null },
    { id: 'badge-5', icon: '🏆', name: 'Tour Master', description: 'Complete 50 tours', unlocked: false, unlockedAt: null }
  ],
  stats: {
    totalPoints: 2450,
    level: 'Explorer',
    nextLevelPoints: 3000
  }
};

export const mockDashboardStats = {
  revenue: { total: 50000, change: 12.5 },
  users: { total: 1500, change: 8.3 },
  views: { total: 25000, change: 15.2 },
  bookings: { total: 450, change: 5.7 }
};

export const mockChartData = [
  { month: 'Jan', revenue: 8000, users: 1000 },
  { month: 'Feb', revenue: 9500, users: 1200 },
  { month: 'Mar', revenue: 11000, users: 1500 },
  { month: 'Apr', revenue: 10500, users: 1400 },
  { month: 'May', revenue: 12000, users: 1600 },
  { month: 'Jun', revenue: 13500, users: 1800 }
];

export const mockActivities = [
  { _id: 'act-1', type: 'booking', message: 'New booking for Paris Tour', time: '2 hours ago' },
  { _id: 'act-2', type: 'review', message: 'New 5-star review received', time: '5 hours ago' },
  { _id: 'act-3', type: 'user', message: 'New user registered', time: '1 day ago' },
  { _id: 'act-4', type: 'booking', message: 'Booking confirmed for Tokyo Tour', time: '2 days ago' }
];

export const createMockTour = (overrides = {}) => ({
  ...mockTours[0],
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides
});

export const createMockBooking = (overrides = {}) => ({
  ...mockBookings[0],
  ...overrides
});

export const createMockReview = (overrides = {}) => ({
  ...mockReviews[0],
  ...overrides
});

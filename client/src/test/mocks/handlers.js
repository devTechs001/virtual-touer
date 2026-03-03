import { http, HttpResponse } from 'msw';

const API_URL = '/api';
const FULL_API_URL = 'http://localhost:5000/api';

// Mock data
export const mockTours = [
  {
    _id: '1',
    title: 'Paris: Eiffel Tower Experience',
    description: 'Experience the magic of Paris',
    shortDescription: 'Iconic Eiffel Tower tour',
    images: [{ url: 'https://example.com/paris.jpg', isPrimary: true }],
    location: { city: 'Paris', country: 'France', coordinates: [2.2945, 48.8584] },
    category: 'cultural',
    duration: '45 minutes',
    price: 0,
    rating: 4.8,
    reviewCount: 234,
    participants: 15420,
    isVirtual: true,
    is360: true
  },
  {
    _id: '2',
    title: 'Tokyo: Shibuya Street Culture',
    description: 'Explore Tokyo\'s vibrant streets',
    shortDescription: 'Dynamic Tokyo tour',
    images: [{ url: 'https://example.com/tokyo.jpg', isPrimary: true }],
    location: { city: 'Tokyo', country: 'Japan', coordinates: [139.7016, 35.6595] },
    category: 'urban',
    duration: '35 minutes',
    price: 9.99,
    rating: 4.9,
    reviewCount: 189,
    participants: 12350,
    isVirtual: true,
    is360: true
  },
  {
    _id: '3',
    title: 'Pyramids of Giza Virtual Tour',
    description: 'Explore the last wonder of the ancient world',
    shortDescription: 'Ancient Egyptian marvel',
    images: [{ url: 'https://example.com/pyramids.jpg', isPrimary: true }],
    location: { city: 'Giza', country: 'Egypt', coordinates: [31.1342, 29.9792] },
    category: 'historical',
    duration: '60 minutes',
    price: 59,
    rating: 4.9,
    reviewCount: 512,
    participants: 1890,
    isVirtual: true,
    is360: true
  }
];

export const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  role: 'user',
  isVerified: true
};

export const mockAdminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'devtechs842@gmail.com',
  avatar: null,
  role: 'admin',
  isVerified: true
};

export const mockDestinations = [
  {
    _id: '1',
    name: 'Paris',
    description: 'The City of Light',
    coverImage: 'https://example.com/paris.jpg',
    location: { city: 'Paris', country: 'France', continent: 'europe' },
    tourCount: 12,
    featured: true
  },
  {
    _id: '2',
    name: 'Tokyo',
    description: 'Ancient traditions meet cutting-edge technology',
    coverImage: 'https://example.com/tokyo.jpg',
    location: { city: 'Tokyo', country: 'Japan', continent: 'asia' },
    tourCount: 8,
    featured: true
  },
  {
    _id: '3',
    name: 'Pyramids of Giza',
    description: 'The last remaining wonder of the ancient world',
    coverImage: 'https://example.com/pyramids.jpg',
    location: { city: 'Giza', country: 'Egypt', continent: 'africa' },
    tourCount: 5,
    featured: true
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
    createdAt: new Date().toISOString()
  }
];

export const mockReviews = [
  {
    _id: 'review-1',
    tour: mockTours[0]._id,
    user: mockUser,
    rating: 5,
    comment: 'Amazing experience!',
    createdAt: new Date().toISOString()
  }
];

// Handlers
export const handlers = [
  // Auth
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'john@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token',
        user: mockUser
      });
    }
    if (body.email === 'devtechs842@gmail.com' && body.password === 'Admin123!') {
      return HttpResponse.json({
        success: true,
        token: 'mock-admin-jwt-token',
        user: mockAdminUser
      });
    }
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      user: { ...mockUser, name: body.name, email: body.email }
    });
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({ success: true, user: mockUser });
  }),

  http.put(`${API_URL}/auth/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      user: { ...mockUser, ...body }
    });
  }),

  // Tours
  http.get(`${API_URL}/tours`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const search = url.searchParams.get('search');
    
    let tours = mockTours;
    
    if (category && category !== 'all') {
      tours = tours.filter(t => t.category === category);
    }
    
    if (featured === 'true') {
      tours = tours.filter(t => t.featured);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      tours = tours.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.location.country.toLowerCase().includes(searchLower)
      );
    }

    return HttpResponse.json({
      success: true,
      tours,
      pagination: { page: 1, limit: 12, total: tours.length, pages: 1 }
    });
  }),

  http.get(`${API_URL}/tours/featured`, () => {
    return HttpResponse.json({ success: true, tours: mockTours.filter(t => t.featured) });
  }),

  http.get(`${API_URL}/tours/popular`, () => {
    return HttpResponse.json({ success: true, tours: mockTours });
  }),

  http.get(`${API_URL}/tours/:id`, ({ params }) => {
    const tour = mockTours.find(t => t._id === params.id);
    if (!tour) {
      return HttpResponse.json(
        { success: false, message: 'Tour not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, tour });
  }),

  http.get(`${API_URL}/tours/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    
    const tours = mockTours.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.location.country.toLowerCase().includes(query)
    );

    return HttpResponse.json({ success: true, tours });
  }),

  http.post(`${API_URL}/tours`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      tour: {
        _id: 'new-tour-id',
        ...body,
        rating: 0,
        reviewCount: 0,
        participants: 0
      }
    }, { status: 201 });
  }),

  http.put(`${API_URL}/tours/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      tour: {
        ...mockTours[0],
        ...body
      }
    });
  }),

  http.delete(`${API_URL}/tours/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Tour deleted' });
  }),

  // Destinations
  http.get(`${API_URL}/destinations`, () => {
    return HttpResponse.json({
      success: true,
      destinations: mockDestinations,
      pagination: { page: 1, limit: 20, total: mockDestinations.length, pages: 1 }
    });
  }),

  http.get(`${API_URL}/destinations/featured`, () => {
    return HttpResponse.json({ success: true, destinations: mockDestinations.filter(d => d.featured) });
  }),

  http.get(`${API_URL}/destinations/:id`, ({ params }) => {
    const destination = mockDestinations.find(d => d._id === params.id);
    if (!destination) {
      return HttpResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, destination });
  }),

  // Favorites
  http.get(`${API_URL}/favorites`, () => {
    return HttpResponse.json({ success: true, favorites: [] });
  }),

  http.get(`${API_URL}/favorites/check/:tourId`, () => {
    return HttpResponse.json({ success: true, isFavorite: false });
  }),

  http.post(`${API_URL}/favorites`, () => {
    return HttpResponse.json({ success: true, message: 'Added to favorites' });
  }),

  http.delete(`${API_URL}/favorites/:tourId`, () => {
    return HttpResponse.json({ success: true, message: 'Removed from favorites' });
  }),

  // Bookings
  http.get(`${API_URL}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let bookings = mockBookings;
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    return HttpResponse.json({
      success: true,
      bookings,
      pagination: { page: 1, limit: 10, total: bookings.length, pages: 1 }
    });
  }),

  http.get(`${API_URL}/bookings/:id`, ({ params }) => {
    const booking = mockBookings.find(b => b._id === params.id);
    if (!booking) {
      return HttpResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, booking });
  }),

  http.post(`${API_URL}/bookings`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      booking: {
        _id: 'booking-1',
        ...body,
        confirmationCode: 'VT123ABC',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  }),

  http.put(`${API_URL}/bookings/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      booking: {
        ...mockBookings[0],
        ...body
      }
    });
  }),

  http.delete(`${API_URL}/bookings/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Booking cancelled' });
  }),

  // Reviews
  http.get(`${API_URL}/tours/:tourId/reviews`, ({ params }) => {
    const reviews = mockReviews.filter(r => r.tour === params.tourId);
    return HttpResponse.json({
      success: true,
      reviews,
      pagination: { page: 1, limit: 10, total: reviews.length, pages: 1 }
    });
  }),

  http.post(`${API_URL}/tours/:id/reviews`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      review: {
        _id: 'review-1',
        ...body,
        user: mockUser,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  }),

  http.delete(`${API_URL}/reviews/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Review deleted' });
  }),

  // Admin endpoints
  http.get(`${API_URL}/admin/stats`, () => {
    return HttpResponse.json({
      success: true,
      stats: {
        revenue: { total: 50000, change: 12.5 },
        users: { total: 1500, change: 8.3 },
        views: { total: 25000, change: 15.2 },
        bookings: { total: 450, change: 5.7 },
        revenueChart: [
          { month: 'Jan', revenue: 8000 },
          { month: 'Feb', revenue: 9500 },
          { month: 'Mar', revenue: 11000 }
        ],
        userGrowthChart: [
          { month: 'Jan', users: 1000 },
          { month: 'Feb', users: 1200 },
          { month: 'Mar', users: 1500 }
        ]
      }
    });
  }),

  http.get(`${API_URL}/admin/activity`, () => {
    return HttpResponse.json({
      success: true,
      activities: [
        { _id: '1', type: 'booking', message: 'New booking received', time: '2 hours ago' },
        { _id: '2', type: 'review', message: 'New review posted', time: '5 hours ago' },
        { _id: '3', type: 'user', message: 'New user registered', time: '1 day ago' }
      ]
    });
  }),

  http.get(`${API_URL}/admin/users`, () => {
    return HttpResponse.json({
      success: true,
      users: [mockUser, mockAdminUser],
      pagination: { page: 1, limit: 20, total: 2, pages: 1 }
    });
  }),

  http.get(`${API_URL}/admin/tours`, () => {
    return HttpResponse.json({
      success: true,
      tours: mockTours,
      pagination: { page: 1, limit: 20, total: mockTours.length, pages: 1 }
    });
  }),

  http.get(`${API_URL}/admin/bookings`, () => {
    return HttpResponse.json({
      success: true,
      bookings: mockBookings,
      pagination: { page: 1, limit: 20, total: mockBookings.length, pages: 1 }
    });
  }),

  http.get(`${API_URL}/admin/reviews`, () => {
    return HttpResponse.json({
      success: true,
      reviews: mockReviews,
      pagination: { page: 1, limit: 20, total: mockReviews.length, pages: 1 }
    });
  }),

  // User dashboard
  http.get(`${API_URL}/users/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      dashboard: {
        stats: {
          toursCompleted: 12,
          totalWatchTime: 8.5,
          countriesVisited: 7,
          currentStreak: 5,
          totalPoints: 2450,
          level: 'Explorer'
        },
        continueWatching: [],
        featuredTours: mockTours,
        newDestinations: mockDestinations,
        recentActivity: []
      }
    });
  }),

  http.get(`${API_URL}/users/achievements`, () => {
    return HttpResponse.json({
      success: true,
      achievements: {
        badges: [
          { icon: '🌍', name: 'World Traveler', unlocked: true },
          { icon: '🎯', name: 'First Tour', unlocked: true },
          { icon: '⭐', name: '5 Star Reviewer', unlocked: true }
        ]
      }
    });
  }),

  http.get(`${API_URL}/users/recommendations`, () => {
    return HttpResponse.json({
      success: true,
      recommendations: {
        tours: mockTours
      }
    });
  }),

  // Upload
  http.post(`${API_URL}/upload/image`, () => {
    return HttpResponse.json({
      success: true,
      image: {
        url: 'https://example.com/uploaded-image.jpg',
        publicId: 'upload-123'
      }
    });
  })
];

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Tour, Booking, Review } from './models/index.js';

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@virtualtourist.com',
    password: 'Admin123!',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
  },
];

const tours = [
  {
    name: 'Eiffel Tower Experience',
    description: 'Experience the iconic Eiffel Tower like never before with our immersive virtual tour.',
    longDescription: 'Join us for an unforgettable journey to the top of the world\'s most visited monument.',
    location: 'Paris, France',
    country: 'France',
    coordinates: { latitude: 48.8584, longitude: 2.2945 },
    category: 'Historical',
    price: 49,
    duration: '2 hours',
    groupSize: 10,
    images: [
      { url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800', alt: 'Eiffel Tower', isPrimary: true },
    ],
    highlights: ['Skip-the-line virtual access', 'Professional guide', '360° panoramic views'],
    includes: ['VR headset support', 'Live guide narration', 'Digital souvenir photos'],
    featured: true,
    available: true,
    rating: 4.8,
    numReviews: 256,
  },
  {
    name: 'Grand Canyon Adventure',
    description: 'Explore the breathtaking Grand Canyon with our immersive virtual tour.',
    longDescription: 'Experience one of the natural wonders of the world from the comfort of your home.',
    location: 'Arizona, USA',
    country: 'United States',
    coordinates: { latitude: 36.1069, longitude: -112.1129 },
    category: 'Nature',
    price: 79,
    duration: '3 hours',
    groupSize: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800', alt: 'Grand Canyon', isPrimary: true },
    ],
    highlights: ['Sunrise and sunset views', 'Geological commentary', 'Wildlife spotting'],
    includes: ['Professional guide', 'Photo opportunities', 'Educational content'],
    featured: true,
    available: true,
    rating: 4.9,
    numReviews: 189,
  },
  {
    name: 'Tokyo Street Walk',
    description: 'Walk through the vibrant streets of Tokyo with our virtual guide.',
    longDescription: 'Experience the unique blend of traditional and modern Tokyo.',
    location: 'Tokyo, Japan',
    country: 'Japan',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    category: 'City',
    price: 39,
    duration: '1.5 hours',
    groupSize: 12,
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', alt: 'Tokyo Street', isPrimary: true },
    ],
    highlights: ['Shibuya Crossing', 'Traditional temples', 'Local food spots'],
    includes: ['Local guide', 'Cultural insights', 'Food recommendations'],
    featured: false,
    available: true,
    rating: 4.7,
    numReviews: 312,
  },
  {
    name: 'Great Wall of China',
    description: 'Walk along the ancient Great Wall of China.',
    longDescription: 'Discover one of the most impressive architectural feats in human history.',
    location: 'Beijing, China',
    country: 'China',
    coordinates: { latitude: 40.4319, longitude: 116.5704 },
    category: 'Historical',
    price: 59,
    duration: '4 hours',
    groupSize: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', alt: 'Great Wall', isPrimary: true },
    ],
    highlights: ['Mutianyu section', 'Historical commentary', 'Panoramic views'],
    includes: ['Expert guide', 'Historical context', 'Photo stops'],
    featured: true,
    available: true,
    rating: 4.9,
    numReviews: 423,
  },
  {
    name: 'Santorini Sunset',
    description: 'Watch the famous Santorini sunset with our virtual tour.',
    longDescription: 'Experience the magical sunset views that Santorini is famous for.',
    location: 'Santorini, Greece',
    country: 'Greece',
    coordinates: { latitude: 36.3932, longitude: 25.4615 },
    category: 'Relaxation',
    price: 69,
    duration: '2.5 hours',
    groupSize: 10,
    images: [
      { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', alt: 'Santorini', isPrimary: true },
    ],
    highlights: ['Oia sunset', 'White-washed buildings', 'Aegean Sea views'],
    includes: ['Sunset viewing', 'Photography tips', 'Local wine tasting info'],
    featured: true,
    available: true,
    rating: 4.9,
    numReviews: 289,
  },
];

// Seed function
const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Tour.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create tours
    const createdTours = await Tour.create(tours);
    console.log(`Created ${createdTours.length} tours`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test accounts:');
    console.log('  Admin: admin@virtualtourist.com / Admin123!');
    console.log('  User: john@example.com / User123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

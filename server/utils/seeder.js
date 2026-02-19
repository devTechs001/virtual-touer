import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Destination from '../models/Destination.js';

dotenv.config();

const destinations = [
  {
    name: 'Paris',
    description: 'The City of Light, known for its iconic Eiffel Tower, world-class museums, and romantic atmosphere.',
    shortDescription: 'Experience the magic of the City of Light',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    location: {
      coordinates: [2.3522, 48.8566],
      city: 'Paris',
      country: 'France',
      continent: 'europe'
    },
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
    featured: true,
    tourCount: 12
  },
  {
    name: 'Tokyo',
    description: 'A fascinating blend of traditional culture and cutting-edge technology, Tokyo offers endless exploration.',
    shortDescription: 'Where tradition meets innovation',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    location: {
      coordinates: [139.6917, 35.6895],
      city: 'Tokyo',
      country: 'Japan',
      continent: 'asia'
    },
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower', 'Tsukiji Market'],
    featured: true,
    tourCount: 15
  },
  {
    name: 'New York City',
    description: 'The Big Apple - a global hub of culture, art, fashion, and entertainment.',
    shortDescription: 'The city that never sleeps',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
    location: {
      coordinates: [-74.006, 40.7128],
      city: 'New York',
      country: 'United States',
      continent: 'north-america'
    },
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    featured: true,
    tourCount: 20
  },
  {
    name: 'Rome',
    description: 'The Eternal City, where ancient history comes alive at every corner.',
    shortDescription: 'Walk through 2,000 years of history',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
    location: {
      coordinates: [12.4964, 41.9028],
      city: 'Rome',
      country: 'Italy',
      continent: 'europe'
    },
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon'],
    featured: true,
    tourCount: 18
  },
  {
    name: 'Bali',
    description: 'A tropical paradise known for its beaches, temples, and lush rice terraces.',
    shortDescription: 'Island of the Gods',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    location: {
      coordinates: [115.1889, -8.4095],
      city: 'Bali',
      country: 'Indonesia',
      continent: 'asia'
    },
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    featured: true,
    tourCount: 10
  }
];

const tours = [
  {
    title: 'Paris: Eiffel Tower & Seine River Experience',
    description: 'Experience the magic of Paris with this immersive virtual tour. Start at the base of the iconic Eiffel Tower and ascend to the top for breathtaking 360° views of the City of Light. Then, take a virtual cruise along the Seine River, passing historic bridges and landmarks.',
    shortDescription: 'Iconic views from the Eiffel Tower and a romantic Seine cruise',
    images: [
      { url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200' }
    ],
    location: {
      coordinates: [2.2945, 48.8584],
      address: 'Champ de Mars, 5 Avenue Anatole France',
      city: 'Paris',
      country: 'France',
      continent: 'europe'
    },
    category: 'cultural',
    tags: ['Iconic Landmark', 'City Views', 'River Cruise', 'Romantic'],
    duration: '45 minutes',
    price: 0,
    isVirtual: true,
    is360: true,
    featured: true,
    rating: 4.8,
    reviewCount: 234,
    participants: 15420
  },
  {
    title: 'Tokyo: Shibuya & Harajuku Street Culture',
    description: 'Dive into the vibrant street culture of Tokyo. Walk through the famous Shibuya Crossing, explore the colorful shops of Harajuku, and discover hidden gems in the backstreets of these iconic neighborhoods.',
    shortDescription: 'Explore Tokyo\'s most dynamic neighborhoods',
    images: [
      { url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=1200' }
    ],
    location: {
      coordinates: [139.7016, 35.6595],
      address: 'Shibuya Crossing',
      city: 'Tokyo',
      country: 'Japan',
      continent: 'asia'
    },
    category: 'urban',
    tags: ['Street Culture', 'Shopping', 'Youth Culture', 'Food'],
    duration: '35 minutes',
    price: 9.99,
    isVirtual: true,
    is360: true,
    featured: true,
    rating: 4.9,
    reviewCount: 189,
    participants: 12350
  },
  {
    title: 'Rome: Colosseum & Ancient Forum',
    description: 'Step back in time to ancient Rome. Explore the magnificent Colosseum, walk through the Roman Forum, and discover the stories of gladiators and emperors that shaped Western civilization.',
    shortDescription: 'Journey through the heart of ancient Rome',
    images: [
      { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=1200' }
    ],
    location: {
      coordinates: [12.4922, 41.8902],
      address: 'Piazza del Colosseo',
      city: 'Rome',
      country: 'Italy',
      continent: 'europe'
    },
    category: 'historical',
    tags: ['Ancient History', 'Architecture', 'UNESCO Site', 'Archaeology'],
    duration: '50 minutes',
    price: 14.99,
    isVirtual: true,
    is360: true,
    featured: true,
    rating: 4.7,
    reviewCount: 312,
    participants: 18930
  },
  {
    title: 'Bali: Temple & Rice Terrace Spiritual Journey',
    description: 'Experience the spiritual side of Bali. Visit ancient temples, walk through emerald rice terraces, and discover the island\'s rich Hindu heritage and traditional Balinese culture.',
    shortDescription: 'Discover the spiritual heart of Bali',
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200' }
    ],
    location: {
      coordinates: [115.2625, -8.4333],
      address: 'Tegallalang Rice Terrace',
      city: 'Ubud, Bali',
      country: 'Indonesia',
      continent: 'asia'
    },
    category: 'nature',
    tags: ['Temples', 'Rice Terraces', 'Spirituality', 'Culture'],
    duration: '40 minutes',
    price: 0,
    isVirtual: true,
    is360: true,
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    participants: 9870
  },
  {
    title: 'New York: Manhattan Skyline & Central Park',
    description: 'Experience the energy of New York City. Soar above the Manhattan skyline, explore the green oasis of Central Park, and discover the iconic landmarks that make NYC the greatest city in the world.',
    shortDescription: 'The ultimate NYC experience',
    images: [
      { url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200' }
    ],
    location: {
      coordinates: [-73.9654, 40.7829],
      address: 'Central Park',
      city: 'New York',
      country: 'United States',
      continent: 'north-america'
    },
    category: 'urban',
    tags: ['Skyline', 'Parks', 'Landmarks', 'Architecture'],
    duration: '55 minutes',
    price: 12.99,
    isVirtual: true,
    is360: true,
    featured: true,
    rating: 4.8,
    reviewCount: 428,
    participants: 25670
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Tour.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@virtualtourist.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('Created admin user');

    // Create destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(`Created ${createdDestinations.length} destinations`);

    // Create tours with destination references
    const toursWithDestinations = tours.map((tour, index) => ({
      ...tour,
      destination: createdDestinations[index % createdDestinations.length]._id,
      guide: adminUser._id
    }));

    const createdTours = await Tour.insertMany(toursWithDestinations);
    console.log(`Created ${createdTours.length} tours`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();

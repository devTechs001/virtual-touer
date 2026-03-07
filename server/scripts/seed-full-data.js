#!/usr/bin/env node
/**
 * Full Data Seeder for Virtual Tourist - Africa First Edition
 *
 * This script seeds:
 * - 30+ African destinations (Kenya-first, then Africa)
 * - 60+ tours with full details
 * - Reviews, bookings, and user data
 *
 * Run: node scripts/seed-full-data.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

dotenv.config();

async function seedFullData() {
  await connectDB();
  console.log('🌍 Starting full data seed...\n');
  console.log('🇰🇪 Africa-First: Kenya & East Africa Priority\n');

  // ==================== AFRICAN DESTINATIONS (Kenya First) ====================
  const destinations = [
    // ==================== KENYA (Priority 1-15) ====================
    {
      name: 'Maasai Mara',
      description: 'The Maasai Mara National Reserve is one of Africa\'s most spectacular wildlife sanctuaries. Famous for the annual Great Migration, when over 1.5 million wildebeest and 200,000 zebras cross from the Serengeti, this vast savanna offers unparalleled game viewing. The Big Five—lion, leopard, elephant, buffalo, and rhino—roam these plains alongside cheetahs, giraffes, hippos, and over 450 bird species. The Maasai people, with their distinctive culture and traditional dress, add a rich human dimension to this natural wonder.',
      shortDescription: 'Kenya\'s premier wildlife destination and home to the Great Migration',
      location: {
        type: 'Point',
        coordinates: [35.1431, -1.4061],
        city: 'Maasai Mara',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Great Migration (July-October)', 'Big Five Safari', 'Maasai Cultural Visits', 'Hot Air Balloon Safaris', 'Sundowner Experiences'],
      language: 'Swahili, English, Maa',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'July-October for migration; Year-round for general wildlife',
      images: [
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Maasai Mara Wildlife' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'African Savannah Sunset' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'Great Migration' },
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'Maasai Warriors' },
        { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200', caption: 'African Wildlife' }
      ],
      isFeatured: true,
      priority: 1,
      rating: 4.9,
      reviewCount: 2847,
      priceRange: '$$$',
      activities: ['Game Drives', 'Balloon Safaris', 'Cultural Visits', 'Photography', 'Bird Watching'],
      weather: 'Warm days (20-30°C), cool nights. Dry season: June-October',
      howToGetThere: '45-minute flight from Nairobi or 5-6 hour drive',
      tips: ['Book migration season early', 'Bring binoculars', 'Pack neutral colors', 'Carry cash for Maasai villages']
    },
    {
      name: 'Diani Beach',
      description: 'Diani Beach is Kenya\'s most beautiful coastal destination, stretching 17 kilometers along the Indian Ocean. With its powdery white sand, turquoise waters, and vibrant coral reefs, it\'s a tropical paradise perfect for relaxation and adventure. The beach is backed by lush palm trees and offers world-class diving, snorkeling, kitesurfing, and deep-sea fishing. Nearby attractions include the Colobus Monkey Conservation, Kisite-Mpunguti Marine Park, and the historic Fort Jesus in Mombasa.',
      shortDescription: 'Pristine white sand beaches and crystal-clear Indian Ocean waters',
      location: {
        type: 'Point',
        coordinates: [39.5668, -4.2833],
        city: 'Diani',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['17km White Sand Beach', 'Coral Reef Snorkeling', 'Colobus Monkey Conservation', 'Kitesurfing & Water Sports', 'Swahili Cuisine'],
      language: 'Swahili, English',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'October-April (warmest); June-September (kitesurfing)',
      images: [
        { url: 'https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200', caption: 'Diani Beach Paradise' },
        { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfba6?w=1200', caption: 'Indian Ocean Waters' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'Tropical Sunset' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', caption: 'White Sand Beach' }
      ],
      isFeatured: true,
      priority: 2,
      rating: 4.8,
      reviewCount: 1923,
      priceRange: '$$-$$$',
      activities: ['Beach Relaxation', 'Scuba Diving', 'Kitesurfing', 'Deep Sea Fishing', 'Dhow Cruises'],
      weather: 'Tropical climate, 25-32°C year-round',
      howToGetThere: '30-minute flight to Ukunda airstrip or 4-hour drive from Nairobi',
      tips: ['Respect local dress codes', 'Try the fresh seafood', 'Visit during low tide for shell collecting']
    },
    {
      name: 'Mount Kenya',
      description: 'Mount Kenya, Africa\'s second-highest peak at 5,199 meters, is an ancient extinct volcano and UNESCO World Heritage Site. This majestic mountain offers diverse climbing experiences, from technical ascents to Point Lenana (4,985m) for trekkers. The mountain\'s slopes feature stunning alpine scenery, including glaciers, tarns, and unique Afro-alpine vegetation.',
      shortDescription: 'Africa\'s second-highest peak with stunning alpine scenery',
      location: {
        type: 'Point',
        coordinates: [37.3081, -0.1521],
        city: 'Nanyuki',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Point Lenana Trek', 'Glacier Views', 'Unique Afro-alpine Flora', 'Mountain Bongo Antelope', 'Sacred Kikuyu Site'],
      language: 'Swahili, English, Kikuyu',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'January-March and June-October (driest months)',
      images: [
        { url: 'https://images.unsplash.com/photo-1589553416260-f589e4446119?w=1200', caption: 'Mount Kenya Peak' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Alpine Scenery' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Mountain Sunrise' }
      ],
      isFeatured: true,
      priority: 3,
      rating: 4.7,
      reviewCount: 1456,
      priceRange: '$$-$$$',
      activities: ['Mountain Climbing', 'Trekking', 'Rock Climbing', 'Cave Exploration', 'Bird Watching'],
      weather: 'Varies by altitude; base: 20-25°C, summit: below freezing',
      howToGetThere: '2-3 hour drive from Nairobi to trailheads',
      tips: ['Acclimatize properly', 'Hire certified guides', 'Pack for all weather conditions']
    },
    {
      name: 'Nairobi',
      description: 'Nairobi, Kenya\'s vibrant capital, is a dynamic city where urban energy meets wildlife. Known as the "Green City in the Sun," it\'s the only capital with a national park within its boundaries. Nairobi National Park offers game drives with lions, rhinos, and giraffes against a city skyline backdrop.',
      shortDescription: 'Silicon Savannah - where wildlife meets urban sophistication',
      location: {
        type: 'Point',
        coordinates: [36.8219, -1.2921],
        city: 'Nairobi',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Nairobi National Park', 'David Sheldrick Elephant Orphanage', 'Giraffe Centre', 'Karen Blixen Museum', 'Maasai Market'],
      language: 'Swahili, English, Sheng',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'Year-round; July-October and December-March are driest',
      images: [
        { url: 'https://images.unsplash.com/photo-1489743378969-2c0bb7d910f6?w=1200', caption: 'Nairobi Skyline' },
        { url: 'https://images.unsplash.com/photo-1577977449989-9c4a4e4d6b5a?w=1200', caption: 'City Life' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Urban Africa' }
      ],
      isFeatured: true,
      priority: 4,
      rating: 4.5,
      reviewCount: 3241,
      priceRange: '$-$$$',
      activities: ['City Tours', 'Wildlife Viewing', 'Shopping', 'Nightlife', 'Cultural Experiences'],
      weather: 'Mild year-round (10-28°C); rainy seasons: March-May, October-December',
      howToGetThere: 'Jomo Kenyatta International Airport (JKIA) - major hub',
      tips: ['Use ride-hailing apps', 'Visit elephant feeding at 11am', 'Bargain at Maasai Market']
    },
    {
      name: 'Amboseli National Park',
      description: 'Amboseli National Park is renowned for its large elephant herds and spectacular views of Mount Kilimanjaro, Africa\'s highest peak, which rises majestically just across the border in Tanzania. The park\'s name comes from the Maasai word "nbotheli," meaning "salty dust," referring to its dry lake bed.',
      shortDescription: 'Home of the African elephant with iconic Kilimanjaro views',
      location: {
        type: 'Point',
        coordinates: [37.2606, -2.6527],
        city: 'Amboseli',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Elephant Herds', 'Kilimanjaro Views', 'Observation Hill', 'Maasai Cultural Visits', 'Bird Watching (400+ species)'],
      language: 'Swahili, English, Maa',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'June-October and January-February (dry seasons)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Elephants of Amboseli' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Kilimanjaro Backdrop' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'African Wildlife' }
      ],
      isFeatured: true,
      priority: 5,
      rating: 4.8,
      reviewCount: 1876,
      priceRange: '$$-$$$',
      activities: ['Game Drives', 'Photography', 'Cultural Visits', 'Bird Watching', 'Nature Walks'],
      weather: 'Hot and dry; 20-35°C',
      howToGetThere: '4-hour drive from Nairobi or 45-minute flight to Amboseli airstrip',
      tips: ['Visit early morning for clearest Kilimanjaro views', 'Bring telephoto lens']
    },
    {
      name: 'Lamu Island',
      description: 'Lamu Island is a serene escape to a world where time stands still. This UNESCO World Heritage Site features Lamu Old Town, the oldest Swahili settlement in East Africa. With no motor vehicles, transportation is by foot, bicycle, or donkey. The island boasts pristine beaches, traditional dhow sailing, and a rich Swahili culture.',
      shortDescription: 'UNESCO World Heritage Swahili town with pristine beaches',
      location: {
        type: 'Point',
        coordinates: [40.9020, -2.2717],
        city: 'Lamu',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Lamu Old Town UNESCO Site', 'No Motor Vehicles', 'Traditional Dhow Sailing', 'Swahili Architecture', 'Pristine Beaches'],
      language: 'Swahili, English',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'October-March (dry and warm)',
      images: [
        { url: 'https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200', caption: 'Lamu Old Town' },
        { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfba6?w=1200', caption: 'Traditional Dhow' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', caption: 'Lamu Beach' }
      ],
      isFeatured: true,
      priority: 6,
      rating: 4.7,
      reviewCount: 892,
      priceRange: '$$-$$$',
      activities: ['Historical Tours', 'Dhow Sailing', 'Beach Relaxation', 'Cultural Experiences', 'Snorkeling'],
      weather: 'Tropical, 25-32°C',
      howToGetThere: 'Flight from Nairobi to Lamu or ferry from Mombasa',
      tips: ['Dress modestly', 'Explore on foot', 'Try Swahili delicacies']
    },
    {
      name: 'Tsavo National Parks',
      description: 'Tsavo East and West together form one of the largest national parks in the world. Known for its "red elephants" that dust themselves with the red soil, Tsavo offers vast wilderness, diverse wildlife, and dramatic landscapes including the Yatta Plateau and Lugard Falls.',
      shortDescription: 'Kenya\'s largest national park with red elephants',
      location: {
        type: 'Point',
        coordinates: [38.5000, -3.0000],
        city: 'Tsavo',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Red Elephants', 'Yatta Plateau', 'Lugard Falls', 'Mzima Springs', 'Vast Wilderness'],
      language: 'Swahili, English',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'June-October (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Tsavo Elephants' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Red Soil Landscape' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'African Wilderness' }
      ],
      isFeatured: true,
      priority: 7,
      rating: 4.6,
      reviewCount: 1234,
      priceRange: '$$',
      activities: ['Game Drives', 'Photography', 'Bird Watching', 'Nature Walks', 'Camping'],
      weather: 'Hot and dry; 25-35°C',
      howToGetThere: '3-4 hour drive from Nairobi or Mombasa',
      tips: ['Carry plenty of water', 'Visit Mzima Springs for hippos', 'Best for off-road driving']
    },
    {
      name: 'Lake Nakuru',
      description: 'Lake Nakuru National Park is famous for its flamingo populations that paint the lake shores pink. This relatively small park is also a rhino sanctuary and offers excellent game viewing including lions, leopards, and over 450 bird species.',
      shortDescription: 'Famous for flamingos and rhino sanctuary',
      location: {
        type: 'Point',
        coordinates: [36.0833, -0.3667],
        city: 'Nakuru',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Flamingo Flocks', 'Rhino Sanctuary', 'Baboon Cliff', 'Lake Views', 'Bird Paradise'],
      language: 'Swahili, English',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'Year-round; June-March for flamingos',
      images: [
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'Flamingos at Lake Nakuru' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Pink Lake Shore' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'African Birds' }
      ],
      isFeatured: true,
      priority: 8,
      rating: 4.7,
      reviewCount: 1567,
      priceRange: '$$',
      activities: ['Game Drives', 'Bird Watching', 'Photography', 'Picnics', 'Nature Walks'],
      weather: 'Mild climate; 10-28°C',
      howToGetThere: '2-3 hour drive from Nairobi',
      tips: ['Visit early morning for best bird activity', 'Combine with Lake Naivasha']
    },
    {
      name: 'Samburu National Reserve',
      description: 'Samburu National Reserve, located on the banks of the Ewaso Ng\'iro River, is home to unique wildlife species not found elsewhere in Kenya including the reticulated giraffe, Grevy\'s zebra, Somali ostrich, and gerenuk. The reserve is also home to the Samburu people, known for their distinctive culture.',
      shortDescription: 'Home to unique wildlife species and Samburu culture',
      location: {
        type: 'Point',
        coordinates: [37.5333, 0.5667],
        city: 'Samburu',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Samburu Special Five', 'Ewaso Ng\'iro River', 'Samburu Culture', 'Elephant Project', 'Remote Wilderness'],
      language: 'Swahili, English, Samburu',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'June-September and December-March',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Samburu Wildlife' },
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'Samburu Warriors' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Ewaso Ng\'iro River' }
      ],
      isFeatured: true,
      priority: 9,
      rating: 4.8,
      reviewCount: 987,
      priceRange: '$$-$$$',
      activities: ['Game Drives', 'Cultural Visits', 'River Walks', 'Photography', 'Bird Watching'],
      weather: 'Hot and dry; 25-35°C',
      howToGetThere: '5-6 hour drive from Nairobi or 45-minute flight',
      tips: ['Visit riverbanks for wildlife', 'Learn about Samburu culture', 'Bring binoculars']
    },
    {
      name: 'Hell\'s Gate National Park',
      description: 'Hell\'s Gate National Park is a unique park where visitors can walk or cycle among wildlife. Named by two explorers who believed the steam from geothermal activity was smoke from hell, the park features dramatic cliffs, gorges, and geothermal features.',
      shortDescription: 'Walk and cycle among wildlife in dramatic landscapes',
      location: {
        type: 'Point',
        coordinates: [36.3000, -0.9000],
        city: 'Naivasha',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Walking Safari', 'Cycling Among Wildlife', 'Fischer\'s Tower', 'Geothermal Features', 'Rock Climbing'],
      language: 'Swahili, English',
      currency: 'KES (Kenyan Shilling)',
      bestTimeToVisit: 'Year-round; June-September best for cycling',
      images: [
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Hell\'s Gate Cliffs' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Dramatic Gorges' },
        { url: 'https://images.unsplash.com/photo-1589553416260-f589e4446119?w=1200', caption: 'Fischer\'s Tower' }
      ],
      isFeatured: false,
      priority: 10,
      rating: 4.6,
      reviewCount: 756,
      priceRange: '$',
      activities: ['Cycling', 'Walking Safari', 'Rock Climbing', 'Photography', 'Geothermal Tours'],
      weather: 'Warm and dry; 15-30°C',
      howToGetThere: '1.5-2 hour drive from Nairobi',
      tips: ['Rent a bike at the gate', 'Watch for baboons', 'Combine with Lake Naivasha']
    },

    // ==================== TANZANIA (Priority 11-20) ====================
    {
      name: 'Serengeti National Park',
      description: 'The Serengeti, meaning "endless plains" in the Maasai language, is Tanzania\'s oldest and most famous national park. It hosts the greatest wildlife spectacle on Earth: the annual Great Migration, when over 1.5 million wildebeest and 200,000 zebras cycle through in search of fresh grazing.',
      shortDescription: 'The Great Migration home and Africa\'s premier safari destination',
      location: {
        type: 'Point',
        coordinates: [34.8333, -2.3333],
        city: 'Serengeti',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Great Migration', 'Big Five', 'Hot Air Balloon Safaris', 'Predator Action', 'Endless Plains'],
      language: 'Swahili, English',
      currency: 'TZS (Tanzanian Shilling)',
      bestTimeToVisit: 'June-October (dry season); December-July (migration)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Serengeti Plains' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Great Migration' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'African Safari' }
      ],
      isFeatured: true,
      priority: 11,
      rating: 4.9,
      reviewCount: 4521,
      priceRange: '$$$-$$$$',
      activities: ['Game Drives', 'Balloon Safaris', 'Photography', 'Cultural Visits', 'Bush Dinners'],
      weather: 'Warm days, cool nights; wet season November-May',
      howToGetThere: 'Fly to Kilimanjaro or Arusha, then connecting flight to Seronera',
      tips: ['Book migration camps early', 'Pack layers', 'Bring dust protection for cameras']
    },
    {
      name: 'Zanzibar',
      description: 'Zanzibar, the Spice Island, is a Tanzanian archipelago off the coast of East Africa. Its capital, Stone Town, is a UNESCO World Heritage Site with narrow alleys, ornate wooden doors, and a blend of Arab, Persian, Indian, and European influences.',
      shortDescription: 'Spice Island with historic Stone Town and pristine beaches',
      location: {
        type: 'Point',
        coordinates: [39.2083, -6.1659],
        city: 'Stone Town',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Stone Town UNESCO Site', 'Spice Farm Tours', 'Nungwi Beach', 'Prison Island (Giant Tortoises)', 'Sunset Dhow Cruises'],
      language: 'Swahili, English, Arabic',
      currency: 'TZS (Tanzanian Shilling)',
      bestTimeToVisit: 'June-October and December-February',
      images: [
        { url: 'https://images.unsplash.com/photo-1534764878489-4b832442c3e7?w=1200', caption: 'Stone Town Doors' },
        { url: 'https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200', caption: 'Zanzibar Beach' },
        { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfba6?w=1200', caption: 'Spice Market' }
      ],
      isFeatured: true,
      priority: 12,
      rating: 4.8,
      reviewCount: 3156,
      priceRange: '$$-$$$',
      activities: ['Beach Relaxation', 'Scuba Diving', 'Spice Tours', 'Stone Town Tours', 'Snorkeling'],
      weather: 'Tropical, 25-32°C; rainy seasons: March-May, November',
      howToGetThere: 'Fly to Zanzibar International Airport or ferry from Dar es Salaam',
      tips: ['Dress modestly in Stone Town', 'Try Zanzibar pizza', 'Bargain at markets']
    },
    {
      name: 'Mount Kilimanjaro',
      description: 'Mount Kilimanjaro is Africa\'s highest peak and the world\'s highest free-standing mountain at 5,895 meters. This dormant volcano with three volcanic cones offers various climbing routes through five distinct climate zones, from rainforest to arctic summit.',
      shortDescription: 'Africa\'s highest peak - the Roof of Africa',
      location: {
        type: 'Point',
        coordinates: [37.3556, -3.0674],
        city: 'Moshi',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Uhuru Peak (5,895m)', 'Five Climate Zones', 'Glacier Views', 'Multiple Routes', 'Bucket List Climb'],
      language: 'Swahili, English',
      currency: 'TZS (Tanzanian Shilling)',
      bestTimeToVisit: 'January-March and June-October',
      images: [
        { url: 'https://images.unsplash.com/photo-1589553416260-f589e4446119?w=1200', caption: 'Kilimanjaro Summit' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Uhuru Peak' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Mountain Climbing' }
      ],
      isFeatured: true,
      priority: 13,
      rating: 4.9,
      reviewCount: 2876,
      priceRange: '$$$$',
      activities: ['Mountain Climbing', 'Trekking', 'Photography', 'Wildlife Viewing', 'Cultural Visits'],
      weather: 'Varies by altitude; base: 25-30°C, summit: -20 to -30°C',
      howToGetThere: 'Fly to Kilimanjaro International Airport (JRO)',
      tips: ['Train beforehand', 'Choose longer route for acclimatization', 'Pack warm layers']
    },
    {
      name: 'Ngorongoro Crater',
      description: 'The Ngorongoro Crater is the world\'s largest inactive volcanic caldera, often called "Africa\'s Garden of Eden." This natural wonder houses over 25,000 large animals including the rare black rhino, creating one of the highest wildlife densities in Africa.',
      shortDescription: 'Africa\'s Garden of Eden - world\'s largest volcanic caldera',
      location: {
        type: 'Point',
        coordinates: [35.5000, -3.2000],
        city: 'Ngorongoro',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Black Rhino', 'Dense Wildlife', 'Crater Floor', 'Maasai Villages', 'UNESCO World Heritage'],
      language: 'Swahili, English',
      currency: 'TZS (Tanzanian Shilling)',
      bestTimeToVisit: 'June-September (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Ngorongoro Crater' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Crater Wildlife' },
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'African Wildlife' }
      ],
      isFeatured: true,
      priority: 14,
      rating: 4.9,
      reviewCount: 2345,
      priceRange: '$$$',
      activities: ['Game Drives', 'Crater Tours', 'Maasai Visits', 'Photography', 'Bird Watching'],
      weather: 'Cool highland climate; 10-25°C',
      howToGetThere: '3-hour drive from Arusha',
      tips: ['Descend early to avoid crowds', 'Bring warm clothes', 'Combine with Serengeti']
    },
    {
      name: 'Tarangire National Park',
      description: 'Tarangire National Park is famous for its large elephant herds and ancient baobab trees. The Tarangire River attracts massive wildlife concentrations during the dry season, making it one of Tanzania\'s best parks for elephant viewing.',
      shortDescription: 'Famous for elephant herds and ancient baobabs',
      location: {
        type: 'Point',
        coordinates: [36.0000, -3.8333],
        city: 'Tarangire',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Elephant Herds', 'Baobab Trees', 'Tarangire River', 'Tree-Climbing Lions', 'Bird Paradise'],
      language: 'Swahili, English',
      currency: 'TZS (Tanzanian Shilling)',
      bestTimeToVisit: 'June-October (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Elephants & Baobabs' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Tarangire Landscape' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'African Giants' }
      ],
      isFeatured: true,
      priority: 15,
      rating: 4.7,
      reviewCount: 1654,
      priceRange: '$$',
      activities: ['Game Drives', 'Walking Safaris', 'Bird Watching', 'Photography', 'Night Drives'],
      weather: 'Hot and dry; 20-35°C',
      howToGetThere: '2-hour drive from Arusha',
      tips: ['Visit dry season for best wildlife', 'Combine with Ngorongoro', 'Look for tree-climbing lions']
    },

    // ==================== EGYPT (Priority 16-20) ====================
    {
      name: 'Pyramids of Giza',
      description: 'Stand before the last remaining wonder of the ancient world. The Great Pyramid of Giza, built over 4,500 years ago, continues to mystify archaeologists and visitors alike with its precise construction and hidden chambers. The complex includes the Great Sphinx and several smaller pyramids.',
      shortDescription: 'The last remaining wonder of the ancient world',
      location: {
        type: 'Point',
        coordinates: [31.1342, 29.9792],
        city: 'Giza',
        country: 'Egypt',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Great Pyramid', 'Great Sphinx', 'Valley Temple', 'Solar Boat Museum', 'Sound & Light Show'],
      language: 'Arabic, English',
      currency: 'EGP (Egyptian Pound)',
      bestTimeToVisit: 'October-April (cooler months)',
      images: [
        { url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200', caption: 'Pyramids of Giza' },
        { url: 'https://images.unsplash.com/photo-1539650116455-251d93d5c933?w=1200', caption: 'Great Sphinx' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Ancient Wonder' }
      ],
      isFeatured: true,
      priority: 16,
      rating: 4.8,
      reviewCount: 5678,
      priceRange: '$$',
      activities: ['Pyramid Tours', 'Camel Rides', 'Museum Visits', 'Photography', 'Sound & Light Show'],
      weather: 'Hot desert climate; 15-35°C',
      howToGetThere: '30-minute drive from Cairo',
      tips: ['Visit early morning', 'Bring water and sun protection', 'Hire a guide for insights']
    },
    {
      name: 'Luxor Temple & Valley of the Kings',
      description: 'Luxor is the world\'s greatest open-air museum, home to the magnificent Luxor Temple, Karnak Temple Complex, and the Valley of the Kings where Tutankhamun\'s tomb was discovered. The ancient city of Thebes showcases Egypt\'s golden age.',
      shortDescription: 'World\'s greatest open-air museum',
      location: {
        type: 'Point',
        coordinates: [32.6396, 25.6872],
        city: 'Luxor',
        country: 'Egypt',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Valley of the Kings', 'Luxor Temple', 'Karnak Temple', 'Tutankhamun\'s Tomb', 'Nile Cruises'],
      language: 'Arabic, English',
      currency: 'EGP (Egyptian Pound)',
      bestTimeToVisit: 'October-April (cooler months)',
      images: [
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Luxor Temple' },
        { url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200', caption: 'Valley of the Kings' },
        { url: 'https://images.unsplash.com/photo-1539650116455-251d93d5c933?w=1200', caption: 'Ancient Hieroglyphs' }
      ],
      isFeatured: true,
      priority: 17,
      rating: 4.9,
      reviewCount: 4321,
      priceRange: '$$',
      activities: ['Temple Tours', 'Tomb Visits', 'Nile Cruises', 'Hot Air Balloon', 'Museum Tours'],
      weather: 'Hot desert climate; 20-40°C',
      howToGetThere: 'Flight from Cairo or overnight train',
      tips: ['Start early to beat heat', 'Buy combined tickets', 'Consider a Nile cruise']
    },
    {
      name: 'Red Sea Riviera',
      description: 'The Red Sea Riviera offers some of the world\'s best diving and snorkeling with pristine coral reefs, abundant marine life, and crystal-clear waters. Hurghada and Sharm el-Sheikh are the main resort towns offering luxury beaches and water sports.',
      shortDescription: 'World-class diving and pristine coral reefs',
      location: {
        type: 'Point',
        coordinates: [33.8116, 27.2579],
        city: 'Hurghada',
        country: 'Egypt',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Coral Reefs', 'Marine Life', 'Beach Resorts', 'Water Sports', 'Desert Safaris'],
      language: 'Arabic, English',
      currency: 'EGP (Egyptian Pound)',
      bestTimeToVisit: 'March-May and September-November',
      images: [
        { url: 'https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200', caption: 'Red Sea Coral' },
        { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfba6?w=1200', caption: 'Tropical Fish' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', caption: 'Beach Resort' }
      ],
      isFeatured: true,
      priority: 18,
      rating: 4.7,
      reviewCount: 2987,
      priceRange: '$$-$$$',
      activities: ['Scuba Diving', 'Snorkeling', 'Beach Relaxation', 'Desert Safaris', 'Boat Trips'],
      weather: 'Warm year-round; 20-35°C',
      howToGetThere: 'Flight to Hurghada or Sharm el-Sheikh',
      tips: ['Bring reef-safe sunscreen', 'Book diving packages', 'Try a desert safari']
    },

    // ==================== SOUTH AFRICA (Priority 19-22) ====================
    {
      name: 'Table Mountain',
      description: 'Ride the cableway to the top of Cape Town\'s iconic flat-topped mountain. At 1,086 meters, enjoy panoramic views of the city, Atlantic Ocean, and the unique fynbos vegetation found nowhere else on Earth.',
      shortDescription: 'Cape Town\'s iconic landmark with panoramic views',
      location: {
        type: 'Point',
        coordinates: [18.4097, -33.9628],
        city: 'Cape Town',
        country: 'South Africa',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Cableway Ride', 'Panoramic Views', 'Unique Fynbos', 'Hiking Trails', 'UNESCO World Heritage'],
      language: 'English, Afrikaans, Xhosa',
      currency: 'ZAR (South African Rand)',
      bestTimeToVisit: 'November-March (summer)',
      images: [
        { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca387c?w=1200', caption: 'Table Mountain' },
        { url: 'https://images.unsplash.com/photo-1596395819057-d37f7ca67250?w=1200', caption: 'Cape Town View' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Cableway' }
      ],
      isFeatured: true,
      priority: 19,
      rating: 4.8,
      reviewCount: 3456,
      priceRange: '$$',
      activities: ['Cableway', 'Hiking', 'Photography', 'Rock Climbing', 'City Tours'],
      weather: 'Mediterranean climate; 15-28°C',
      howToGetThere: 'Cape Town city center - 15-minute drive',
      tips: ['Check weather before visiting', 'Book cableway tickets online', 'Bring warm clothes for summit']
    },
    {
      name: 'Kruger National Park',
      description: 'Kruger National Park is one of Africa\'s largest and most famous game reserves, offering exceptional Big Five viewing. With over 2 million hectares of diverse ecosystems, it\'s home to an incredible variety of wildlife including lions, leopards, elephants, and rhinos.',
      shortDescription: 'One of Africa\'s largest game reserves - Big Five home',
      location: {
        type: 'Point',
        coordinates: [31.5000, -24.0000],
        city: 'Kruger Park',
        country: 'South Africa',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Big Five', 'Self-Drive Safaris', 'Luxury Lodges', 'Bird Watching', 'Night Drives'],
      language: 'English, Afrikaans',
      currency: 'ZAR (South African Rand)',
      bestTimeToVisit: 'May-September (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Kruger Wildlife' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Lion Pride' },
        { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200', caption: 'African Elephant' }
      ],
      isFeatured: true,
      priority: 20,
      rating: 4.9,
      reviewCount: 4567,
      priceRange: '$$-$$$$',
      activities: ['Game Drives', 'Bush Walks', 'Bird Watching', 'Photography', 'Night Safaris'],
      weather: 'Subtropical; 15-35°C',
      howToGetThere: 'Fly to Johannesburg then to Kruger airports',
      tips: ['Book accommodation early', 'Self-drive is affordable', 'Visit waterholes at dawn']
    },

    // ==================== MOROCCO (Priority 21-23) ====================
    {
      name: 'Marrakech Medina',
      description: 'Get lost in the labyrinthine souks and alleys of Marrakech\'s historic medina. From the bustling Jemaa el-Fnaa square to the ornate Bahia Palace, experience the magic of Morocco\'s imperial city with its vibrant colors, scents, and sounds.',
      shortDescription: 'The Red City\'s ancient heart with vibrant souks',
      location: {
        type: 'Point',
        coordinates: [-7.9811, 31.6295],
        city: 'Marrakech',
        country: 'Morocco',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Jemaa el-Fnaa Square', 'Historic Souks', 'Bahia Palace', 'Majorelle Garden', 'Traditional Riads'],
      language: 'Arabic, French, Berber',
      currency: 'MAD (Moroccan Dirham)',
      bestTimeToVisit: 'March-May and September-November',
      images: [
        { url: 'https://images.unsplash.com/photo-1539022113096-15832402a033?w=1200', caption: 'Marrakech Souk' },
        { url: 'https://images.unsplash.com/photo-1597211833158-e6c4e6d47c2e?w=1200', caption: 'Jemaa el-Fnaa' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Moroccan Architecture' }
      ],
      isFeatured: true,
      priority: 21,
      rating: 4.7,
      reviewCount: 3890,
      priceRange: '$$-$$$',
      activities: ['Medina Tours', 'Shopping', 'Palace Visits', 'Food Tours', 'Hammam Experience'],
      weather: 'Hot summers, mild winters; 10-40°C',
      howToGetThere: 'Flight to Marrakech Menara Airport',
      tips: ['Bargain in souks', 'Visit square at sunset', 'Stay in a traditional riad']
    },
    {
      name: 'Sahara Desert (Merzouga)',
      description: 'Journey into the world\'s largest hot desert. Experience the golden dunes of Erg Chebbi, spend a night under the stars in a Berber camp, and witness one of Earth\'s most extreme and beautiful landscapes with spectacular sunrises and sunsets.',
      shortDescription: 'Journey into the world\'s largest hot desert',
      location: {
        type: 'Point',
        coordinates: [-4.0000, 31.0000],
        city: 'Merzouga',
        country: 'Morocco',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Erg Chebbi Dunes', 'Camel Trekking', 'Berber Camps', 'Stargazing', 'Desert Sunsets'],
      language: 'Arabic, Berber, French',
      currency: 'MAD (Moroccan Dirham)',
      bestTimeToVisit: 'October-April (cooler months)',
      images: [
        { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200', caption: 'Sahara Dunes' },
        { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200', caption: 'Desert Sunset' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Camel Trek' }
      ],
      isFeatured: true,
      priority: 22,
      rating: 4.9,
      reviewCount: 2765,
      priceRange: '$$-$$$',
      activities: ['Camel Trekking', 'Desert Camping', 'Stargazing', '4x4 Tours', 'Sandboarding'],
      weather: 'Extreme; hot days, cold nights; 5-45°C',
      howToGetThere: 'Drive from Marrakech (9 hours) or fly to Errachidia',
      tips: ['Bring warm clothes for night', 'Protect from sun', 'Book authentic Berber camp']
    },

    // ==================== OTHER AFRICAN GEMS (Priority 23-30) ====================
    {
      name: 'Victoria Falls',
      description: 'Experience "The Smoke That Thunders" - one of the world\'s largest and most spectacular waterfalls. The mighty Zambezi River plunges 108 meters into a narrow gorge, creating a mist visible from 20 kilometers away.',
      shortDescription: 'The Smoke That Thunders - one of world\'s largest waterfalls',
      location: {
        type: 'Point',
        coordinates: [25.8572, -17.9243],
        city: 'Victoria Falls',
        country: 'Zimbabwe',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Main Falls View', 'Devil\'s Pool', 'Rainbow Views', 'White Water Rafting', 'Helicopter Flights'],
      language: 'English, Shona, Ndebele',
      currency: 'USD/ZWL',
      bestTimeToVisit: 'February-May (high water); August-October (best views)',
      images: [
        { url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200', caption: 'Victoria Falls' },
        { url: 'https://images.unsplash.com/photo-1627894483216-815c3e6ca6ac?w=1200', caption: 'Rainbow at Falls' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Zambezi River' }
      ],
      isFeatured: true,
      priority: 23,
      rating: 4.9,
      reviewCount: 3234,
      priceRange: '$$-$$$',
      activities: ['Falls Tours', 'White Water Rafting', 'Bungee Jumping', 'Helicopter Flights', 'Sunset Cruises'],
      weather: 'Subtropical; 15-35°C',
      howToGetThere: 'Fly to Victoria Falls Airport',
      tips: ['Bring waterproof gear', 'Visit full moon for lunar rainbow', 'Combine with safari']
    },
    {
      name: 'Okavango Delta',
      description: 'Explore the world\'s largest inland delta, where the Okavango River creates a lush paradise in the Kalahari Desert. Navigate traditional mokoros and spot elephants, lions, and rare bird species in this UNESCO World Heritage Site.',
      shortDescription: 'The world\'s largest inland delta - UNESCO site',
      location: {
        type: 'Point',
        coordinates: [22.7500, -19.5000],
        city: 'Okavango',
        country: 'Botswana',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Mokoro Safaris', 'Big Five', 'Bird Paradise', 'Luxury Lodges', 'Pristine Wilderness'],
      language: 'English, Setswana',
      currency: 'BWP (Botswana Pula)',
      bestTimeToVisit: 'May-October (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Okavango Waterways' },
        { url: 'https://images.unsplash.com/photo-1544238458-0a9a806a7e77?w=1200', caption: 'Delta Wildlife' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Mokoro Safari' }
      ],
      isFeatured: true,
      priority: 24,
      rating: 4.9,
      reviewCount: 1876,
      priceRange: '$$$$',
      activities: ['Mokoro Safaris', 'Game Drives', 'Bird Watching', 'Fishing', 'Scenic Flights'],
      weather: 'Subtropical; 15-35°C',
      howToGetThere: 'Fly to Maun, then light aircraft to delta',
      tips: ['Book well in advance', 'Pack light for small aircraft', 'Budget for premium experience']
    },
    {
      name: 'Rwanda Volcanoes National Park',
      description: 'Track endangered mountain gorillas in their natural habitat. This small but remarkable park is home to about one-third of the world\'s remaining mountain gorillas, offering life-changing encounters with these gentle giants.',
      shortDescription: 'Home of endangered mountain gorillas',
      location: {
        type: 'Point',
        coordinates: [29.5000, -1.5000],
        city: 'Musanze',
        country: 'Rwanda',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Gorilla Trekking', 'Golden Monkeys', 'Dian Fossey Site', 'Volcano Hikes', 'Conservation Success'],
      language: 'Kinyarwanda, English, French',
      currency: 'RWF (Rwandan Franc)',
      bestTimeToVisit: 'June-September and December-February',
      images: [
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Mountain Gorilla' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Volcanoes Park' },
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'Gorilla Family' }
      ],
      isFeatured: true,
      priority: 25,
      rating: 5.0,
      reviewCount: 1234,
      priceRange: '$$$$',
      activities: ['Gorilla Trekking', 'Golden Monkey Tracking', 'Volcano Hikes', 'Cave Exploration', 'Cultural Visits'],
      weather: 'Cool highland; 10-25°C',
      howToGetThere: 'Fly to Kigali, 2-hour drive to park',
      tips: ['Book permits months ahead', 'Bring hiking boots', 'Follow guide instructions']
    },
    {
      name: 'Ethiopia - Lalibela Rock Churches',
      description: 'Marvel at the 12 medieval monolithic churches carved from solid rock in the 12th century. This UNESCO World Heritage site remains an active pilgrimage destination for Ethiopian Orthodox Christians.',
      shortDescription: 'Medieval churches carved from solid rock',
      location: {
        type: 'Point',
        coordinates: [39.0472, 12.0319],
        city: 'Lalibela',
        country: 'Ethiopia',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['11 Rock Churches', 'Church of St. George', 'Active Pilgrimage', 'Ancient Frescoes', 'UNESCO Site'],
      language: 'Amharic, English',
      currency: 'ETB (Ethiopian Birr)',
      bestTimeToVisit: 'September-March (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=1200', caption: 'Rock Church' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Lalibela Cross' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Ancient Architecture' }
      ],
      isFeatured: true,
      priority: 26,
      rating: 4.8,
      reviewCount: 987,
      priceRange: '$',
      activities: ['Church Tours', 'Religious Festivals', 'Photography', 'Cultural Experiences', 'Hiking'],
      weather: 'Highland climate; 10-25°C',
      howToGetThere: 'Flight from Addis Ababa',
      tips: ['Dress modestly', 'Visit during Timkat festival', 'Remove shoes in churches']
    },
    {
      name: 'Namibia - Sossusvlei Dunes',
      description: 'Witness the world\'s highest sand dunes rising up to 325 meters in brilliant orange and red hues. Sossusvlei\'s surreal landscape, with ancient salt pans and twisted acacia trees, creates some of Africa\'s most photographed scenes.',
      shortDescription: 'World\'s highest sand dunes with surreal landscapes',
      location: {
        type: 'Point',
        coordinates: [15.2919, -24.7272],
        city: 'Sossusvlei',
        country: 'Namibia',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Dune 45', 'Big Daddy Dune', 'Deadvlei', 'Sunrise Photography', 'Ancient Salt Pan'],
      language: 'English, Afrikaans, German',
      currency: 'NAD (Namibian Dollar)',
      bestTimeToVisit: 'April-October (cooler months)',
      images: [
        { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200', caption: 'Sossusvlei Dunes' },
        { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200', caption: 'Deadvlei' },
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Desert Sunrise' }
      ],
      isFeatured: true,
      priority: 27,
      rating: 4.9,
      reviewCount: 1543,
      priceRange: '$$-$$$',
      activities: ['Dune Climbing', 'Photography', 'Scenic Flights', '4x4 Tours', 'Stargazing'],
      weather: 'Desert; hot days, cold nights; 5-40°C',
      howToGetThere: 'Fly to Windhoek, 4-5 hour drive',
      tips: ['Climb dunes at sunrise', 'Bring lots of water', 'Protect camera from sand']
    },
    {
      name: 'Madagascar - Avenue of the Baobabs',
      description: 'Walk among ancient baobab trees, some over 800 years old, lining this iconic dirt road. Madagascar\'s unique biodiversity includes lemurs, chameleons, and thousands of endemic species found nowhere else on Earth.',
      shortDescription: 'Ancient baobab trees and unique biodiversity',
      location: {
        type: 'Point',
        coordinates: [44.4167, -20.2500],
        city: 'Morondava',
        country: 'Madagascar',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Avenue of Baobabs', 'Lemur Watching', 'Unique Wildlife', 'Sunset Photography', 'Tsingy Limestone'],
      language: 'Malagasy, French',
      currency: 'MGA (Malagasy Ariary)',
      bestTimeToVisit: 'April-December (dry season)',
      images: [
        { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200', caption: 'Avenue of Baobabs' },
        { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200', caption: 'Lemur' },
        { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200', caption: 'Madagascar Wildlife' }
      ],
      isFeatured: true,
      priority: 28,
      rating: 4.8,
      reviewCount: 876,
      priceRange: '$$',
      activities: ['Baobab Tours', 'Lemur Watching', 'Photography', 'Beach Extension', 'Rainforest Trekking'],
      weather: 'Tropical; 20-35°C',
      howToGetThere: 'Fly to Antananarivo, then to Morondava',
      tips: ['Visit at sunset', 'Combine with rainforest', 'Bring cash (ATMs scarce)']
    }
  ];

  console.log('📍 Seeding destinations...');
  const destOps = destinations.map(d => ({
    updateOne: {
      filter: { name: d.name },
      update: { $set: d },
      upsert: true
    }
  }));

  const destRes = await Destination.bulkWrite(destOps);
  console.log(`✅ Seeded ${destRes.modifiedCount || destRes.upsertedCount} destinations\n`);

  // ==================== TOURS (Africa-Focused) ====================
  const tours = [
    // Kenya Tours
    {
      title: 'Maasai Mara 3-Day Safari Adventure',
      description: 'Experience the magic of the Maasai Mara on this comprehensive 3-day safari. Track the Big Five, witness the Great Migration (seasonal), and immerse yourself in Maasai culture.',
      location: 'Maasai Mara, Kenya',
      price: 599,
      duration: '3 Days / 2 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 487,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Full-day game drives', 'Maasai village visit', 'All park fees included', 'Professional guide', 'Lodge accommodation'],
      itinerary: [
        'Day 1: Nairobi to Mara, afternoon game drive',
        'Day 2: Full day in the reserve, picnic lunch',
        'Day 3: Morning drive, return to Nairobi'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 7,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Diani Beach 5-Day Relaxation Package',
      description: 'Unwind on Kenya\'s most beautiful beach with this all-inclusive coastal getaway. Enjoy water sports, spa treatments, and fresh seafood in a tropical paradise.',
      location: 'Diani Beach, Kenya',
      price: 899,
      duration: '5 Days / 4 Nights',
      category: 'relaxation',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 312,
      images: ['https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200'],
      highlights: ['Beachfront accommodation', 'Daily breakfast', 'Snorkeling trip', 'Spa treatment', 'Sunset dhow cruise'],
      itinerary: [
        'Day 1: Arrival and beach welcome',
        'Day 2: Snorkeling at Kisite-Mpunguti',
        'Day 3: Spa day and relaxation',
        'Day 4: Dhow cruise and seafood dinner',
        'Day 5: Departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Activities', 'Transfers'],
      excluded: ['Lunch/Dinner', 'Additional spa treatments', 'Tips'],
      maxGroupSize: 20,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Mount Kenya 4-Day Trek to Point Lenana',
      description: 'Challenge yourself with this guided trek to Point Lenana (4,985m), the third-highest peak of Mount Kenya. Experience diverse ecosystems and stunning alpine scenery.',
      location: 'Mount Kenya, Kenya',
      price: 750,
      duration: '4 Days / 3 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 198,
      images: ['https://images.unsplash.com/photo-1589553416260-f589e4446119?w=1200'],
      highlights: ['Summit sunrise view', 'Alpine flora', 'Professional guides', 'Porter support', 'Mountain huts'],
      itinerary: [
        'Day 1: Gate to Old Moses Camp (3,000m)',
        'Day 2: Acclimatization hike to Shipton\'s Camp (4,200m)',
        'Day 3: Summit Point Lenana (4,985m), descend',
        'Day 4: Return to gate'
      ],
      included: ['Guides', 'Porters', 'Huts', 'Meals', 'Park fees'],
      excluded: ['Sleeping bag', 'Personal gear', 'Tips'],
      maxGroupSize: 12,
      difficulty: 'Challenging',
      ageRestriction: '14+'
    },
    {
      title: 'Nairobi City & Wildlife Day Tour',
      description: 'Discover Kenya\'s capital on this comprehensive day tour. Visit Nairobi National Park, the Elephant Orphanage, Giraffe Centre, and explore the city\'s highlights.',
      location: 'Nairobi, Kenya',
      price: 149,
      duration: 'Full Day (8 hours)',
      category: 'cultural',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 892,
      images: ['https://images.unsplash.com/photo-1489743378969-2c0bb7d910f6?w=1200'],
      highlights: ['Nairobi National Park game drive', 'Elephant feeding at 11am', 'Giraffe feeding', 'Karen Blixen Museum', 'Lunch included'],
      itinerary: [
        'Morning: National Park game drive',
        '11am: Elephant Orphanage',
        'Afternoon: Giraffe Centre and Museum',
        'Evening: Return to city'
      ],
      included: ['Transport', 'Park fees', 'Entrance fees', 'Lunch', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 15,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Amboseli Elephant & Kilimanjaro Safari',
      description: 'Witness Africa\'s largest elephants against the backdrop of Mount Kilimanjaro. This 2-day safari offers exceptional wildlife viewing and photography opportunities.',
      location: 'Amboseli, Kenya',
      price: 399,
      duration: '2 Days / 1 Night',
      category: 'adventure',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 445,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Elephant herds', 'Kilimanjaro views', 'Observation Hill climb', 'Maasai village', 'All meals included'],
      itinerary: [
        'Day 1: Nairobi to Amboseli, afternoon drive',
        'Day 2: Morning drive, visit Maasai village, return'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Optional activities'],
      maxGroupSize: 7,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Lamu Island Cultural & Beach Escape',
      description: 'Step back in time on this UNESCO World Heritage island. Explore Lamu Old Town, sail on traditional dhows, and relax on pristine beaches with no motor vehicles in sight.',
      location: 'Lamu, Kenya',
      price: 699,
      duration: '4 Days / 3 Nights',
      category: 'cultural',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 234,
      images: ['https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200'],
      highlights: ['Lamu Old Town tour', 'Dhow sailing', 'Beach time', 'Swahili cooking class', 'Donkey ride'],
      itinerary: [
        'Day 1: Ferry to Lamu, check-in',
        'Day 2: Old Town walking tour',
        'Day 3: Dhow sailing and snorkeling',
        'Day 4: Beach relaxation, departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Activities', 'Ferry transfers'],
      excluded: ['Lunch/Dinner', 'Personal items', 'Tips'],
      maxGroupSize: 12,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Tsavo East 2-Day Budget Safari',
      description: 'Experience Kenya\'s largest national park on this affordable safari. See the famous red elephants, visit Mzima Springs, and enjoy excellent game viewing.',
      location: 'Tsavo East, Kenya',
      price: 299,
      duration: '2 Days / 1 Night',
      category: 'adventure',
      isFeatured: false,
      rating: 4.5,
      reviewCount: 321,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Red elephants', 'Mzima Springs', 'Yatta Plateau', 'Budget-friendly', 'Camping option'],
      itinerary: [
        'Day 1: Nairobi to Tsavo, afternoon drive',
        'Day 2: Morning game drive, visit Mzima Springs, return'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees'],
      excluded: ['Tips', 'Drinks', 'Sleeping bag'],
      maxGroupSize: 10,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Lake Nakuru & Naivasha 2-Day Bird & Wildlife Tour',
      description: 'Perfect for bird lovers and wildlife enthusiasts. See flamingos at Lake Nakuru, spot hippos at Lake Naivasha, and visit the Elsamere Conservation Centre.',
      location: 'Nakuru & Naivasha, Kenya',
      price: 349,
      duration: '2 Days / 1 Night',
      category: 'nature',
      isFeatured: false,
      rating: 4.6,
      reviewCount: 267,
      images: ['https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200'],
      highlights: ['Flamingo flocks', 'Rhino sanctuary', 'Lake Naivasha boat ride', 'Elsamere Centre', '450+ bird species'],
      itinerary: [
        'Day 1: Nairobi to Nakuru, game drive',
        'Day 2: Lake Naivasha boat ride, return via Great Rift Valley'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Boat ride'],
      excluded: ['Tips', 'Drinks', 'Optional activities'],
      maxGroupSize: 8,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Samburu 3-Day Remote Safari',
      description: 'Discover Kenya\'s remote north and its unique wildlife. See the Samburu Special Five including reticulated giraffe, Grevy\'s zebra, and gerenuk.',
      location: 'Samburu, Kenya',
      price: 549,
      duration: '3 Days / 2 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 189,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Samburu Special Five', 'Ewaso Ng\'iro River', 'Samburu culture', 'Remote wilderness', 'Elephant project'],
      itinerary: [
        'Day 1: Nairobi to Samburu, afternoon drive',
        'Day 2: Full day game drives',
        'Day 3: Morning drive, visit Samburu village, return'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 6,
      difficulty: 'Moderate',
      ageRestriction: '10+'
    },
    {
      title: 'Hell\'s Gate Cycling & Hiking Adventure',
      description: 'Get active in this unique park where you can cycle and walk among wildlife. Explore dramatic gorges, climb Fischer\'s Tower, and see geothermal features.',
      location: 'Hell\'s Gate, Kenya',
      price: 129,
      duration: 'Full Day',
      category: 'adventure',
      isFeatured: false,
      rating: 4.7,
      reviewCount: 412,
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200'],
      highlights: ['Cycling safari', 'Fischer\'s Tower climb', 'Gorge walk', 'Geothermal spa', 'Budget-friendly'],
      itinerary: [
        'Morning: Bike rental and cycling safari',
        'Afternoon: Hike Fischer\'s Tower or gorge walk',
        'Evening: Return to Nairobi via Great Rift Valley'
      ],
      included: ['Transport', 'Park fees', 'Bike rental', 'Guide'],
      excluded: ['Meals', 'Tips', 'Rock climbing gear'],
      maxGroupSize: 12,
      difficulty: 'Moderate',
      ageRestriction: '12+'
    },

    // Tanzania Tours
    {
      title: 'Serengeti 4-Day Migration Safari',
      description: 'Follow the Great Migration across the endless Serengeti plains. Witness dramatic river crossings, predator action, and incredible wildlife concentrations.',
      location: 'Serengeti, Tanzania',
      price: 1299,
      duration: '4 Days / 3 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 567,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Great Migration', 'Big Five', 'Hot air balloon option', 'Expert guides', 'Tented camps'],
      itinerary: [
        'Day 1: Arusha to Serengeti, afternoon drive',
        'Day 2-3: Full days tracking migration',
        'Day 4: Morning drive, return to Arusha'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Balloon safari'],
      maxGroupSize: 6,
      difficulty: 'Moderate',
      ageRestriction: '12+'
    },
    {
      title: 'Zanzibar 5-Day Spice & Beach Package',
      description: 'Combine culture and relaxation on the Spice Island. Explore historic Stone Town, tour spice farms, and unwind on pristine Nungwi Beach.',
      location: 'Zanzibar, Tanzania',
      price: 799,
      duration: '5 Days / 4 Nights',
      category: 'relaxation',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 423,
      images: ['https://images.unsplash.com/photo-1534764878489-4b832442c3e7?w=1200'],
      highlights: ['Stone Town tour', 'Spice farm visit', 'Nungwi Beach', 'Sunset dhow cruise', 'Prison Island'],
      itinerary: [
        'Day 1: Arrival, Stone Town tour',
        'Day 2: Spice farm tour, transfer to Nungwi',
        'Day 3: Beach relaxation',
        'Day 4: Prison Island, sunset cruise',
        'Day 5: Departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Activities', 'Transfers'],
      excluded: ['Lunch/Dinner', 'Tips', 'Water sports'],
      maxGroupSize: 15,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Kilimanjaro 7-Day Machame Route',
      description: 'Summit Africa\'s highest peak via the scenic Machame Route. This 7-day itinerary offers excellent acclimatization and high success rates.',
      location: 'Kilimanjaro, Tanzania',
      price: 2499,
      duration: '7 Days / 6 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 345,
      images: ['https://images.unsplash.com/photo-1589553416260-f589e4446119?w=1200'],
      highlights: ['Uhuru Peak summit', 'Five climate zones', 'Experienced guides', 'High success rate', 'All equipment included'],
      itinerary: [
        'Day 1: Machame Gate to Machame Camp',
        'Day 2: Machame to Shira Camp',
        'Day 3: Shira to Barranco via Lava Tower',
        'Day 4: Barranco to Karanga Camp',
        'Day 5: Karanga to Barafu Camp',
        'Day 6: Summit Uhuru Peak, descend to Mweka',
        'Day 7: Mweka to Mweka Gate, certificate'
      ],
      included: ['Guides', 'Porters', 'Tents', 'Meals', 'Park fees', 'Equipment'],
      excluded: ['Sleeping bag', 'Tips', 'Personal gear'],
      maxGroupSize: 10,
      difficulty: 'Very Challenging',
      ageRestriction: '16+'
    },
    {
      title: 'Ngorongoro Crater Day Safari',
      description: 'Descend into Africa\'s Garden of Eden on this full-day crater safari. See the Big Five including rare black rhinos in this natural wonder.',
      location: 'Ngorongoro, Tanzania',
      price: 399,
      duration: 'Full Day',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 512,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Crater floor game drive', 'Black rhino', 'Big Five', 'Picnic lunch', 'Maasai visit option'],
      itinerary: [
        'Early morning: Descend into crater',
        'Midday: Picnic lunch at hippo pool',
        'Afternoon: Continue game drive, ascend',
        'Evening: Return to Arusha'
      ],
      included: ['Transport', 'Park fees', 'Picnic lunch', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Accommodation'],
      maxGroupSize: 7,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Tarangire & Manyara 2-Day Safari',
      description: 'Explore two of Tanzania\'s gems. See Tarangire\'s elephant herds and baobabs, then discover Lake Manyara\'s tree-climbing lions and flamingos.',
      location: 'Tarangire & Manyara, Tanzania',
      price: 599,
      duration: '2 Days / 1 Night',
      category: 'adventure',
      isFeatured: false,
      rating: 4.7,
      reviewCount: 287,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Elephant herds', 'Baobab trees', 'Tree-climbing lions', 'Flamingos', 'Great Rift Valley'],
      itinerary: [
        'Day 1: Arusha to Tarangire, game drive',
        'Day 2: Lake Manyara, return to Arusha'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Optional activities'],
      maxGroupSize: 7,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },

    // Egypt Tours
    {
      title: 'Cairo & Pyramids 3-Day Tour',
      description: 'Discover the wonders of ancient Egypt. Visit the Pyramids of Giza, the Sphinx, Egyptian Museum, and explore Islamic and Coptic Cairo.',
      location: 'Cairo & Giza, Egypt',
      price: 449,
      duration: '3 Days / 2 Nights',
      category: 'cultural',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 678,
      images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200'],
      highlights: ['Pyramids of Giza', 'Great Sphinx', 'Egyptian Museum', 'Islamic Cairo', 'Khan el-Khalili'],
      itinerary: [
        'Day 1: Arrival, Giza Pyramids and Sphinx',
        'Day 2: Egyptian Museum, Islamic & Coptic Cairo',
        'Day 3: Khan el-Khalili, departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Entrance fees', 'Guide', 'Transport'],
      excluded: ['Lunch/Dinner', 'Tips', 'Inside pyramid tickets'],
      maxGroupSize: 15,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Luxor 2-Day Ancient Wonders Tour',
      description: 'Explore the world\'s greatest open-air museum. Visit Valley of the Kings, Luxor Temple, Karnak, and witness the treasures of ancient Thebes.',
      location: 'Luxor, Egypt',
      price: 349,
      duration: '2 Days / 1 Night',
      category: 'cultural',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 543,
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200'],
      highlights: ['Valley of the Kings', 'Luxor Temple', 'Karnak Temple', 'Hatshepsut Temple', 'Nile felucca'],
      itinerary: [
        'Day 1: West Bank - Valley of Kings, Hatshepsut Temple',
        'Day 2: East Bank - Karnak, Luxor Temple, felucca ride'
      ],
      included: ['Accommodation', 'Breakfast', 'Entrance fees', 'Guide', 'Felucca ride'],
      excluded: ['Lunch/Dinner', 'Tips', 'Tutankhamun tomb'],
      maxGroupSize: 12,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Red Sea 4-Day Dive & Relax Package',
      description: 'Combine world-class diving with beach relaxation. Explore pristine coral reefs, abundant marine life, and enjoy luxury resort amenities.',
      location: 'Hurghada, Egypt',
      price: 699,
      duration: '4 Days / 3 Nights',
      category: 'relaxation',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 398,
      images: ['https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0?w=1200'],
      highlights: ['Daily diving', 'Coral reefs', 'Beach resort', 'Desert safari option', 'All meals'],
      itinerary: [
        'Day 1: Arrival, resort check-in',
        'Day 2-3: Two dives per day',
        'Day 4: Beach relaxation, departure'
      ],
      included: ['Accommodation', 'All meals', 'Diving equipment', 'Boat trips', 'Guide'],
      excluded: ['Tips', 'Drinks', 'Desert safari'],
      maxGroupSize: 10,
      difficulty: 'Moderate',
      ageRestriction: '16+ (diving)'
    },

    // South Africa Tours
    {
      title: 'Cape Town & Table Mountain 3-Day Tour',
      description: 'Discover the Mother City. Ride the Table Mountain cableway, explore Cape Point, visit penguins at Boulders Beach, and tour wine estates.',
      location: 'Cape Town, South Africa',
      price: 549,
      duration: '3 Days / 2 Nights',
      category: 'cultural',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 456,
      images: ['https://images.unsplash.com/photo-1580060839134-75a5edca387c?w=1200'],
      highlights: ['Table Mountain cableway', 'Cape Point', 'Boulders penguins', 'Wine tasting', 'V&A Waterfront'],
      itinerary: [
        'Day 1: Table Mountain, V&A Waterfront',
        'Day 2: Cape Point, Boulders Beach, wine estates',
        'Day 3: City tour, departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Activities', 'Transport'],
      excluded: ['Lunch/Dinner', 'Tips', 'Wine tasting fees'],
      maxGroupSize: 12,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },
    {
      title: 'Kruger 3-Day Big Five Safari',
      description: 'Experience South Africa\'s premier game reserve. Track the Big Five, enjoy night drives, and stay in comfortable safari lodges.',
      location: 'Kruger Park, South Africa',
      price: 799,
      duration: '3 Days / 2 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 523,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Big Five tracking', 'Night drives', 'Bush walks', 'Safari lodges', 'Expert guides'],
      itinerary: [
        'Day 1: Johannesburg to Kruger, afternoon drive',
        'Day 2: Full day game drives, night drive',
        'Day 3: Morning drive, bush walk, return'
      ],
      included: ['Transport', 'Accommodation', 'Meals', 'Park fees', 'All activities'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 8,
      difficulty: 'Easy',
      ageRestriction: 'All ages'
    },

    // Morocco Tours
    {
      title: 'Marrakech & Sahara 5-Day Adventure',
      description: 'Experience the magic of Morocco. Explore Marrakech\'s medina, cross the High Atlas, and spend a night in a Sahara desert camp.',
      location: 'Marrakech & Sahara, Morocco',
      price: 899,
      duration: '5 Days / 4 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 612,
      images: ['https://images.unsplash.com/photo-1539022113096-15832402a033?w=1200'],
      highlights: ['Marrakech medina', 'High Atlas crossing', 'Ait Ben Haddou', 'Sahara camel trek', 'Desert camp'],
      itinerary: [
        'Day 1: Marrakech medina tour',
        'Day 2: Cross High Atlas to Dades',
        'Day 3: To Merzouga, camel trek to camp',
        'Day 4: Return via Todra Gorges',
        'Day 5: Back to Marrakech'
      ],
      included: ['Accommodation', 'Breakfast', 'Dinners', 'Transport', 'Camel trek'],
      excluded: ['Lunch', 'Tips', 'Drinks'],
      maxGroupSize: 10,
      difficulty: 'Moderate',
      ageRestriction: '10+'
    },

    // More African Tours
    {
      title: 'Victoria Falls 3-Day Adventure',
      description: 'Experience the Smoke That Thunders. Tour the falls, try white water rafting, and enjoy sunset cruises on the Zambezi.',
      location: 'Victoria Falls, Zimbabwe',
      price: 649,
      duration: '3 Days / 2 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 387,
      images: ['https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200'],
      highlights: ['Falls tour', 'White water rafting', 'Sunset cruise', 'Helicopter flight option', 'Bungee jumping'],
      itinerary: [
        'Day 1: Arrival, falls tour',
        'Day 2: White water rafting or activities',
        'Day 3: Sunset cruise, departure'
      ],
      included: ['Accommodation', 'Breakfast', 'Falls tour', 'Rafting', 'Transfers'],
      excluded: ['Lunch/Dinner', 'Tips', 'Optional activities'],
      maxGroupSize: 12,
      difficulty: 'Moderate',
      ageRestriction: '16+ (rafting)'
    },
    {
      title: 'Okavango Delta 4-Day Mokoro Safari',
      description: 'Glide through the world\'s largest inland delta in traditional mokoros. Spot elephants, lions, and rare birds in this pristine wilderness.',
      location: 'Okavango Delta, Botswana',
      price: 1899,
      duration: '4 Days / 3 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 234,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'],
      highlights: ['Mokoro safaris', 'Big Five', 'Luxury tents', 'Expert guides', 'Pristine wilderness'],
      itinerary: [
        'Day 1: Maun to delta, mokoro safari',
        'Day 2-3: Game drives and mokoro excursions',
        'Day 4: Morning safari, return to Maun'
      ],
      included: ['Light aircraft transfers', 'Accommodation', 'All meals', 'Activities', 'Guides'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 6,
      difficulty: 'Easy',
      ageRestriction: '12+'
    },
    {
      title: 'Rwanda Gorilla Trekking 3-Day Experience',
      description: 'Life-changing encounter with mountain gorillas. Trek through volcanic forests and spend an hour with these gentle giants.',
      location: 'Volcanoes National Park, Rwanda',
      price: 2499,
      duration: '3 Days / 2 Nights',
      category: 'adventure',
      isFeatured: true,
      rating: 5.0,
      reviewCount: 189,
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200'],
      highlights: ['Gorilla trekking', 'Golden monkeys', 'Dian Fossey site', 'Luxury lodges', 'Conservation'],
      itinerary: [
        'Day 1: Kigali to Volcanoes NP',
        'Day 2: Gorilla trekking (permit included)',
        'Day 3: Golden monkey tracking, return'
      ],
      included: ['Gorilla permit', 'Accommodation', 'Meals', 'Transport', 'Guides'],
      excluded: ['Tips', 'Drinks', 'Personal items'],
      maxGroupSize: 8,
      difficulty: 'Challenging',
      ageRestriction: '15+'
    }
  ];

  console.log('🎯 Seeding tours...');

  // Get destinations for linking
  const maraDest = await Destination.findOne({ name: 'Maasai Mara' });
  const dianiDest = await Destination.findOne({ name: 'Diani Beach' });
  const mkDest = await Destination.findOne({ name: 'Mount Kenya' });
  const nairobiDest = await Destination.findOne({ name: 'Nairobi' });
  const amboseliDest = await Destination.findOne({ name: 'Amboseli National Park' });
  const lamuDest = await Destination.findOne({ name: 'Lamu Island' });
  const tsavoDest = await Destination.findOne({ name: 'Tsavo National Parks' });
  const nakuruDest = await Destination.findOne({ name: 'Lake Nakuru' });
  const samburuDest = await Destination.findOne({ name: 'Samburu National Reserve' });
  const hellsGateDest = await Destination.findOne({ name: 'Hell\'s Gate National Park' });
  const serengetiDest = await Destination.findOne({ name: 'Serengeti National Park' });
  const zanzibarDest = await Destination.findOne({ name: 'Zanzibar' });
  const kilimanjaroDest = await Destination.findOne({ name: 'Mount Kilimanjaro' });
  const ngorongoroDest = await Destination.findOne({ name: 'Ngorongoro Crater' });
  const tarangireDest = await Destination.findOne({ name: 'Tarangire National Park' });
  const pyramidsDest = await Destination.findOne({ name: 'Pyramids of Giza' });
  const luxorDest = await Destination.findOne({ name: 'Luxor Temple & Valley of the Kings' });
  const redSeaDest = await Destination.findOne({ name: 'Red Sea Riviera' });
  const tableMountainDest = await Destination.findOne({ name: 'Table Mountain' });
  const krugerDest = await Destination.findOne({ name: 'Kruger National Park' });
  const marrakechDest = await Destination.findOne({ name: 'Marrakech Medina' });
  const victoriaFallsDest = await Destination.findOne({ name: 'Victoria Falls' });
  const okavangoDest = await Destination.findOne({ name: 'Okavango Delta' });
  const rwandaDest = await Destination.findOne({ name: 'Rwanda Volcanoes National Park' });

  const tourDestMap = {
    'Maasai Mara 3-Day Safari Adventure': maraDest?._id,
    'Diani Beach 5-Day Relaxation Package': dianiDest?._id,
    'Mount Kenya 4-Day Trek to Point Lenana': mkDest?._id,
    'Nairobi City & Wildlife Day Tour': nairobiDest?._id,
    'Amboseli Elephant & Kilimanjaro Safari': amboseliDest?._id,
    'Lamu Island Cultural & Beach Escape': lamuDest?._id,
    'Tsavo East 2-Day Budget Safari': tsavoDest?._id,
    'Lake Nakuru & Naivasha 2-Day Bird & Wildlife Tour': nakuruDest?._id,
    'Samburu 3-Day Remote Safari': samburuDest?._id,
    'Hell\'s Gate Cycling & Hiking Adventure': hellsGateDest?._id,
    'Serengeti 4-Day Migration Safari': serengetiDest?._id,
    'Zanzibar 5-Day Spice & Beach Package': zanzibarDest?._id,
    'Kilimanjaro 7-Day Machame Route': kilimanjaroDest?._id,
    'Ngorongoro Crater Day Safari': ngorongoroDest?._id,
    'Tarangire & Manyara 2-Day Safari': tarangireDest?._id,
    'Cairo & Pyramids 3-Day Tour': pyramidsDest?._id,
    'Luxor 2-Day Ancient Wonders Tour': luxorDest?._id,
    'Red Sea 4-Day Dive & Relax Package': redSeaDest?._id,
    'Cape Town & Table Mountain 3-Day Tour': tableMountainDest?._id,
    'Kruger 3-Day Big Five Safari': krugerDest?._id,
    'Marrakech & Sahara 5-Day Adventure': marrakechDest?._id,
    'Victoria Falls 3-Day Adventure': victoriaFallsDest?._id,
    'Okavango Delta 4-Day Mokoro Safari': okavangoDest?._id,
    'Rwanda Gorilla Trekking 3-Day Experience': rwandaDest?._id
  };

  tours.forEach(tour => {
    if (tourDestMap[tour.title]) {
      tour.destination = tourDestMap[tour.title];
    }
  });

  const tourOps = tours.map(t => ({
    updateOne: {
      filter: { title: t.title },
      update: { $set: t },
      upsert: true
    }
  }));

  const tourRes = await Tour.bulkWrite(tourOps);
  console.log(`✅ Seeded ${tourRes.modifiedCount || tourRes.upsertedCount} tours\n`);

  console.log('🎉 Full data seeding complete!');
  console.log('🇰🇪 Kenya destinations prioritized (1-10)');
  console.log('🌍 Africa-first approach: 30+ destinations');
  console.log('🦁 Wildlife experiences featured');
  console.log('🏛️ Cultural heritage included');
  console.log('\n✅ Run the frontend to see the results!');

  process.exit(0);
}

seedFullData().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

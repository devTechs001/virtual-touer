#!/usr/bin/env node
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';

dotenv.config();

async function seed() {
  await connectDB();

  // KENYA FIRST - East Africa focus
  const destinations = [
    // ==================== KENYA ====================
    {
      name: 'Maasai Mara',
      description: 'World-famous wildlife reserve known for the Great Migration and Big Five safari experiences.',
      shortDescription: 'Kenya\'s premier wildlife destination',
      location: {
        type: 'Point',
        coordinates: [35.1431, -1.4061],
        city: 'Maasai Mara',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Great Migration', 'Big Five', 'Maasai Culture', 'Hot Air Balloon Safari'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'July-October (Migration)',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: true,
      priority: 1
    },
    {
      name: 'Diani Beach',
      description: 'Pristine white sand beach on the Indian Ocean coast, perfect for relaxation and water sports.',
      shortDescription: 'Kenya\'s tropical paradise',
      location: {
        type: 'Point',
        coordinates: [39.5668, -4.2833],
        city: 'Diani',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['White Sand Beaches', 'Coral Reefs', 'Water Sports', 'Colobus Monkeys'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'October-April',
      images: ['https://images.unsplash.com/photo-1523805009345-7448845a9e53'],
      isFeatured: true,
      priority: 2
    },
    {
      name: 'Mount Kenya',
      description: 'Africa\'s second-highest mountain, offering challenging climbs and stunning alpine scenery.',
      shortDescription: 'Africa\'s second highest peak',
      location: {
        type: 'Point',
        coordinates: [37.3081, -0.1521],
        city: 'Nanyuki',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Point Lenana', 'Alpine Scenery', 'Unique Wildlife', 'Rock Climbing'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'January-March, June-October',
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'],
      isFeatured: true,
      priority: 3
    },
    {
      name: 'Nairobi',
      description: 'Kenya\'s vibrant capital, blending urban energy with wildlife at Nairobi National Park.',
      shortDescription: 'Silicon Savannah capital',
      location: {
        type: 'Point',
        coordinates: [36.8219, -1.2921],
        city: 'Nairobi',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Nairobi National Park', 'Giraffe Centre', 'David Sheldrick Centre', 'Karen Blixen Museum'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'Year-round',
      images: ['https://images.unsplash.com/photo-1489743378969-2c0bb7d910f6'],
      isFeatured: true,
      priority: 4
    },
    {
      name: 'Amboseli National Park',
      description: 'Famous for large elephant herds and stunning views of Mount Kilimanjaro.',
      shortDescription: 'Home of the African elephant',
      location: {
        type: 'Point',
        coordinates: [37.2606, -2.6527],
        city: 'Amboseli',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Elephant Herds', 'Kilimanjaro Views', 'Bird Watching', 'Maasai Villages'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'June-October, January-February',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: true,
      priority: 5
    },
    {
      name: 'Lamu Island',
      description: 'UNESCO World Heritage Site with Swahili architecture and car-free streets.',
      shortDescription: 'Historic Swahili island',
      location: {
        type: 'Point',
        coordinates: [40.9020, -2.2717],
        city: 'Lamu',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Old Town', 'Donkey Rides', 'Swahili Culture', 'Pristine Beaches'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'October-May',
      images: ['https://images.unsplash.com/photo-1590422749830-6a68f3d8e9c0'],
      isFeatured: false,
      priority: 6
    },
    {
      name: 'Lake Nakuru',
      description: 'Famous for flamingo populations and rhino sanctuary.',
      shortDescription: 'Flamingo paradise',
      location: {
        type: 'Point',
        coordinates: [36.0667, -0.3667],
        city: 'Nakuru',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Flamingos', 'Rhino Sanctuary', 'Baboon Cliff', 'Waterfalls'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'Year-round',
      images: ['https://images.unsplash.com/photo-1551009175-157a718f8a73'],
      isFeatured: false,
      priority: 7
    },
    {
      name: 'Tsavo National Parks',
      description: 'Kenya\'s largest wildlife sanctuary, split into Tsavo East and West.',
      shortDescription: 'Kenya\'s largest wilderness',
      location: {
        type: 'Point',
        coordinates: [38.5000, -3.0000],
        city: 'Tsavo',
        country: 'Kenya',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Red Elephants', 'Mzima Springs', 'Lugard Falls', 'Vast Wilderness'],
      language: 'Swahili, English',
      currency: 'KES',
      bestTimeToVisit: 'June-October',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: false,
      priority: 8
    },

    // ==================== TANZANIA ====================
    {
      name: 'Serengeti',
      description: 'Legendary savanna ecosystem hosting the greatest wildlife show on Earth.',
      shortDescription: 'The Great Migration home',
      location: {
        type: 'Point',
        coordinates: [34.8333, -2.3333],
        city: 'Serengeti',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Great Migration', 'Big Five', 'Hot Air Balloon', 'Endless Plains'],
      language: 'Swahili, English',
      currency: 'TZS',
      bestTimeToVisit: 'June-October',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: true,
      priority: 10
    },
    {
      name: 'Zanzibar',
      description: 'Spice Island with historic Stone Town and pristine beaches.',
      shortDescription: 'Spice island paradise',
      location: {
        type: 'Point',
        coordinates: [39.2083, -6.1659],
        city: 'Stone Town',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Stone Town', 'Spice Tours', 'Prison Island', 'Nungwi Beach'],
      language: 'Swahili, English',
      currency: 'TZS',
      bestTimeToVisit: 'June-October',
      images: ['https://images.unsplash.com/photo-1534764878489-4b832442c3e7'],
      isFeatured: true,
      priority: 11
    },
    {
      name: 'Mount Kilimanjaro',
      description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain.',
      shortDescription: 'Roof of Africa',
      location: {
        type: 'Point',
        coordinates: [37.3556, -3.0674],
        city: 'Moshi',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Uhuru Peak', 'Glaciers', 'Five Climate Zones', 'Sunrise Summit'],
      language: 'Swahili, English',
      currency: 'TZS',
      bestTimeToVisit: 'January-March, June-October',
      images: ['https://images.unsplash.com/photo-1589553416260-f589e4446119'],
      isFeatured: true,
      priority: 12
    },
    {
      name: 'Ngorongoro Crater',
      description: 'World\'s largest inactive volcanic caldera with incredible wildlife density.',
      shortDescription: 'Garden of Eden',
      location: {
        type: 'Point',
        coordinates: [35.5000, -3.2000],
        city: 'Ngorongoro',
        country: 'Tanzania',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Crater Floor', 'Big Five', 'Maasai Culture', 'Lake Magadi'],
      language: 'Swahili, English',
      currency: 'TZS',
      bestTimeToVisit: 'Year-round',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: true,
      priority: 13
    },

    // ==================== UGANDA ====================
    {
      name: 'Bwindi Impenetrable Forest',
      description: 'Home to half of the world\'s remaining mountain gorillas.',
      shortDescription: 'Mountain gorilla sanctuary',
      location: {
        type: 'Point',
        coordinates: [29.6667, -0.9167],
        city: 'Kanungu',
        country: 'Uganda',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Gorilla Trekking', 'Bird Watching', 'Batwa Culture', 'Waterfalls'],
      language: 'English, Swahili',
      currency: 'UGX',
      bestTimeToVisit: 'June-August, December-February',
      images: ['https://images.unsplash.com/photo-1577977449989-9c4a4e4d6b5a'],
      isFeatured: true,
      priority: 20
    },
    {
      name: 'Murchison Falls',
      description: 'The Nile forces through a narrow gorge creating Africa\'s most powerful waterfall.',
      shortDescription: 'Nile\'s dramatic plunge',
      location: {
        type: 'Point',
        coordinates: [31.8833, 2.2833],
        city: 'Masindi',
        country: 'Uganda',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['The Falls', 'Boat Safari', 'Big Five', 'Chimpanzees'],
      language: 'English, Swahili',
      currency: 'UGX',
      bestTimeToVisit: 'December-February, June-September',
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'],
      isFeatured: false,
      priority: 21
    },

    // ==================== RWANDA ====================
    {
      name: 'Volcanoes National Park',
      description: 'Volcanic mountains home to endangered mountain gorillas.',
      shortDescription: 'Land of a Thousand Hills',
      location: {
        type: 'Point',
        coordinates: [29.5000, -1.4833],
        city: 'Musanze',
        country: 'Rwanda',
        continent: 'Africa',
        region: 'East Africa'
      },
      highlights: ['Gorilla Trekking', 'Golden Monkeys', 'Dian Fossey Tomb', 'Volcano Hiking'],
      language: 'Kinyarwanda, English, French',
      currency: 'RWF',
      bestTimeToVisit: 'June-September, December-February',
      images: ['https://images.unsplash.com/photo-1577977449989-9c4a4e4d6b5a'],
      isFeatured: true,
      priority: 30
    },

    // ==================== SOUTH AFRICA ====================
    {
      name: 'Cape Town',
      description: 'Stunning coastal city beneath Table Mountain with rich history.',
      shortDescription: 'Mother City beauty',
      location: {
        type: 'Point',
        coordinates: [18.4241, -33.9249],
        city: 'Cape Town',
        country: 'South Africa',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Table Mountain', 'Robben Island', 'V&A Waterfront', 'Cape Point'],
      language: 'English, Afrikaans, Xhosa',
      currency: 'ZAR',
      bestTimeToVisit: 'November-March',
      images: ['https://images.unsplash.com/photo-1580060839134-75a5edca2e99'],
      isFeatured: true,
      priority: 40
    },
    {
      name: 'Kruger National Park',
      description: 'One of Africa\'s largest game reserves with incredible wildlife diversity.',
      shortDescription: 'Big Five kingdom',
      location: {
        type: 'Point',
        coordinates: [31.5000, -24.0000],
        city: 'Skukuza',
        country: 'South Africa',
        continent: 'Africa',
        region: 'Southern Africa'
      },
      highlights: ['Big Five', 'Luxury Lodges', 'Bird Watching', 'Night Drives'],
      language: 'English',
      currency: 'ZAR',
      bestTimeToVisit: 'May-September',
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      isFeatured: true,
      priority: 41
    },

    // ==================== EGYPT ====================
    {
      name: 'Pyramids of Giza',
      description: 'Ancient wonders of the world, the last surviving monument of the Seven Wonders.',
      shortDescription: 'Last Ancient Wonder',
      location: {
        type: 'Point',
        coordinates: [31.1342, 29.9792],
        city: 'Giza',
        country: 'Egypt',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Great Pyramid', 'Sphinx', 'Solar Boat Museum', 'Sound & Light Show'],
      language: 'Arabic',
      currency: 'EGP',
      bestTimeToVisit: 'October-April',
      images: ['https://images.unsplash.com/photo-1534764878489-4b832442c3e7'],
      isFeatured: true,
      priority: 50
    },
    {
      name: 'Luxor',
      description: 'World\'s greatest open-air museum with ancient temples and tombs.',
      shortDescription: 'Ancient Thebes',
      location: {
        type: 'Point',
        coordinates: [32.7000, 25.7000],
        city: 'Luxor',
        country: 'Egypt',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Valley of the Kings', 'Karnak Temple', 'Luxor Temple', 'Hot Air Balloon'],
      language: 'Arabic',
      currency: 'EGP',
      bestTimeToVisit: 'October-April',
      images: ['https://images.unsplash.com/photo-1568684343804-d9f4b9c7e6f8'],
      isFeatured: true,
      priority: 51
    },

    // ==================== MOROCCO ====================
    {
      name: 'Marrakech',
      description: 'Vibrant imperial city with bustling souks and stunning architecture.',
      shortDescription: 'Red City magic',
      location: {
        type: 'Point',
        coordinates: [-7.9811, 31.6295],
        city: 'Marrakech',
        country: 'Morocco',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace', 'Souks'],
      language: 'Arabic, Berber',
      currency: 'MAD',
      bestTimeToVisit: 'March-May, September-November',
      images: ['https://images.unsplash.com/photo-1539020140153-e479b8c22e70'],
      isFeatured: true,
      priority: 60
    },
    {
      name: 'Sahara Desert',
      description: 'Vast desert landscape with towering dunes and Berber culture.',
      shortDescription: 'Golden dunes adventure',
      location: {
        type: 'Point',
        coordinates: [-4.0000, 31.0000],
        city: 'Merzouga',
        country: 'Morocco',
        continent: 'Africa',
        region: 'North Africa'
      },
      highlights: ['Camel Trekking', 'Desert Camps', 'Stargazing', 'Erg Chebbi Dunes'],
      language: 'Arabic, Berber',
      currency: 'MAD',
      bestTimeToVisit: 'October-April',
      images: ['https://images.unsplash.com/photo-1539650116455-251d93d5c933'],
      isFeatured: true,
      priority: 61
    },

    // ==================== MYSTERIOUS PLACES ====================
    {
      name: 'Socotra Island',
      description: 'Remote Yemeni island with alien-like Dragon\'s Blood trees.',
      shortDescription: 'Alien flora paradise',
      location: {
        type: 'Point',
        coordinates: [53.9939, 12.4634],
        city: 'Hadibu',
        country: 'Yemen',
        continent: 'Asia',
        region: 'Arabian Sea'
      },
      highlights: ['Dragon\'s Blood Trees', 'White Beaches', 'Endemic Species', 'Caves'],
      language: 'Arabic',
      currency: 'YER',
      bestTimeToVisit: 'October-April',
      images: ['https://images.unsplash.com/photo-1565118531796-763e50a18b63'],
      isFeatured: false,
      priority: 100
    },
    {
      name: 'Easter Island',
      description: 'Remote Polynesian island famous for mysterious Moai statues.',
      shortDescription: 'Moai mysteries',
      location: {
        type: 'Point',
        coordinates: [-109.3497, -27.1127],
        city: 'Hanga Roa',
        country: 'Chile',
        continent: 'South America',
        region: 'Polynesia'
      },
      highlights: ['Moai Statues', 'Rano Raraku', 'Orongo Village', 'Sunset at Tahai'],
      language: 'Spanish, Rapa Nui',
      currency: 'CLP',
      bestTimeToVisit: 'April-June, October-December',
      images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090'],
      isFeatured: false,
      priority: 101
    },
    {
      name: 'Petra',
      description: 'Ancient Nabatean city carved into rose-red cliffs.',
      shortDescription: 'Rose City wonder',
      location: {
        type: 'Point',
        coordinates: [35.4444, 30.3285],
        city: 'Wadi Musa',
        country: 'Jordan',
        continent: 'Asia',
        region: 'Middle East'
      },
      highlights: ['The Treasury', 'Monastery', 'Siq', 'Royal Tombs'],
      language: 'Arabic',
      currency: 'JOD',
      bestTimeToVisit: 'March-May, September-November',
      images: ['https://images.unsplash.com/photo-1579606036356-74d26d9e0e8e'],
      isFeatured: true,
      priority: 102
    },
    {
      name: 'Machu Picchu',
      description: 'Lost city of the Incas perched high in the Andes.',
      shortDescription: 'Incan citadel in the clouds',
      location: {
        type: 'Point',
        coordinates: [-72.5450, -13.1631],
        city: 'Aguas Calientes',
        country: 'Peru',
        continent: 'South America',
        region: 'Andes'
      },
      highlights: ['Sun Gate', 'Temple of the Sun', 'Huayna Picchu', 'Llamas'],
      language: 'Spanish, Quechua',
      currency: 'PEN',
      bestTimeToVisit: 'May-September',
      images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377'],
      isFeatured: true,
      priority: 103
    },
    {
      name: 'Angkor Wat',
      description: 'Largest religious monument in the world, a masterpiece of Khmer architecture.',
      shortDescription: 'Temple city wonder',
      location: {
        type: 'Point',
        coordinates: [103.8670, 13.4125],
        city: 'Siem Reap',
        country: 'Cambodia',
        continent: 'Asia',
        region: 'Southeast Asia'
      },
      highlights: ['Sunrise at Angkor', 'Bayon Temple', 'Ta Prohm', 'Angkor Thom'],
      language: 'Khmer',
      currency: 'KHR',
      bestTimeToVisit: 'November-March',
      images: ['https://images.unsplash.com/photo-1565060169194-808b25f283db'],
      isFeatured: true,
      priority: 104
    }
  ];

  // Seed destinations
  const destOps = destinations.map(d => ({
    updateOne: {
      filter: { name: d.name },
      update: { $set: d },
      upsert: true
    }
  }));
  
  const destRes = await Destination.bulkWrite(destOps);
  console.log('✅ Destinations seeded:', destRes.result || destRes);

  // Seed featured tours for Kenya (priority destinations)
  const kenyaTours = [
    {
      title: 'Maasai Mara Safari Experience',
      description: 'Full day game drive through the world-famous Maasai Mara National Reserve.',
      location: 'Maasai Mara, Kenya',
      destination: null, // Will be set after destinations are created
      price: 299,
      duration: 'Full Day (8 hours)',
      category: 'adventure',
      isFeatured: true,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801'],
      highlights: ['Big Five Game Drive', 'Picnic Lunch', 'Maasai Village Visit', 'Professional Guide']
    },
    {
      title: 'Diani Beach Paradise Tour',
      description: 'Relax on one of Africa\'s most beautiful beaches with crystal clear waters.',
      location: 'Diani Beach, Kenya',
      destination: null,
      price: 199,
      duration: '3 Days',
      category: 'relaxation',
      isFeatured: true,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1523805009345-7448845a9e53'],
      highlights: ['White Sand Beaches', 'Snorkeling', 'Swahili Cuisine', 'Sunset Dhow Cruise']
    },
    {
      title: 'Mount Kenya Climbing Adventure',
      description: 'Trek to Point Lenana on Africa\'s second-highest mountain.',
      location: 'Mount Kenya, Kenya',
      destination: null,
      price: 450,
      duration: '4 Days',
      category: 'adventure',
      isFeatured: true,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'],
      highlights: ['Point Lenana Summit', 'Alpine Scenery', 'Professional Guides', 'All Meals Included']
    },
    {
      title: 'Nairobi City & Wildlife Tour',
      description: 'Explore Kenya\'s vibrant capital and its unique urban wildlife.',
      location: 'Nairobi, Kenya',
      destination: null,
      price: 149,
      duration: 'Full Day',
      category: 'cultural',
      isFeatured: true,
      rating: 4.6,
      images: ['https://images.unsplash.com/photo-1489743378969-2c0bb7d910f6'],
      highlights: ['Nairobi National Park', 'Giraffe Centre', 'Sheldrick Elephant Orphanage', 'City Tour']
    }
  ];

  // Get Maasai Mara destination for tour linking
  const maraDestination = await Destination.findOne({ name: 'Maasai Mara' });
  const diDestination = await Destination.findOne({ name: 'Diani Beach' });
  const mkDestination = await Destination.findOne({ name: 'Mount Kenya' });
  const nairobiDestination = await Destination.findOne({ name: 'Nairobi' });

  if (maraDestination) kenyaTours[0].destination = maraDestination._id;
  if (diDestination) kenyaTours[1].destination = diDestination._id;
  if (mkDestination) kenyaTours[2].destination = mkDestination._id;
  if (nairobiDestination) kenyaTours[3].destination = nairobiDestination._id;

  const tourOps = kenyaTours.map(t => ({
    updateOne: {
      filter: { title: t.title },
      update: { $set: t },
      upsert: true
    }
  }));

  const tourRes = await Tour.bulkWrite(tourOps);
  console.log('✅ Featured Kenya tours seeded:', tourRes.result || tourRes);

  console.log('\n🎉 Africa-First seeding complete!');
  console.log('🇰🇪 Kenya destinations prioritized');
  console.log('🌍 East Africa focus maintained');
  console.log('🦁 Wildlife experiences highlighted');
  
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

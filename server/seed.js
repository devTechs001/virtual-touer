import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Tour, Destination } from './models/index.js';

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'devtechs842@gmail.com',
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
  {
    name: 'Demo User',
    email: 'demo@virtualtourist.com',
    password: 'Demo123!',
    role: 'user',
    isVerified: true,
  },
];

// Sample destinations
const destinations = [
  {
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    description: 'The City of Light awaits with iconic landmarks and world-class museums.',
    shortDescription: 'Iconic landmarks and world-class museums',
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', caption: 'Paris' }
    ],
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566],
      city: 'Paris',
      country: 'France',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    description: 'Experience the perfect blend of ancient traditions and cutting-edge technology.',
    shortDescription: 'Ancient traditions meet cutting-edge technology',
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Tokyo' }
    ],
    location: {
      type: 'Point',
      coordinates: [139.6917, 35.6895],
      city: 'Tokyo',
      country: 'Japan',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'New York',
    country: 'USA',
    continent: 'North America',
    description: 'The city that never sleeps offers endless entertainment and culture.',
    shortDescription: 'Endless entertainment and culture',
    images: [
      { url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', caption: 'New York' }
    ],
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128],
      city: 'New York',
      country: 'USA',
      continent: 'North America'
    },
    featured: true
  },
  // AFRICA DESTINATIONS
  {
    name: 'Pyramids of Giza',
    country: 'Egypt',
    continent: 'Africa',
    description: 'Stand before the last remaining wonder of the ancient world. The Great Pyramid of Giza, built over 4,500 years ago, continues to mystify archaeologists and visitors alike with its precise construction and hidden chambers.',
    shortDescription: 'The last remaining wonder of the ancient world',
    images: [
      { url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800', caption: 'Pyramids of Giza' },
      { url: 'https://images.unsplash.com/photo-1539650116455-251d93d5c933?w=800', caption: 'Great Sphinx' }
    ],
    location: {
      type: 'Point',
      coordinates: [31.1342, 29.9792],
      city: 'Giza',
      country: 'Egypt',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Serengeti National Park',
    country: 'Tanzania',
    continent: 'Africa',
    description: 'Witness the greatest wildlife spectacle on Earth - the Great Migration. Over 1.5 million wildebeest and 250,000 zebras traverse these endless plains in search of fresh grazing, followed by Africa\'s fiercest predators.',
    shortDescription: 'Home to the Great Migration',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Serengeti Wildlife' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'African Safari' }
    ],
    location: {
      type: 'Point',
      coordinates: [34.8333, -2.3333],
      city: 'Serengeti',
      country: 'Tanzania',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Victoria Falls',
    country: 'Zimbabwe/Zambia',
    continent: 'Africa',
    description: 'Experience "The Smoke That Thunders" - one of the world\'s largest and most spectacular waterfalls. The mighty Zambezi River plunges 108 meters into a narrow gorge, creating a mist visible from 20 kilometers away.',
    shortDescription: 'The Smoke That Thunders',
    images: [
      { url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800', caption: 'Victoria Falls' },
      { url: 'https://images.unsplash.com/photo-1627894483216-815c3e6ca6ac?w=800', caption: 'Rainbow at Falls' }
    ],
    location: {
      type: 'Point',
      coordinates: [25.8572, -17.9243],
      city: 'Victoria Falls',
      country: 'Zimbabwe',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Marrakech Medina',
    country: 'Morocco',
    continent: 'Africa',
    description: 'Get lost in the labyrinthine souks and alleys of Marrakech\'s historic medina. From the bustling Jemaa el-Fnaa square to the ornate Bahia Palace, experience the magic of Morocco\'s imperial city.',
    shortDescription: 'The Red City\'s ancient heart',
    images: [
      { url: 'https://images.unsplash.com/photo-1539020140153-e479b6c60021?w=800', caption: 'Marrakech Souk' },
      { url: 'https://images.unsplash.com/photo-1597211833158-e6c4e6d47c2e?w=800', caption: 'Jemaa el-Fnaa' }
    ],
    location: {
      type: 'Point',
      coordinates: [-7.9811, 31.6295],
      city: 'Marrakech',
      country: 'Morocco',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Table Mountain',
    country: 'South Africa',
    continent: 'Africa',
    description: 'Ride the cableway to the top of Cape Town\'s iconic flat-topped mountain. At 1,086 meters, enjoy panoramic views of the city, Atlantic Ocean, and the unique fynbos vegetation found nowhere else on Earth.',
    shortDescription: 'Cape Town\'s iconic landmark',
    images: [
      { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca387c?w=800', caption: 'Table Mountain' },
      { url: 'https://images.unsplash.com/photo-1596395819057-d37f7ca67250?w=800', caption: 'Cape Town View' }
    ],
    location: {
      type: 'Point',
      coordinates: [18.4097, -33.9628],
      city: 'Cape Town',
      country: 'South Africa',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Petra',
    country: 'Jordan',
    continent: 'Asia',
    description: 'Walk through the Siq to reveal the Treasury, the iconic facade carved into rose-red cliffs. This ancient Nabatean city, hidden for centuries, reveals astonishing architecture and engineering from 300 BC.',
    shortDescription: 'The Rose-Red City carved from stone',
    images: [
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'The Treasury' },
      { url: 'https://images.unsplash.com/photo-1589133459719-7c2dc2e10d1d?w=800', caption: 'Petra Siq' }
    ],
    location: {
      type: 'Point',
      coordinates: [35.4444, 30.3285],
      city: 'Wadi Musa',
      country: 'Jordan',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Sahara Desert',
    country: 'Morocco',
    continent: 'Africa',
    description: 'Journey into the world\'s largest hot desert. Experience the golden dunes of Erg Chebbi, spend a night under the stars in a Berber camp, and witness one of Earth\'s most extreme and beautiful landscapes.',
    shortDescription: 'Journey into the world\'s largest hot desert',
    images: [
      { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800', caption: 'Sahara Dunes' },
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', caption: 'Desert Sunset' }
    ],
    location: {
      type: 'Point',
      coordinates: [-4.0000, 31.0000],
      city: 'Merzouga',
      country: 'Morocco',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Lalibela Rock Churches',
    country: 'Ethiopia',
    continent: 'Africa',
    description: 'Marvel at the 12 medieval monolithic churches carved from solid rock in the 12th century. This UNESCO World Heritage site remains an active pilgrimage destination for Ethiopian Orthodox Christians.',
    shortDescription: 'Medieval churches carved from solid rock',
    images: [
      { url: 'https://images.unsplash.com/photo-1627894483216-815c3e6d47c2e?w=800', caption: 'Rock Church' },
      { url: 'https://images.unsplash.com/photo-1578321714369-8c8f0b7f8d8e?w=800', caption: 'Lalibela Cross' }
    ],
    location: {
      type: 'Point',
      coordinates: [39.0472, 12.0319],
      city: 'Lalibela',
      country: 'Ethiopia',
      continent: 'Africa'
    },
    featured: false
  },
  {
    name: 'Okavango Delta',
    country: 'Botswana',
    continent: 'Africa',
    description: 'Explore the world\'s largest inland delta, where the Okavango River creates a lush paradise in the Kalahari Desert. Navigate traditional mokoros and spot elephants, lions, and rare bird species.',
    shortDescription: 'The world\'s largest inland delta',
    images: [
      { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', caption: 'Okavango Waterways' },
      { url: 'https://images.unsplash.com/photo-1544238458-0a9a806a7e77?w=800', caption: 'Delta Wildlife' }
    ],
    location: {
      type: 'Point',
      coordinates: [22.7500, -19.5000],
      city: 'Okavango',
      country: 'Botswana',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Timbuktu',
    country: 'Mali',
    continent: 'Africa',
    description: 'Visit the legendary city at the edge of the Sahara, once a center of Islamic learning and trade. Explore ancient mosques and manuscripts that tell the story of this mysterious trading hub.',
    shortDescription: 'The legendary city of gold',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Sankore Mosque' },
      { url: 'https://images.unsplash.com/photo-1578321714369-8c8f0b7f8d8e?w=800', caption: 'Ancient Manuscripts' }
    ],
    location: {
      type: 'Point',
      coordinates: [-3.0074, 16.7666],
      city: 'Timbuktu',
      country: 'Mali',
      continent: 'Africa'
    },
    featured: false
  },
  // ICELAND DESTINATIONS
  {
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Discover the world\'s northernmost capital, a vibrant city powered by geothermal energy. From the colorful streets to the iconic Hallgrímskirkja church, experience Icelandic culture and design.',
    shortDescription: 'The world\'s northernmost capital',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Reykjavik Harbor' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Hallgrímskirkja' }
    ],
    location: {
      type: 'Point',
      coordinates: [-21.8174, 64.1466],
      city: 'Reykjavik',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Blue Lagoon',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Soak in the milky-blue geothermal waters of Iceland\'s most famous spa. Rich in silica and minerals, this otherworldly lagoon offers relaxation surrounded by black lava fields.',
    shortDescription: 'Geothermal spa in otherworldly surroundings',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Blue Lagoon' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Geothermal Waters' }
    ],
    location: {
      type: 'Point',
      coordinates: [-22.4496, 63.8804],
      city: 'Grindavík',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Northern Lights (Aurora Borealis)',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Witness nature\'s most spectacular light show. When solar particles collide with Earth\'s atmosphere, they create dancing curtains of green, purple, and pink light across the Arctic sky.',
    shortDescription: 'Nature\'s most spectacular light show',
    images: [
      { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', caption: 'Aurora Display' },
      { url: 'https://images.unsplash.com/photo-1483347753191-1a5c99004f67?w=800', caption: 'Green Aurora' }
    ],
    location: {
      type: 'Point',
      coordinates: [-18.0000, 65.0000],
      city: 'Various',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Jökulsárlón Glacier Lagoon',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Watch icebergs calve from Vatnajökull glacier and float through this ethereal lagoon. Diamond Beach nearby sparkles with ice chunks washed ashore on black volcanic sand.',
    shortDescription: 'Ethereal icebergs on black sand',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Glacier Lagoon' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Icebergs' }
    ],
    location: {
      type: 'Point',
      coordinates: [-16.2306, 64.0784],
      city: 'Höfn',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Geysir Geothermal Area',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Stand near Strokkur geyser as it erupts every 5-10 minutes, shooting boiling water up to 40 meters high. This geothermal wonderland showcases Iceland\'s volcanic power.',
    shortDescription: 'Erupting geysers and boiling mud pots',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Strokkur Eruption' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Geothermal Area' }
    ],
    location: {
      type: 'Point',
      coordinates: [-20.3000, 64.3100],
      city: 'Haukadalur',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Skógafoss Waterfall',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Marvel at one of Iceland\'s most powerful waterfalls. The Skógá River plunges 60 meters over a cliff, often creating brilliant rainbows in the mist on sunny days.',
    shortDescription: 'One of Iceland\'s most powerful waterfalls',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Skógafoss' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Waterfall Rainbow' }
    ],
    location: {
      type: 'Point',
      coordinates: [-19.5111, 63.5319],
      city: 'Skógar',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Vatnajökull Glacier',
    country: 'Iceland',
    continent: 'Europe',
    description: 'Explore Europe\'s largest glacier by volume. Beneath the ice lie volcanoes, while ice caves form stunning blue crystalline chambers during winter months.',
    shortDescription: 'Europe\'s largest glacier with ice caves',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Ice Cave' },
      { url: 'https://images.unsplash.com/photo-1520697830682-bbb7e855df28?w=800', caption: 'Glacier Surface' }
    ],
    location: {
      type: 'Point',
      coordinates: [-16.8000, 64.4167],
      city: 'Southeast Iceland',
      country: 'Iceland',
      continent: 'Europe'
    },
    featured: true
  },
  // MYSTERIOUS PLACES
  {
    name: 'Stonehenge',
    country: 'England',
    continent: 'Europe',
    description: 'Contemplate one of the world\'s most famous prehistoric monuments. These massive standing stones, arranged in circles, have puzzled archaeologists for centuries regarding their purpose and construction.',
    shortDescription: 'Ancient stone circle mystery',
    images: [
      { url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800', caption: 'Stonehenge' },
      { url: 'https://images.unsplash.com/photo-1572508589190-06ba05f2e098?w=800', caption: 'Standing Stones' }
    ],
    location: {
      type: 'Point',
      coordinates: [-1.8262, 51.1789],
      city: 'Salisbury',
      country: 'England',
      continent: 'Europe'
    },
    featured: true
  },
  {
    name: 'Easter Island (Rapa Nui)',
    country: 'Chile',
    continent: 'South America',
    description: 'Encounter the mysterious moai - nearly 1,000 colossal stone statues scattered across this remote Pacific island. How the Rapa Nui people carved and transported these giants remains debated.',
    shortDescription: 'Remote island of giant stone statues',
    images: [
      { url: 'https://images.unsplash.com/photo-1518638151313-982004489301?w=800', caption: 'Moai Statues' },
      { url: 'https://images.unsplash.com/photo-1578321714369-8c8f0b7f8d8e?w=800', caption: 'Ahu Tongariki' }
    ],
    location: {
      type: 'Point',
      coordinates: [-109.4333, -27.1127],
      city: 'Hanga Roa',
      country: 'Chile',
      continent: 'South America'
    },
    featured: true
  },
  {
    name: 'Bermuda Triangle',
    country: 'Atlantic Ocean',
    continent: 'North America',
    description: 'Sail through the legendary stretch of ocean where ships and aircraft have allegedly disappeared under mysterious circumstances. Explore theories from compass variations to methane gas eruptions.',
    shortDescription: 'Legend of mysterious disappearances',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Atlantic Ocean' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Mysterious Waters' }
    ],
    location: {
      type: 'Point',
      coordinates: [-65.0000, 26.0000],
      city: 'Miami Area',
      country: 'Atlantic Ocean',
      continent: 'North America'
    },
    featured: false
  },
  {
    name: 'Area 51',
    country: 'USA',
    continent: 'North America',
    description: 'Gaze upon the most famous military base in the world, shrouded in secrecy and UFO conspiracy theories. This remote Nevada facility has fueled alien speculation for decades.',
    shortDescription: 'Secretive military base & UFO legends',
    images: [
      { url: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd46fa?w=800', caption: 'Nevada Desert' },
      { url: 'https://images.unsplash.com/photo-1542223616-5d9176943194?w=800', caption: 'Desert Highway' }
    ],
    location: {
      type: 'Point',
      coordinates: [-115.7400, 37.2350],
      city: 'Nevada',
      country: 'USA',
      continent: 'North America'
    },
    featured: false
  },
  {
    name: 'Angkor Wat',
    country: 'Cambodia',
    continent: 'Asia',
    description: 'Explore the largest religious monument in the world. This 12th-century temple complex, originally Hindu then Buddhist, showcases Khmer architecture at its zenith with intricate carvings and cosmic symbolism.',
    shortDescription: 'Largest religious monument in the world',
    images: [
      { url: 'https://images.unsplash.com/photo-1565060169196-73f53415ad74?w=800', caption: 'Angkor Wat Temple' },
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', caption: 'Temple at Sunrise' }
    ],
    location: {
      type: 'Point',
      coordinates: [103.8670, 13.4125],
      city: 'Siem Reap',
      country: 'Cambodia',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    description: 'Ascend to the "Lost City of the Incas" perched 2,430 meters above sea level. This 15th-century citadel, hidden in cloud forest, showcases sophisticated Incan dry-stone construction.',
    shortDescription: 'The Lost City of the Incas',
    images: [
      { url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', caption: 'Machu Picchu' },
      { url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', caption: 'Incan Ruins' }
    ],
    location: {
      type: 'Point',
      coordinates: [-72.5450, -13.1631],
      city: 'Cusco Region',
      country: 'Peru',
      continent: 'South America'
    },
    featured: true
  },
  {
    name: 'Socotra Island',
    country: 'Yemen',
    continent: 'Asia',
    description: 'Step onto the "Galápagos of the Indian Ocean" - an island with bizarre alien-like flora found nowhere else on Earth. The Dragon\'s Blood Trees and Bottle Trees create an otherworldly landscape.',
    shortDescription: 'Alien-like flora found nowhere else',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Dragon Blood Tree' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Socotra Landscape' }
    ],
    location: {
      type: 'Point',
      coordinates: [54.0000, 12.5000],
      city: 'Hadiboh',
      country: 'Yemen',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Salar de Uyuni',
    country: 'Bolivia',
    continent: 'South America',
    description: 'Walk across the world\'s largest salt flat, creating a natural mirror that reflects the sky. During rainy season, the thin layer of water creates the world\'s largest mirror.',
    shortDescription: 'World\'s largest natural mirror',
    images: [
      { url: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=800', caption: 'Salt Flat Mirror' },
      { url: 'https://images.unsplash.com/photo-1534234828563-02511c750b42?w=800', caption: 'Hexagonal Salt Patterns' }
    ],
    location: {
      type: 'Point',
      coordinates: [-66.8333, -20.3333],
      city: 'Uyuni',
      country: 'Bolivia',
      continent: 'South America'
    },
    featured: true
  },
  {
    name: 'Göbekli Tepe',
    country: 'Turkey',
    continent: 'Asia',
    description: 'Stand at the world\'s oldest known temple complex, predating Stonehenge by 6,000 years. These massive carved pillars rewrite our understanding of early human civilization.',
    shortDescription: 'World\'s oldest temple complex',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Ancient Pillars' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Carved Reliefs' }
    ],
    location: {
      type: 'Point',
      coordinates: [38.9225, 37.2233],
      city: 'Şanlıurfa',
      country: 'Turkey',
      continent: 'Asia'
    },
    featured: false
  },
  {
    name: 'Lake Baikal',
    country: 'Russia',
    continent: 'Asia',
    description: 'Dive into the world\'s deepest and oldest lake, holding 20% of Earth\'s unfrozen freshwater. Its crystal-clear waters and unique endemic species make it a natural wonder.',
    shortDescription: 'World\'s deepest and oldest lake',
    images: [
      { url: 'https://images.unsplash.com/photo-1551845856-2f110138b53c?w=800', caption: 'Frozen Baikal' },
      { url: 'https://images.unsplash.com/photo-1578321714369-8c8f0b7f8d8e?w=800', caption: 'Clear Waters' }
    ],
    location: {
      type: 'Point',
      coordinates: [107.2500, 53.5586],
      city: 'Irkutsk Region',
      country: 'Russia',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Zhangjiajie National Forest',
    country: 'China',
    continent: 'Asia',
    description: 'Wander among the towering quartz-sandstone pillars that inspired Avatar\'s floating mountains. These 3,000+ pillars rise hundreds of meters, often shrouded in mystical mist.',
    shortDescription: 'Avatar\'s floating mountains in reality',
    images: [
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', caption: 'Stone Pillars' },
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Misty Peaks' }
    ],
    location: {
      type: 'Point',
      coordinates: [110.4792, 29.3275],
      city: 'Zhangjiajie',
      country: 'China',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Antarctica',
    country: 'Antarctica',
    continent: 'Antarctica',
    description: 'Journey to the last wilderness on Earth. This frozen continent holds 90% of the world\'s ice and features pristine landscapes, massive glaciers, and incredible wildlife including penguins and whales.',
    shortDescription: 'The last wilderness on Earth',
    images: [
      { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', caption: 'Icebergs' },
      { url: 'https://images.unsplash.com/photo-1544238458-0a9a806a7e77?w=800', caption: 'Penguin Colony' }
    ],
    location: {
      type: 'Point',
      coordinates: [0.0000, -82.8628],
      city: 'Antarctic Peninsula',
      country: 'Antarctica',
      continent: 'Antarctica'
    },
    featured: true
  },
  {
    name: 'Mount Roraima',
    country: 'Venezuela/Brazil/Guyana',
    continent: 'South America',
    description: 'Ascend one of the oldest geological formations on Earth - a tabletop mountain (tepui) that inspired Arthur Conan Doyle\'s "The Lost World". Unique species live on its isolated summit.',
    shortDescription: 'Ancient tabletop mountain',
    images: [
      { url: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd46fa?w=800', caption: 'Tabletop Summit' },
      { url: 'https://images.unsplash.com/photo-1542223616-5d9176943194?w=800', caption: 'Crystal Valley' }
    ],
    location: {
      type: 'Point',
      coordinates: [-60.7833, 5.2833],
      city: 'Gran Sabana',
      country: 'Venezuela',
      continent: 'South America'
    },
    featured: true
  },
  {
    name: 'Socotra Dragon Blood Trees',
    country: 'Yemen',
    continent: 'Africa',
    description: 'Witness the prehistoric Dragon\'s Blood Trees, unique to Socotra Island. Their umbrella-shaped canopy and red sap, used for centuries in medicine and magic, create an alien landscape.',
    shortDescription: 'Prehistoric trees with red blood-like sap',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Dragon Blood Tree' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Red Sap' }
    ],
    location: {
      type: 'Point',
      coordinates: [54.2000, 12.4000],
      city: 'Haghier Mountains',
      country: 'Yemen',
      continent: 'Africa'
    },
    featured: false
  },
  {
    name: 'Namib Desert',
    country: 'Namibia',
    continent: 'Africa',
    description: 'Explore the world\'s oldest desert, where towering red dunes meet the Atlantic Ocean. Dead Vlei\'s ancient camel thorn trees stand as blackened silhouettes against white clay pans.',
    shortDescription: 'World\'s oldest desert with towering dunes',
    images: [
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', caption: 'Red Dunes' },
      { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800', caption: 'Dead Vlei' }
    ],
    location: {
      type: 'Point',
      coordinates: [15.2500, -24.7500],
      city: 'Sossusvlei',
      country: 'Namibia',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Lake Natron',
    country: 'Tanzania',
    continent: 'Africa',
    description: 'Visit the "Petrifying Lake" where alkaline waters (pH 10.5) can calcify animals. Despite its deadly nature, it\'s the only breeding ground for lesser flamingos in East Africa.',
    shortDescription: 'The petrifying alkaline lake',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Pink Flamingos' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Alkaline Waters' }
    ],
    location: {
      type: 'Point',
      coordinates: [36.0167, -2.4167],
      city: 'Natron',
      country: 'Tanzania',
      continent: 'Africa'
    },
    featured: false
  },
  {
    name: 'Danakil Depression',
    country: 'Ethiopia',
    continent: 'Africa',
    description: 'Descend into one of Earth\'s hottest, lowest, and most alien landscapes. Colorful hot springs, sulfur springs, and active volcanoes create a hellscape that feels like another planet.',
    shortDescription: 'One of Earth\'s most alien landscapes',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Colorful Springs' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Erta Ale Volcano' }
    ],
    location: {
      type: 'Point',
      coordinates: [40.5000, 14.2500],
      city: 'Afar Region',
      country: 'Ethiopia',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Blood Falls',
    country: 'Antarctica',
    continent: 'Antarctica',
    description: 'Witness the bizarre phenomenon of blood-red water flowing from Taylor Glacier. Iron-rich saltwater, trapped beneath the ice for millions of years, oxidizes upon contact with air.',
    shortDescription: 'Blood-red waterfall from ancient ice',
    images: [
      { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', caption: 'Red Flow' },
      { url: 'https://images.unsplash.com/photo-1544238458-0a9a806a7e77?w=800', caption: 'Taylor Glacier' }
    ],
    location: {
      type: 'Point',
      coordinates: [162.1667, -77.7167],
      city: 'McMurdo Dry Valleys',
      country: 'Antarctica',
      continent: 'Antarctica'
    },
    featured: false
  },
  {
    name: 'Crooked Forest',
    country: 'Poland',
    continent: 'Europe',
    description: 'Investigate the mystery of 400 pine trees with a uniform 90-degree bend at their base. Planted in the 1930s, no one knows why or how these trees were deliberately shaped.',
    shortDescription: '400 mysteriously bent pine trees',
    images: [
      { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', caption: 'Bent Trees' },
      { url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800', caption: 'Curved Trunks' }
    ],
    location: {
      type: 'Point',
      coordinates: [14.8433, 53.2667],
      city: 'Gryfino',
      country: 'Poland',
      continent: 'Europe'
    },
    featured: false
  },
  {
    name: 'Henderson Island',
    country: 'United Kingdom (Pitcairn)',
    continent: 'Oceania',
    description: 'Discover a remote coral atoll untouched by humans yet covered in plastic debris. This UNESCO site showcases both pristine nature and humanity\'s global pollution impact.',
    shortDescription: 'Pristine yet plastic-covered paradise',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Coral Beach' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Remote Atoll' }
    ],
    location: {
      type: 'Point',
      coordinates: [-128.3000, -24.3667],
      city: 'Pitcairn Islands',
      country: 'United Kingdom',
      continent: 'Oceania'
    },
    featured: false
  },
  {
    name: 'Door to Hell (Darvaza)',
    country: 'Turkmenistan',
    continent: 'Asia',
    description: 'Gaze into a natural gas crater that has been burning continuously since 1971. Soviet geologists set it ablaze to prevent methane spread, expecting it to burn out in weeks - it still burns today.',
    shortDescription: 'A gas crater burning since 1971',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Burning Crater' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Fire Pit' }
    ],
    location: {
      type: 'Point',
      coordinates: [58.4333, 40.2500],
      city: 'Darvaza',
      country: 'Turkmenistan',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Lake Hillier',
    country: 'Australia',
    continent: 'Oceania',
    description: 'Marvel at a bubblegum-pink lake that stays pink year-round. The color comes from salt-loving algae and bacteria, creating a stunning contrast against green eucalyptus forest and blue ocean.',
    shortDescription: 'Permanent bubblegum-pink lake',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Pink Lake Aerial' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Pink Waters' }
    ],
    location: {
      type: 'Point',
      coordinates: [123.2000, -34.1000],
      city: 'Middle Island',
      country: 'Australia',
      continent: 'Oceania'
    },
    featured: true
  },
  {
    name: 'Catatumbo Lightning',
    country: 'Venezuela',
    continent: 'South America',
    description: 'Witness the world\'s most concentrated lightning phenomenon. Up to 280 strikes per hour occur 140-160 nights yearly over Lake Maracaibo, caused by unique wind and topography conditions.',
    shortDescription: 'World\'s most concentrated lightning',
    images: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Lightning Storm' },
      { url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800', caption: 'Catatumbo Storm' }
    ],
    location: {
      type: 'Point',
      coordinates: [-71.6333, 9.7500],
      city: 'Lake Maracaibo',
      country: 'Venezuela',
      continent: 'South America'
    },
    featured: true
  },
  {
    name: 'Movile Cave',
    country: 'Romania',
    continent: 'Europe',
    description: 'Explore a cave sealed from the outside world for 5.5 million years. Its toxic atmosphere (high CO2, H2S) hosts unique ecosystems with species found nowhere else on Earth.',
    shortDescription: 'Sealed for 5.5 million years',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Cave Interior' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Underground Lake' }
    ],
    location: {
      type: 'Point',
      coordinates: [28.6000, 43.7833],
      city: 'Mangalia',
      country: 'Romania',
      continent: 'Europe'
    },
    featured: false
  },
  {
    name: 'Kelimutu Volcano',
    country: 'Indonesia',
    continent: 'Asia',
    description: 'Stand above three crater lakes that change color independently - from blue to green to red to black. Local legends say the lakes are home to ancestral spirits.',
    shortDescription: 'Three color-changing crater lakes',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Colored Lakes' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Volcanic Craters' }
    ],
    location: {
      type: 'Point',
      coordinates: [121.8283, -8.7672],
      city: 'Flores Island',
      country: 'Indonesia',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Glowworm Caves (Waitomo)',
    country: 'New Zealand',
    continent: 'Oceania',
    description: 'Drift through underground caves illuminated by thousands of bioluminescent glowworms. These unique fungi create a starry night effect in the darkness.',
    shortDescription: 'Underground caves with living stars',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Glowing Caves' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Bioluminescence' }
    ],
    location: {
      type: 'Point',
      coordinates: [175.1033, -38.2606],
      city: 'Waitomo',
      country: 'New Zealand',
      continent: 'Oceania'
    },
    featured: true
  },
  {
    name: 'Richat Structure (Eye of Sahara)',
    country: 'Mauritania',
    continent: 'Africa',
    description: 'Gaze upon a massive circular geological formation visible from space. Once thought to be an impact crater, it\'s actually an eroded dome - but its perfect circles remain mysterious.',
    shortDescription: 'Massive circular formation visible from space',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Eye from Above' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Circular Rings' }
    ],
    location: {
      type: 'Point',
      coordinates: [-11.4000, 21.1167],
      city: 'Ouadane',
      country: 'Mauritania',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Yonaguni Monument',
    country: 'Japan',
    continent: 'Asia',
    description: 'Dive to investigate underwater terraced structures that may be ancient ruins or natural formations. The debate continues whether this is humanity\'s lost civilization or geological coincidence.',
    shortDescription: 'Underwater ruins or natural formation?',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Underwater Steps' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Stone Terraces' }
    ],
    location: {
      type: 'Point',
      coordinates: [123.0000, 24.4333],
      city: 'Yonaguni Island',
      country: 'Japan',
      continent: 'Asia'
    },
    featured: false
  },
  {
    name: 'Pumice Raft (Pacific Ocean)',
    country: 'Pacific Ocean',
    continent: 'Oceania',
    description: 'Sail across massive floating islands of pumice stone created by underwater volcanoes. These rafts can stretch for kilometers and carry new life across oceans.',
    shortDescription: 'Floating volcanic stone islands',
    images: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Pumice Raft' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Floating Stone' }
    ],
    location: {
      type: 'Point',
      coordinates: [-175.0000, -18.0000],
      city: 'South Pacific',
      country: 'Pacific Ocean',
      continent: 'Oceania'
    },
    featured: false
  },
  {
    name: 'Avenue of the Baobabs',
    country: 'Madagascar',
    continent: 'Africa',
    description: 'Walk among ancient baobab trees, some over 800 years old. These "upside-down trees" with massive trunks and sparse branches create an otherworldly silhouette against Madagascar\'s sky.',
    shortDescription: 'Ancient upside-down trees',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Baobab Avenue' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Ancient Trees' }
    ],
    location: {
      type: 'Point',
      coordinates: [44.4167, -20.2500],
      city: 'Morondava',
      country: 'Madagascar',
      continent: 'Africa'
    },
    featured: true
  },
  {
    name: 'Mount Kailash',
    country: 'Tibet (China)',
    continent: 'Asia',
    description: 'Approach the most sacred mountain in four religions. Believed to be the axis of the universe, no one has summited it - and some say those who try meet mysterious fates.',
    shortDescription: 'Sacred unclimbed axis of the universe',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Sacred Peak' },
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'Holy Mountain' }
    ],
    location: {
      type: 'Point',
      coordinates: [81.3167, 31.0833],
      city: 'Tibet',
      country: 'China',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Derinkuyu Underground City',
    country: 'Turkey',
    continent: 'Asia',
    description: 'Descend into an 18-level underground city carved from soft volcanic rock. Capable of housing 20,000 people with ventilation shafts, wells, and stables - built by whom and why remains debated.',
    shortDescription: '18-level ancient underground city',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Underground Tunnels' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'Carved Chambers' }
    ],
    location: {
      type: 'Point',
      coordinates: [34.7133, 38.3553],
      city: 'Cappadocia',
      country: 'Turkey',
      continent: 'Asia'
    },
    featured: true
  },
  {
    name: 'Salar de Tara',
    country: 'Chile',
    continent: 'South America',
    description: 'Visit a high-altitude salt flat in the Atacama Desert, surrounded by volcanic peaks. This remote lunar landscape features rock formations, lagoons, and flamingos at 4,300 meters elevation.',
    shortDescription: 'High-altitude lunar salt flat',
    images: [
      { url: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=800', caption: 'Salt Flats' },
      { url: 'https://images.unsplash.com/photo-1534234828563-02511c750b42?w=800', caption: 'Volcanic Landscape' }
    ],
    location: {
      type: 'Point',
      coordinates: [-68.2500, -23.2500],
      city: 'Antofagasta',
      country: 'Chile',
      continent: 'South America'
    },
    featured: false
  },
  {
    name: 'Hessdalen Lights',
    country: 'Norway',
    continent: 'Europe',
    description: 'Investigate unexplained lights that appear in the Hessdalen valley. These orbs of light have been photographed and studied for decades, with no definitive scientific explanation.',
    shortDescription: 'Unexplained mysterious light orbs',
    images: [
      { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', caption: 'Mysterious Lights' },
      { url: 'https://images.unsplash.com/photo-1483347753191-1a5c99004f67?w=800', caption: 'Valley Orbs' }
    ],
    location: {
      type: 'Point',
      coordinates: [11.2000, 62.8000],
      city: 'Hessdalen',
      country: 'Norway',
      continent: 'Europe'
    },
    featured: false
  }
];

// Sample tours with correct schema
const tours = [
  {
    title: 'Eiffel Tower Experience',
    shortDescription: 'Experience the iconic Eiffel Tower like never before.',
    description: 'Join us for an unforgettable journey to the top of the world\'s most visited monument. This immersive virtual tour takes you from the base to the summit with breathtaking 360° views of Paris.',
    images: [
      { url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800', caption: 'Eiffel Tower', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [2.2945, 48.8584],
      city: 'Paris',
      country: 'France',
      continent: 'Europe'
    },
    category: 'historical',
    tags: ['paris', 'france', 'landmark', 'tower'],
    duration: '2 hours',
    difficulty: 'easy',
    price: 49,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 256,
    participants: 1024,
    languages: ['en', 'fr'],
    maxParticipants: 50
  },
  {
    title: 'Grand Canyon Adventure',
    shortDescription: 'Explore the breathtaking Grand Canyon.',
    description: 'Experience one of the natural wonders of the world from the comfort of your home. This tour includes sunrise and sunset views with geological commentary from our expert guides.',
    images: [
      { url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800', caption: 'Grand Canyon', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-112.1129, 36.1069],
      city: 'Arizona',
      country: 'USA',
      continent: 'North America'
    },
    category: 'nature',
    tags: ['canyon', 'nature', 'usa', 'landscape'],
    duration: '3 hours',
    difficulty: 'moderate',
    price: 79,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 189,
    participants: 756,
    languages: ['en'],
    maxParticipants: 30
  },
  {
    title: 'Tokyo Street Walk',
    shortDescription: 'Walk through the vibrant streets of Tokyo.',
    description: 'Experience the unique blend of traditional and modern Tokyo. From ancient temples to neon-lit streets, discover what makes Tokyo one of the world\'s most fascinating cities.',
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Tokyo Street', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [139.6503, 35.6762],
      city: 'Tokyo',
      country: 'Japan',
      continent: 'Asia'
    },
    category: 'urban',
    tags: ['tokyo', 'japan', 'city', 'culture'],
    duration: '1.5 hours',
    difficulty: 'easy',
    price: 39,
    currency: 'USD',
    isVirtual: true,
    is360: false,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.7,
    reviewCount: 312,
    participants: 892,
    languages: ['en', 'ja'],
    maxParticipants: 40
  },
  {
    title: 'Great Wall of China',
    shortDescription: 'Walk along the ancient Great Wall.',
    description: 'Discover one of the most impressive architectural feats in human history. This tour covers the Mutianyu section with historical commentary from our expert guides.',
    images: [
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', caption: 'Great Wall', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [116.5704, 40.4319],
      city: 'Beijing',
      country: 'China',
      continent: 'Asia'
    },
    category: 'historical',
    tags: ['china', 'wall', 'history', 'landmark'],
    duration: '4 hours',
    difficulty: 'challenging',
    price: 59,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 423,
    participants: 1205,
    languages: ['en', 'zh'],
    maxParticipants: 50
  },
  {
    title: 'Santorini Sunset',
    shortDescription: 'Watch the famous Santorini sunset.',
    description: 'Experience the magical sunset views that Santorini is famous for. This tour includes the white-washed buildings of Oia and stunning Aegean Sea views.',
    images: [
      { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', caption: 'Santorini', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [25.4615, 36.3932],
      city: 'Oia',
      country: 'Greece',
      continent: 'Europe'
    },
    category: 'relaxation',
    tags: ['greece', 'sunset', 'island', 'santorini'],
    duration: '2.5 hours',
    difficulty: 'easy',
    price: 69,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 289,
    participants: 678,
    languages: ['en', 'el'],
    maxParticipants: 35
  },
  {
    title: 'Amazon Rainforest Expedition',
    shortDescription: 'Journey into the heart of the Amazon.',
    description: 'Explore the world\'s largest rainforest with our expert naturalist guides. Discover unique wildlife, plants, and the incredible biodiversity of the Amazon.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800', caption: 'Amazon Rainforest', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-60.0217, -3.4653],
      city: 'Manaus',
      country: 'Brazil',
      continent: 'South America'
    },
    category: 'nature',
    tags: ['amazon', 'rainforest', 'wildlife', 'brazil'],
    duration: '5 hours',
    difficulty: 'moderate',
    price: 99,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: true,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 156,
    participants: 445,
    languages: ['en', 'pt'],
    maxParticipants: 25
  },
  // AFRICA TOURS
  {
    title: 'Pyramids of Giza Virtual Tour',
    shortDescription: 'Explore the last wonder of the ancient world.',
    description: 'Step back in time 4,500 years to explore the Great Pyramid, the Sphinx, and the surrounding complex. Learn about the engineering marvels and hidden chambers that continue to puzzle archaeologists.',
    images: [
      { url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800', caption: 'Great Pyramid', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [31.1342, 29.9792],
      city: 'Giza',
      country: 'Egypt',
      continent: 'Africa'
    },
    category: 'historical',
    tags: ['egypt', 'pyramids', 'ancient', 'wonder'],
    duration: '3 hours',
    difficulty: 'easy',
    price: 59,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 512,
    participants: 1890,
    languages: ['en', 'ar'],
    maxParticipants: 40
  },
  {
    title: 'Serengeti Safari Experience',
    shortDescription: 'Witness the Great Migration.',
    description: 'Join the ultimate African safari adventure. Track the Great Migration, spot the Big Five, and experience the raw beauty of the Serengeti plains with expert guides.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Serengeti Wildlife', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [34.8333, -2.3333],
      city: 'Serengeti',
      country: 'Tanzania',
      continent: 'Africa'
    },
    category: 'nature',
    tags: ['safari', 'wildlife', 'tanzania', 'migration'],
    duration: '4 hours',
    difficulty: 'moderate',
    price: 129,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: true,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 387,
    participants: 1245,
    languages: ['en', 'sw'],
    maxParticipants: 30
  },
  {
    title: 'Victoria Falls Adventure',
    shortDescription: 'Experience the Smoke That Thunders.',
    description: 'Feel the power of one of the world\'s largest waterfalls. This tour includes helicopter views, Devil\'s Pool experience, and the stunning rainbows created by the mist.',
    images: [
      { url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800', caption: 'Victoria Falls', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [25.8572, -17.9243],
      city: 'Victoria Falls',
      country: 'Zimbabwe',
      continent: 'Africa'
    },
    category: 'adventure',
    tags: ['waterfall', 'zimbabwe', 'zambezi', 'nature'],
    duration: '2.5 hours',
    difficulty: 'moderate',
    price: 89,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 298,
    participants: 876,
    languages: ['en'],
    maxParticipants: 35
  },
  {
    title: 'Marrakech Medina Walk',
    shortDescription: 'Get lost in the Red City.',
    description: 'Navigate the labyrinthine souks of Marrakech\'s historic medina. From spice markets to traditional crafts, experience the sensory overload of Morocco\'s imperial city.',
    images: [
      { url: 'https://images.unsplash.com/photo-1539020140153-e479b6c60021?w=800', caption: 'Marrakech Souk', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-7.9811, 31.6295],
      city: 'Marrakech',
      country: 'Morocco',
      continent: 'Africa'
    },
    category: 'cultural',
    tags: ['morocco', 'medina', 'souk', 'culture'],
    duration: '3 hours',
    difficulty: 'easy',
    price: 45,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.7,
    reviewCount: 423,
    participants: 1567,
    languages: ['en', 'fr', 'ar'],
    maxParticipants: 40
  },
  {
    title: 'Table Mountain Cableway',
    shortDescription: 'Cape Town from above.',
    description: 'Ride the cableway to the top of Table Mountain for panoramic views of Cape Town, Robben Island, and the Atlantic Ocean. Learn about the unique fynbos ecosystem.',
    images: [
      { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca387c?w=800', caption: 'Table Mountain', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [18.4097, -33.9628],
      city: 'Cape Town',
      country: 'South Africa',
      continent: 'Africa'
    },
    category: 'nature',
    tags: ['south africa', 'mountain', 'cape town', 'views'],
    duration: '2 hours',
    difficulty: 'easy',
    price: 55,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 356,
    participants: 1123,
    languages: ['en'],
    maxParticipants: 45
  },
  {
    title: 'Sahara Desert Sunset',
    shortDescription: 'Golden dunes and starry nights.',
    description: 'Journey into the heart of the Sahara. Watch the sunset paint the dunes gold, spend the night in a Berber camp, and gaze at the Milky Way in complete darkness.',
    images: [
      { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800', caption: 'Sahara Dunes', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-4.0000, 31.0000],
      city: 'Merzouga',
      country: 'Morocco',
      continent: 'Africa'
    },
    category: 'nature',
    tags: ['desert', 'sahara', 'morocco', 'sunset'],
    duration: '4 hours',
    difficulty: 'moderate',
    price: 99,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 267,
    participants: 789,
    languages: ['en', 'fr', 'ar'],
    maxParticipants: 25
  },
  // ICELAND TOURS
  {
    title: 'Northern Lights Hunt',
    shortDescription: 'Chase the Aurora Borealis.',
    description: 'Join expert guides on a quest to witness nature\'s most spectacular light show. Learn about the science behind auroras while hunting for the perfect viewing spot.',
    images: [
      { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', caption: 'Aurora Borealis', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-18.0000, 65.0000],
      city: 'Various',
      country: 'Iceland',
      continent: 'Europe'
    },
    category: 'nature',
    tags: ['iceland', 'aurora', 'northern lights', 'night'],
    duration: '5 hours',
    difficulty: 'easy',
    price: 149,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 678,
    participants: 2345,
    languages: ['en', 'is'],
    maxParticipants: 30
  },
  {
    title: 'Blue Lagoon Spa Experience',
    shortDescription: 'Geothermal paradise.',
    description: 'Relax in the milky-blue mineral-rich waters of Iceland\'s most famous spa. Surrounded by black lava fields, experience pure bliss and rejuvenation.',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Blue Lagoon', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-22.4496, 63.8804],
      city: 'Grindavík',
      country: 'Iceland',
      continent: 'Europe'
    },
    category: 'relaxation',
    tags: ['iceland', 'spa', 'geothermal', 'relaxation'],
    duration: '3 hours',
    difficulty: 'easy',
    price: 119,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 892,
    participants: 3456,
    languages: ['en', 'is'],
    maxParticipants: 50
  },
  {
    title: 'Jökulsárlón Glacier Lagoon',
    shortDescription: 'Icebergs and black sand.',
    description: 'Witness the ethereal beauty of Iceland\'s glacier lagoon. Watch icebergs calve and float to the famous Diamond Beach where ice sparkles on black volcanic sand.',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Glacier Lagoon', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-16.2306, 64.0784],
      city: 'Höfn',
      country: 'Iceland',
      continent: 'Europe'
    },
    category: 'nature',
    tags: ['iceland', 'glacier', 'iceberg', 'lagoon'],
    duration: '4 hours',
    difficulty: 'easy',
    price: 109,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 534,
    participants: 1678,
    languages: ['en', 'is'],
    maxParticipants: 35
  },
  {
    title: 'Geysir & Gullfoss Waterfall',
    shortDescription: 'Iceland\'s Golden Circle.',
    description: 'Experience the power of erupting geysers and one of Iceland\'s most spectacular waterfalls. This classic Golden Circle tour showcases Iceland\'s geothermal wonders.',
    images: [
      { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', caption: 'Strokkur Geyser', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-20.3000, 64.3100],
      city: 'Haukadalur',
      country: 'Iceland',
      continent: 'Europe'
    },
    category: 'nature',
    tags: ['iceland', 'geyser', 'waterfall', 'golden circle'],
    duration: '6 hours',
    difficulty: 'easy',
    price: 139,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 723,
    participants: 2567,
    languages: ['en', 'is', 'de'],
    maxParticipants: 40
  },
  // MYSTERIOUS PLACES TOURS
  {
    title: 'Stonehenge Mystery Tour',
    shortDescription: 'Ancient stone circle secrets.',
    description: 'Explore one of the world\'s most famous prehistoric monuments. Discover theories about its purpose - astronomical calendar, healing site, or burial ground?',
    images: [
      { url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800', caption: 'Stonehenge', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-1.8262, 51.1789],
      city: 'Salisbury',
      country: 'England',
      continent: 'Europe'
    },
    category: 'historical',
    tags: ['stonehenge', 'ancient', 'mystery', 'england'],
    duration: '3 hours',
    difficulty: 'easy',
    price: 65,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.7,
    reviewCount: 456,
    participants: 1890,
    languages: ['en'],
    maxParticipants: 40
  },
  {
    title: 'Easter Island Moai Expedition',
    shortDescription: 'Mystery of the giant statues.',
    description: 'Journey to one of the most remote islands on Earth. Explore the mysterious moai statues and learn about the Rapa Nui civilization\'s rise and fall.',
    images: [
      { url: 'https://images.unsplash.com/photo-1518638151313-982004489301?w=800', caption: 'Moai Statues', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-109.4333, -27.1127],
      city: 'Hanga Roa',
      country: 'Chile',
      continent: 'South America'
    },
    category: 'historical',
    tags: ['easter island', 'moai', 'mystery', 'rapa nui'],
    duration: '4 hours',
    difficulty: 'moderate',
    price: 159,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 234,
    participants: 567,
    languages: ['en', 'es'],
    maxParticipants: 25
  },
  {
    title: 'Machu Picchu Sunrise',
    shortDescription: 'Lost City of the Incas.',
    description: 'Ascend to the clouds and explore the 15th-century Incan citadel. Watch sunrise over the ruins and learn about this sophisticated civilization\'s achievements.',
    images: [
      { url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', caption: 'Machu Picchu', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-72.5450, -13.1631],
      city: 'Cusco Region',
      country: 'Peru',
      continent: 'South America'
    },
    category: 'historical',
    tags: ['peru', 'inca', 'machu picchu', 'ancient'],
    duration: '5 hours',
    difficulty: 'challenging',
    price: 129,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 892,
    participants: 2890,
    languages: ['en', 'es'],
    maxParticipants: 35
  },
  {
    title: 'Salar de Uyuni Mirror Walk',
    shortDescription: 'World\'s largest mirror.',
    description: 'Walk across the surreal salt flats where sky meets earth. During rainy season, experience the world\'s largest natural mirror reflecting the heavens above.',
    images: [
      { url: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=800', caption: 'Salt Flats', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-66.8333, -20.3333],
      city: 'Uyuni',
      country: 'Bolivia',
      continent: 'South America'
    },
    category: 'nature',
    tags: ['bolivia', 'salt flat', 'salar', 'mirror'],
    duration: '4 hours',
    difficulty: 'easy',
    price: 99,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 345,
    participants: 987,
    languages: ['en', 'es'],
    maxParticipants: 30
  },
  {
    title: 'Angkor Wat Temple Complex',
    shortDescription: 'Largest religious monument.',
    description: 'Explore the vast temple complex of Angkor Wat. Discover intricate carvings depicting Hindu mythology and the architectural genius of the Khmer Empire.',
    images: [
      { url: 'https://images.unsplash.com/photo-1565060169196-73f53415ad74?w=800', caption: 'Angkor Wat', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [103.8670, 13.4125],
      city: 'Siem Reap',
      country: 'Cambodia',
      continent: 'Asia'
    },
    category: 'historical',
    tags: ['cambodia', 'angkor wat', 'temple', 'ancient'],
    duration: '5 hours',
    difficulty: 'moderate',
    price: 79,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 678,
    participants: 2134,
    languages: ['en', 'km'],
    maxParticipants: 40
  },
  {
    title: 'Petra Treasury Discovery',
    shortDescription: 'Rose-Red City revealed.',
    description: 'Walk through the Siq to reveal the iconic Treasury carved into rose-red cliffs. Explore the ancient Nabatean city hidden for centuries.',
    images: [
      { url: 'https://images.unsplash.com/photo-1579606038088-7d7e9f70f833?w=800', caption: 'The Treasury', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [35.4444, 30.3285],
      city: 'Wadi Musa',
      country: 'Jordan',
      continent: 'Asia'
    },
    category: 'historical',
    tags: ['jordan', 'petra', 'ancient', 'treasury'],
    duration: '4 hours',
    difficulty: 'moderate',
    price: 89,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 512,
    participants: 1567,
    languages: ['en', 'ar'],
    maxParticipants: 35
  },
  {
    title: 'Door to Hell Fire Pit',
    shortDescription: 'Burning since 1971.',
    description: 'Gaze into the fiery crater that has burned continuously for over 50 years. This surreal landscape in Turkmenistan feels like stepping onto another planet.',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Burning Crater', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [58.4333, 40.2500],
      city: 'Darvaza',
      country: 'Turkmenistan',
      continent: 'Asia'
    },
    category: 'nature',
    tags: ['turkmenistan', 'fire', 'crater', 'mystery'],
    duration: '2 hours',
    difficulty: 'moderate',
    price: 199,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 189,
    participants: 456,
    languages: ['en'],
    maxParticipants: 20
  },
  {
    title: 'Zhangjiajie Avatar Mountains',
    shortDescription: 'Floating mountains in reality.',
    description: 'Walk among the towering quartz-sandstone pillars that inspired Avatar\'s Hallelujah Mountains. These mystical peaks rise through clouds of mist.',
    images: [
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', caption: 'Stone Pillars', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [110.4792, 29.3275],
      city: 'Zhangjiajie',
      country: 'China',
      continent: 'Asia'
    },
    category: 'nature',
    tags: ['china', 'avatar', 'mountains', 'zhangjiajie'],
    duration: '5 hours',
    difficulty: 'moderate',
    price: 89,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 567,
    participants: 1789,
    languages: ['en', 'zh'],
    maxParticipants: 40
  },
  {
    title: 'Antarctica Ice Expedition',
    shortDescription: 'Last wilderness on Earth.',
    description: 'Journey to the bottom of the world. Explore pristine ice landscapes, encounter penguin colonies, and witness massive glaciers calving into the sea.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', caption: 'Antarctic Ice', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [0.0000, -82.8628],
      city: 'Antarctic Peninsula',
      country: 'Antarctica',
      continent: 'Antarctica'
    },
    category: 'nature',
    tags: ['antarctica', 'ice', 'penguins', 'expedition'],
    duration: '6 hours',
    difficulty: 'challenging',
    price: 299,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: true,
    isLive: false,
    featured: true,
    published: true,
    rating: 5.0,
    reviewCount: 123,
    participants: 345,
    languages: ['en'],
    maxParticipants: 20
  },
  {
    title: 'Lake Hillier Pink Lake',
    shortDescription: 'Bubblegum-pink wonder.',
    description: 'Marvel at Australia\'s mysterious pink lake that stays pink year-round. Learn about the algae and bacteria that create this natural phenomenon.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Pink Lake', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [123.2000, -34.1000],
      city: 'Middle Island',
      country: 'Australia',
      continent: 'Oceania'
    },
    category: 'nature',
    tags: ['australia', 'pink lake', 'hillier', 'mystery'],
    duration: '2 hours',
    difficulty: 'easy',
    price: 119,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.7,
    reviewCount: 234,
    participants: 678,
    languages: ['en'],
    maxParticipants: 30
  },
  {
    title: 'Waitomo Glowworm Caves',
    shortDescription: 'Underground living stars.',
    description: 'Drift through magical caves illuminated by thousands of bioluminescent glowworms. This underground galaxy has been glowing for millions of years.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Glowworm Caves', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [175.1033, -38.2606],
      city: 'Waitomo',
      country: 'New Zealand',
      continent: 'Oceania'
    },
    category: 'nature',
    tags: ['new zealand', 'glowworm', 'caves', 'bioluminescence'],
    duration: '3 hours',
    difficulty: 'easy',
    price: 79,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 456,
    participants: 1234,
    languages: ['en'],
    maxParticipants: 35
  },
  {
    title: 'Eye of Sahara (Richat Structure)',
    shortDescription: 'Visible from space.',
    description: 'Gaze upon the mysterious circular geological formation that has puzzled scientists for decades. Is it an ancient impact crater or something more?',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Eye of Sahara', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [-11.4000, 21.1167],
      city: 'Ouadane',
      country: 'Mauritania',
      continent: 'Africa'
    },
    category: 'nature',
    tags: ['mauritania', 'richat', 'sahara', 'mystery'],
    duration: '3 hours',
    difficulty: 'moderate',
    price: 179,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 167,
    participants: 423,
    languages: ['en', 'fr'],
    maxParticipants: 25
  },
  {
    title: 'Mount Kailash Pilgrimage',
    shortDescription: 'Sacred unclimbed peak.',
    description: 'Approach the most sacred mountain in four religions. Believed to be the axis of the universe, no one has summited this holy peak.',
    images: [
      { url: 'https://images.unsplash.com/photo-1549488497-65818d67840c?w=800', caption: 'Mount Kailash', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [81.3167, 31.0833],
      city: 'Tibet',
      country: 'China',
      continent: 'Asia'
    },
    category: 'cultural',
    tags: ['tibet', 'kailash', 'sacred', 'pilgrimage'],
    duration: '5 hours',
    difficulty: 'challenging',
    price: 199,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.9,
    reviewCount: 289,
    participants: 567,
    languages: ['en', 'zh', 'hi'],
    maxParticipants: 25
  },
  {
    title: 'Derinkuyu Underground City',
    shortDescription: '18 levels beneath the earth.',
    description: 'Descend into an ancient underground city that housed 20,000 people. Explore tunnels, ventilation shafts, and chambers carved from volcanic rock.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', caption: 'Underground City', isPrimary: true },
    ],
    panoramas: [],
    videos: [],
    location: {
      type: 'Point',
      coordinates: [34.7133, 38.3553],
      city: 'Cappadocia',
      country: 'Turkey',
      continent: 'Asia'
    },
    category: 'historical',
    tags: ['turkey', 'underground', 'cappadocia', 'ancient'],
    duration: '3 hours',
    difficulty: 'moderate',
    price: 69,
    currency: 'USD',
    isVirtual: true,
    is360: true,
    hasAR: false,
    isLive: false,
    featured: true,
    published: true,
    rating: 4.8,
    reviewCount: 378,
    participants: 987,
    languages: ['en', 'tr'],
    maxParticipants: 30
  }
];

// Seed function
const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany();
    await Tour.deleteMany();
    await Destination.deleteMany();
    console.log('✅ Cleared existing data');

    // Create users
    console.log('\n👤 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create destinations
    console.log('\n🌍 Creating destinations...');
    const createdDestinations = await Destination.create(destinations);
    console.log(`✅ Created ${createdDestinations.length} destinations`);

    // Assign destinations to tours
    tours[0].destination = createdDestinations[0]._id; // Paris -> Eiffel Tower
    tours[1].destination = createdDestinations[2]._id; // USA -> Grand Canyon
    tours[2].destination = createdDestinations[1]._id; // Tokyo -> Tokyo Street

    // Create tours
    console.log('\n🏛️  Creating tours...');
    const createdTours = await Tour.create(tours);
    console.log(`✅ Created ${createdTours.length} tours`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test accounts:');
    console.log('  Admin: devtechs842@gmail.com / Admin123!');
    console.log('  User:  john@example.com / User123!');
    console.log('  Demo:  demo@virtualtourist.com / Demo123!');
    console.log('\n🌍 Created destinations:');
    createdDestinations.forEach(d => {
      console.log(`  - ${d.name}, ${d.country}`);
    });
    console.log('\n🏛️  Created tours:');
    createdTours.forEach(t => {
      console.log(`  - ${t.title} (${t.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

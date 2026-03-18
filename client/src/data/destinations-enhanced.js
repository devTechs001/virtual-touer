/**
 * Enhanced Destinations Data with African Destinations, 
 * Mysterious Places, and Hidden Gems
 */

export const AFRICAN_DESTINATIONS = [
  {
    id: 'pyramids-giza',
    name: 'Pyramids of Giza',
    country: 'Egypt',
    region: 'Africa',
    coordinates: [31.1342, 29.9792],
    flag: '🇪🇬',
    description: 'The last surviving wonder of the ancient world. Built over 4,500 years ago as tombs for pharaohs.',
    longDescription: 'The Great Pyramid of Giza, built for Pharaoh Khufu, is the largest of the three pyramids. It stood as the tallest man-made structure for over 3,800 years. The precision of its construction remains a marvel - aligned almost perfectly with the cardinal points.',
    rating: 4.9,
    reviews: 15420,
    price: 25,
    duration: '4-6 hours',
    bestTimeToVisit: 'October to April',
    category: 'Historical',
    images: [
      '/images/pyramids-giza-1.jpg',
      '/images/pyramids-giza-2.jpg',
      '/images/pyramids-giza-sphinx.jpg'
    ],
    highlights: [
      'Great Pyramid of Khufu',
      'The Sphinx',
      'Pyramid of Khafre',
      'Pyramid of Menkaure',
      'Solar Boat Museum'
    ],
    history: {
      period: 'Old Kingdom, 4th Dynasty (c. 2580-2560 BC)',
      builder: 'Pharaohs Khufu, Khafre, and Menkaure',
      purpose: 'Royal tombs for the afterlife',
      workers: 'Approximately 20,000-40,000 skilled workers',
      blocks: 'Over 2.3 million limestone blocks',
      mysteries: [
        'How were the massive stones transported?',
        'What lies inside the hidden voids discovered in 2017?',
        'The precise astronomical alignments remain debated',
        'The purpose of the mysterious air shafts'
      ]
    },
    tips: [
      'Visit early morning to avoid crowds and heat',
      'Hire a licensed guide for historical context',
      'Bring water and sun protection',
      'Camel rides available but negotiate price first'
    ]
  },
  {
    id: 'petra-jordan',
    name: 'Petra',
    country: 'Jordan',
    region: 'Middle East',
    coordinates: [35.4444, 30.3285],
    flag: '🇯🇴',
    description: 'The Rose City carved into pink sandstone cliffs. A mysterious ancient Nabatean trading hub.',
    longDescription: 'Petra, meaning "rock" in Greek, was the capital of the Nabatean Kingdom. This archaeological wonder remained unknown to the Western world until 1812. The city showcases incredible water engineering and architectural achievements.',
    rating: 4.9,
    reviews: 12350,
    price: 70,
    duration: 'Full day',
    bestTimeToVisit: 'March to May, September to November',
    category: 'Historical',
    images: [
      '/images/petra-treasury.jpg',
      '/images/petra-monastery.jpg',
      '/images/petra-siq.jpg'
    ],
    highlights: [
      'Al-Khazneh (The Treasury)',
      'Ad-Deir (The Monastery)',
      'The Siq entrance',
      'Royal Tombs',
      'Ancient theater'
    ],
    history: {
      period: 'Established around 300 BC',
      builder: 'Nabatean civilization',
      purpose: 'Trading hub and capital city',
      rediscovery: '1812 by Swiss explorer Johann Ludwig Burckhardt',
      mysteries: [
        'How did the Nabateans carve such precise facades?',
        'The purpose of many chambers remains unknown',
        'Advanced water management system details',
        'What caused the city\'s decline?'
      ]
    },
    tips: [
      'Wear comfortable walking shoes',
      'Start early - it\'s a long walk through the Siq',
      'Climb to the Monastery for breathtaking views',
      'Visit Petra by Night if available (Mon, Wed, Thu)'
    ]
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    country: 'Peru',
    region: 'South America',
    coordinates: [-72.5450, -13.1631],
    flag: '🇵🇪',
    description: 'The Lost City of the Incas, perched high in the Andes. One of the most mysterious archaeological sites.',
    longDescription: 'Built in the 15th century and abandoned during the Spanish conquest, Machu Picchu remained unknown to the outside world until Hiram Bingham\'s "discovery" in 1911. Its purpose remains debated - royal estate, sacred site, or astronomical observatory.',
    rating: 4.9,
    reviews: 18900,
    price: 150,
    duration: 'Full day',
    bestTimeToVisit: 'May to September',
    category: 'Historical',
    images: [
      '/images/machu-picchu-1.jpg',
      '/images/machu-picchu-2.jpg',
      '/images/machu-picchu-sunrise.jpg'
    ],
    highlights: [
      'Intihuatana Stone',
      'Temple of the Sun',
      'Room of the Three Windows',
      'Temple of the Condor',
      'Huayna Picchu climb'
    ],
    history: {
      period: 'Inca Empire (c. 1450-1572)',
      builder: 'Pachacuti Inca Yupanqui',
      purpose: 'Debated - royal estate or sacred site',
      abandonment: 'Spanish Conquest era',
      mysteries: [
        'Why was it built in such a remote location?',
        'How were massive stones transported uphill?',
        'The exact purpose of the Intihuatana stone',
        'What happened to its inhabitants?'
      ]
    },
    tips: [
      'Book tickets months in advance',
      'Acclimatize in Cusco before visiting',
      'Bring passport for entry stamp',
      'Consider the Inca Trail trek (4 days)'
    ]
  },
  {
    id: 'victoria-falls',
    name: 'Victoria Falls',
    country: 'Zambia/Zimbabwe',
    region: 'Africa',
    coordinates: [25.8572, -17.9243],
    flag: '🇿🇼',
    description: 'The Smoke that Thunders - one of the world\'s largest and most spectacular waterfalls.',
    longDescription: 'Victoria Falls, known locally as Mosi-oa-Tunya, is twice the height of Niagara Falls. The mist from the falls rises over 400 meters and can be seen from 50 kilometers away. During peak flow, over 500 million cubic meters of water plunge every minute.',
    rating: 4.8,
    reviews: 9850,
    price: 50,
    duration: 'Half day',
    bestTimeToVisit: 'February to May (high water), August to October (low water)',
    category: 'Natural',
    images: [
      '/images/victoria-falls-1.jpg',
      '/images/victoria-falls-rainbow.jpg',
      '/images/victoria-falls-aerial.jpg'
    ],
    highlights: [
      'Main Falls viewpoint',
      'Devil\'s Pool (dry season)',
      'Rainbow viewing',
      'Batoka Gorge',
      'Wildlife spotting'
    ],
    history: {
      period: 'Formed over 200,000 years ago',
      namedBy: 'David Livingstone (1855)',
      localName: 'Mosi-oa-Tunya (The Smoke that Thunders)',
      geological: 'Zambezi River carved through basalt plateau',
      facts: [
        '1,708 meters wide',
        '108 meters maximum height',
        'UNESCO World Heritage Site since 1989',
        'One of the Seven Natural Wonders'
      ]
    },
    tips: [
      'Bring waterproof clothing - you will get wet',
      'Visit during full moon for lunar rainbow',
      'Combine with safari in nearby parks',
      'Try white water rafting in Batoka Gorge'
    ]
  },
  {
    id: 'serengeti',
    name: 'Serengeti National Park',
    country: 'Tanzania',
    region: 'Africa',
    coordinates: [34.8333, -2.3333],
    flag: '🇹🇿',
    description: 'Home to the greatest wildlife spectacle on Earth - the Great Migration.',
    longDescription: 'The Serengeti ecosystem hosts the largest terrestrial mammal migration in the world. Over 1.5 million wildebeest and 250,000 zebras journey 1,800 miles annually in search of fresh grazing. This endless plain (Serengeti means "endless plain" in Maasai) supports incredible predator populations.',
    rating: 4.9,
    reviews: 11200,
    price: 350,
    duration: '3-5 days',
    bestTimeToVisit: 'June to October (dry season), December to March (calving season)',
    category: 'Wildlife',
    images: [
      '/images/serengeti-migration.jpg',
      '/images/serengeti-lion.jpg',
      '/images/serengeti-balloon.jpg'
    ],
    highlights: [
      'Great Migration river crossings',
      'Big Five game viewing',
      'Hot air balloon safari',
      'Maasai cultural visits',
      'Predator sightings'
    ],
    history: {
      period: 'Established 1951',
      size: '14,750 square kilometers',
      unesco: 'World Heritage Site since 1981',
      migration: 'Has occurred for thousands of years',
      wildlife: [
        'Over 70 large mammal species',
        '500+ bird species',
        'Largest lion population in Africa',
        'Cheetahs, leopards, and wild dogs'
      ]
    },
    tips: [
      'Book safari well in advance',
      'Bring binoculars and camera with zoom',
      'Pack layers - mornings are cold',
      'Consider combining with Ngorongoro Crater'
    ]
  },
  {
    id: 'sahara-desert',
    name: 'Sahara Desert',
    country: 'Multiple (Morocco, Algeria, Tunisia, etc.)',
    region: 'Africa',
    coordinates: [0, 25],
    flag: '🇲🇦',
    description: 'The world\'s largest hot desert, a mysterious expanse of dunes, oases, and ancient trade routes.',
    longDescription: 'The Sahara is almost as large as the United States. Despite its harsh reputation, it supports surprising biodiversity and has been home to various cultures for millennia. Ancient rock art reveals it was once green and lush. The desert holds countless archaeological treasures and mysterious ancient cities.',
    rating: 4.7,
    reviews: 8500,
    price: 200,
    duration: '2-4 days',
    bestTimeToVisit: 'October to April',
    category: 'Adventure',
    images: [
      '/images/sahara-dunes.jpg',
      '/images/sahara-camel.jpg',
      '/images/sahara-stars.jpg'
    ],
    highlights: [
      'Erg Chebbi dunes (Morocco)',
      'Camel trekking',
      'Berber camps',
      'Stargazing',
      'Ancient ksars (fortified villages)'
    ],
    history: {
      period: 'Formed 2-3 million years ago',
      size: '9.2 million square kilometers',
      climate: 'Was green and fertile 10,000-5,000 years ago',
      trade: 'Trans-Saharan trade routes for over 1,000 years',
      mysteries: [
        'Ancient rock art depicting now-extinct wildlife',
        'Lost cities buried beneath the sand',
        'Mysterious stone circles and monuments',
        'Underground water aquifers'
      ]
    },
    tips: [
      'Travel with experienced guides',
      'Bring warm clothing - nights are cold',
      'Protect against sun and sand',
      'Experience a night in a desert camp'
    ]
  },
  {
    id: 'table-mountain',
    name: 'Table Mountain',
    country: 'South Africa',
    region: 'Africa',
    coordinates: [18.4097, -33.9628],
    flag: '🇿🇦',
    description: 'Cape Town\'s iconic flat-topped mountain, one of the New7Wonders of Nature.',
    longDescription: 'Table Mountain is approximately 260 million years old, making it one of the oldest mountains in the world. Its unique flat top is caused by erosion over millions of years. The mountain hosts over 2,200 plant species - more than the entire British Isles.',
    rating: 4.8,
    reviews: 14500,
    price: 30,
    duration: 'Half day',
    bestTimeToVisit: 'November to March',
    category: 'Natural',
    images: [
      '/images/table-mountain-1.jpg',
      '/images/table-mountain-cableway.jpg',
      '/images/table-mountain-sunset.jpg'
    ],
    highlights: [
      'Cable car ride to the top',
      'Hiking trails',
      'Unique fynbos vegetation',
      'Panoramic city views',
      'Rock hyrax (dassies)'
    ],
    history: {
      period: 'Formed ~260 million years ago',
      height: '1,086 meters above sea level',
      unesco: 'Part of Cape Floral Region World Heritage Site',
      biodiversity: 'Over 2,200 plant species, many endemic',
      facts: [
        'The "tablecloth" cloud formation is legendary',
        'Home to the endangered Table Mountain Ghost Frog',
        'Over 350 hiking routes to the summit',
        'Cableway operating since 1929'
      ]
    },
    tips: [
      'Check weather before visiting - mountain closes in high wind',
      'Book cable car tickets online to skip queues',
      'Bring warm clothing - it\'s windy at the top',
      'Sunset views are spectacular'
    ]
  },
  {
    id: 'lalibela',
    name: 'Rock Churches of Lalibela',
    country: 'Ethiopia',
    region: 'Africa',
    coordinates: [39.0472, 12.0316],
    flag: '🇪🇹',
    description: '11 medieval monolithic churches carved from solid rock. A mysterious pilgrimage site.',
    longDescription: 'These extraordinary churches were carved from the top down out of single blocks of granite in the 12th and 13th centuries. According to legend, they were built overnight with the help of angels. Lalibela remains an active pilgrimage site, with thousands visiting during religious festivals.',
    rating: 4.8,
    reviews: 5600,
    price: 50,
    duration: 'Full day',
    bestTimeToVisit: 'September to February',
    category: 'Historical',
    images: [
      '/images/lalibela-church.jpg',
      '/images/lalibela-cross.jpg',
      '/images/lalibela-priest.jpg'
    ],
    highlights: [
      'Church of Saint George (Bete Giyorgis)',
      'Underground tunnels and passages',
      'Ancient manuscripts',
      'Religious ceremonies',
      'Timkat festival (January)'
    ],
    history: {
      period: '12th-13th century',
      builder: 'King Gebre Mesqel Lalibela',
      purpose: 'New Jerusalem for Christian pilgrims',
      unesco: 'World Heritage Site since 1978',
      mysteries: [
        'How were they carved with such precision?',
        'The exact construction methods remain debated',
        'Purpose of some underground chambers',
        'Connection to the Knights Templar legend'
      ]
    },
    tips: [
      'Dress modestly for this religious site',
      'Remove shoes before entering churches',
      'Hire a local guide for historical context',
      'Visit during Timkat festival for unique experience'
    ]
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar Stone Town',
    country: 'Tanzania',
    region: 'Africa',
    coordinates: [39.1925, -6.1659],
    flag: '🇹🇿',
    description: 'A labyrinth of narrow alleys, historic buildings, and exotic spices.',
    longDescription: 'Stone Town is the old part of Zanzibar City, with a rich history as a trading hub for spices, slaves, and ivory. Its architecture reflects Swahili, Arab, Persian, Indian, and European influences. The town\'s narrow streets hide centuries of stories.',
    rating: 4.6,
    reviews: 7800,
    price: 40,
    duration: 'Full day',
    bestTimeToVisit: 'June to October',
    category: 'Cultural',
    images: [
      '/images/zanzibar-streets.jpg',
      '/images/zanzibar-doors.jpg',
      '/images/zanzibar-spices.jpg'
    ],
    highlights: [
      'Historic carved doors',
      'Spice markets',
      'House of Wonders',
      'Old Fort',
      'Spice farm tours'
    ],
    history: {
      period: 'Founded in 18th century',
      unesco: 'World Heritage Site since 2000',
      trade: 'Major Indian Ocean trading port',
      influences: 'Swahili, Arab, Persian, Indian, European',
      facts: [
        'Freddie Mercury was born in Zanzibar',
        'Once the center of the spice trade',
        'Famous for cloves, cinnamon, and nutmeg',
        'Historic slave market memorial'
      ]
    },
    tips: [
      'Get lost in the narrow alleys',
      'Take a spice tour',
      'Visit the rooftop cafes',
      'Combine with beach time'
    ]
  },
  {
    id: 'drakensberg',
    name: 'Drakensberg Mountains',
    country: 'South Africa/Lesotho',
    region: 'Africa',
    coordinates: [29.2500, -29.2500],
    flag: '🇿🇦',
    description: 'The Dragon Mountains, home to ancient San rock art and dramatic peaks.',
    longDescription: 'The Drakensberg is the highest mountain range in Southern Africa, rising to over 3,400 meters. The range contains the largest concentration of San rock paintings in sub-Saharan Africa, with over 20,000 individual paintings dating back thousands of years.',
    rating: 4.7,
    reviews: 6200,
    price: 35,
    duration: '2-3 days',
    bestTimeToVisit: 'April to October',
    category: 'Natural',
    images: [
      '/images/drakensberg-peaks.jpg',
      '/images/drakensberg-rock-art.jpg',
      '/images/drakensberg-hiking.jpg'
    ],
    highlights: [
      'San rock art sites',
      'Amphitheatre cliff face',
      'Hiking trails',
      'Tugela Falls',
      'Giant\'s Castle'
    ],
    history: {
      period: 'Formed over 180 million years ago',
      sanArt: 'Over 20,000 rock paintings',
      height: '3,482 meters at highest point',
      unesco: 'World Heritage Site since 2000',
      facts: [
        'Home to over 200 bird species',
        'Tugela Falls is Africa\'s second-highest waterfall',
        'San people lived here for over 4,000 years',
        'Name means "Dragon Mountain" in Afrikaans'
      ]
    },
    tips: [
      'Bring good hiking boots',
      'Book guided rock art tours',
      'Weather can change quickly',
      'Stay in mountain chalets'
    ]
  },
  {
    id: 'timbuktu',
    name: 'Timbuktu',
    country: 'Mali',
    region: 'Africa',
    coordinates: [-3.0094, 16.7666],
    flag: '🇲🇱',
    description: 'The legendary city of gold, once a center of Islamic scholarship and trade.',
    longDescription: 'Timbuktu was once the wealthiest city in the world and a major center of Islamic learning. Its ancient manuscripts, numbering in the hundreds of thousands, contain knowledge on astronomy, medicine, law, and theology. The city\'s three great mosques still stand as testaments to its golden age.',
    rating: 4.5,
    reviews: 2100,
    price: 150,
    duration: '2-3 days',
    bestTimeToVisit: 'November to February',
    category: 'Historical',
    images: [
      '/images/timbuktu-mosque.jpg',
      '/images/timbuktu-manuscripts.jpg',
      '/images/timbuktu-desert.jpg'
    ],
    highlights: [
      'Djinguereber Mosque',
      'Sankore University',
      'Ancient manuscripts',
      'Sahara gateway',
      'Historic libraries'
    ],
    history: {
      period: 'Founded around 1100 AD',
      goldenAge: '14th-16th centuries',
      scholarship: 'Over 700,000 ancient manuscripts',
      unesco: 'World Heritage Site since 1988',
      mysteries: [
        'Hidden manuscripts yet to be discovered',
        'Secret passages in ancient buildings',
        'Lost treasures of Mali Empire',
        'Ancient astronomical knowledge'
      ]
    },
    tips: [
      'Check travel advisories before visiting',
      'Hire a local guide',
      'Respect religious customs',
      'Visit the manuscript libraries'
    ]
  },
  {
    id: 'okavango',
    name: 'Okavango Delta',
    country: 'Botswana',
    region: 'Africa',
    coordinates: [23.2333, -19.2833],
    flag: '🇧🇼',
    description: 'The world\'s largest inland delta, a paradise of waterways and wildlife.',
    longDescription: 'The Okavango Delta is formed when the Okavango River reaches a tectonic trough and evaporates into the Kalahari Desert. This unique ecosystem floods annually, creating a seasonal wetland that attracts incredible wildlife. It\'s one of the few places where you can see the Big Five from a traditional mokoro (dugout canoe).',
    rating: 4.9,
    reviews: 5400,
    price: 500,
    duration: '3-5 days',
    bestTimeToVisit: 'May to September (dry season)',
    category: 'Wildlife',
    images: [
      '/images/okavango-aerial.jpg',
      '/images/okavango-mokoro.jpg',
      '/images/okavango-elephant.jpg'
    ],
    highlights: [
      'Mokoro canoe safaris',
      'Big Five game viewing',
      'Bird watching (400+ species)',
      'Luxury lodges',
      'Night game drives'
    ],
    history: {
      period: 'Formed over thousands of years',
      size: '22,000 square kilometers',
      unesco: 'World Heritage Site since 2014',
      wildlife: 'Home to endangered species',
      facts: [
        'One of the last remaining giant wildernesses',
        'Flood waters travel 1,200 km from Angola',
        'Takes a month to reach the delta',
        'Supports 200,000 large mammals'
      ]
    },
    tips: [
      'Book luxury lodges in advance',
      'Combine mokoro and vehicle safaris',
      'Bring light clothing for daytime',
      'Excellent for photography'
    ]
  }
];

// Mysterious destinations from around the world
export const MYSTERIOUS_DESTINATIONS = [
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    country: 'United Kingdom',
    mystery: 'How were these massive stones transported and erected?',
    age: '5,000 years old',
    coordinates: [-1.8262, 51.1789],
    flag: '🇬🇧'
  },
  {
    id: 'easter-island',
    name: 'Easter Island (Rapa Nui)',
    country: 'Chile',
    mystery: 'Who created the massive Moai statues and how?',
    age: '1,000-1,500 years old',
    coordinates: [-109.4333, -27.1127],
    flag: '🇨🇱'
  },
  {
    id: 'nazca-lines',
    name: 'Nazca Lines',
    country: 'Peru',
    mystery: 'Why were these giant geoglyphs created and how viewed from above?',
    age: '2,000 years old',
    coordinates: [-75.1278, -14.7389],
    flag: '🇵🇪'
  },
  {
    id: 'bermuda-triangle',
    name: 'Bermuda Triangle',
    country: 'Atlantic Ocean',
    mystery: 'Why do ships and planes mysteriously disappear?',
    age: 'Modern mystery',
    coordinates: [-64.7573, 26.0],
    flag: '🌊'
  },
  {
    id: 'atlantis',
    name: 'Lost City of Atlantis (Legendary)',
    country: 'Unknown',
    mystery: 'Did this advanced civilization really exist?',
    age: '9,000+ years ago (legend)',
    coordinates: [-60.0, 30.0],
    flag: '🏛️'
  },
  {
    id: 'great-zimbabwe',
    name: 'Great Zimbabwe',
    country: 'Zimbabwe',
    mystery: 'How was this massive stone city built without mortar?',
    age: '800 years old',
    coordinates: [30.9269, -20.2681],
    flag: '🇿🇼'
  },
  {
    id: 'axum',
    name: 'Axum Obelisks',
    country: 'Ethiopia',
    mystery: 'How were these 1,700-year-old monoliths carved and erected?',
    age: '1,700 years old',
    coordinates: [38.7228, 14.1211],
    flag: '🇪🇹'
  },
  {
    id: 'derinkuyu',
    name: 'Derinkuyu Underground City',
    country: 'Turkey',
    mystery: 'Who built this 18-level underground city and why?',
    age: '3,000+ years old',
    coordinates: [34.7108, 38.3552],
    flag: '🇹🇷'
  }
];

// Hidden gems and lesser-known destinations
export const HIDDEN_GEMS = [
  {
    id: 'socotra',
    name: 'Socotra Island',
    country: 'Yemen',
    description: 'The most alien-looking place on Earth with unique Dragon Blood Trees',
    flag: '🇾🇪'
  },
  {
    id: 'faroe-islands',
    name: 'Faroe Islands',
    country: 'Denmark',
    description: 'Dramatic cliffs, waterfalls, and Nordic culture off the beaten path',
    flag: '🇫🇴'
  },
  {
    id: 'bhutan',
    name: 'Bhutan',
    country: 'Bhutan',
    description: 'The Last Shangri-La, measuring Gross National Happiness',
    flag: '🇧🇹'
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    country: 'Madagascar',
    description: '90% of wildlife found nowhere else on Earth',
    flag: '🇲🇬'
  },
  {
    id: 'georgia',
    name: 'Georgia (Country)',
    country: 'Georgia',
    description: 'Ancient wine culture, mountain villages, and hospitality',
    flag: '🇬🇪'
  },
  {
    id: 'oman',
    name: 'Oman',
    country: 'Oman',
    description: 'Authentic Arabian experience without the glitz',
    flag: '🇴🇲'
  }
];

export default {
  african: AFRICAN_DESTINATIONS,
  mysterious: MYSTERIOUS_DESTINATIONS,
  hiddenGems: HIDDEN_GEMS
};

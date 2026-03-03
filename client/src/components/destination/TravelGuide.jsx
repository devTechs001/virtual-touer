import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Lightbulb, Shield, Wallet, Plane, Utensils, Camera, Heart, Info, ChevronDown, ChevronUp, Search } from 'lucide-react';

/**
 * TravelGuide Component
 * Features:
 * - Comprehensive travel tips (offline)
 * - Packing lists
 * - Cultural etiquette
 * - Safety tips
 * - Budget advice
 */

const TRAVEL_TIPS = {
  general: [
    {
      category: 'Before You Go',
      icon: Plane,
      tips: [
        'Check passport validity (6+ months recommended)',
        'Research visa requirements early',
        'Get travel insurance',
        'Make copies of important documents',
        'Notify your bank of travel plans',
        'Download offline maps',
        'Learn basic local phrases'
      ]
    },
    {
      category: 'Packing Essentials',
      icon: Camera,
      tips: [
        'Pack light - you can always do laundry',
        'Bring a universal power adapter',
        'Pack a portable charger',
        'Include a basic first aid kit',
        'Bring comfortable walking shoes',
        'Pack a reusable water bottle',
        'Include a light jacket even for warm destinations'
      ]
    },
    {
      category: 'Money & Budget',
      icon: Wallet,
      tips: [
        'Carry multiple payment methods',
        'Keep some local currency for emergencies',
        'Use ATMs at banks for better rates',
        'Notify your bank before traveling',
        'Track your expenses daily',
        'Budget for unexpected costs',
        'Consider travel credit cards with no foreign fees'
      ]
    },
    {
      category: 'Safety First',
      icon: Shield,
      tips: [
        'Keep emergency numbers handy',
        'Share your itinerary with someone',
        'Avoid displaying valuables',
        'Use hotel safes for important items',
        'Stay aware of your surroundings',
        'Trust your instincts',
        'Know the location of your embassy'
      ]
    },
    {
      category: 'Local Culture',
      icon: Utensils,
      tips: [
        'Research local customs before arrival',
        'Dress appropriately for religious sites',
        'Learn basic greetings in local language',
        'Respect local traditions',
        'Ask before taking photos of people',
        'Understand tipping customs',
        'Be mindful of photography restrictions'
      ]
    }
  ],
  regional: {
    Europe: [
      'Many museums offer free entry on first Sunday of month',
      'Validate train tickets before boarding',
      'Tipping is less common than in US',
      'Many shops close on Sundays',
      'Carry cash - some places don\'t accept cards'
    ],
    Asia: [
      'Remove shoes before entering temples/homes',
      'Use right hand for giving/receiving',
      'Avoid touching people\'s heads',
      'Bargaining is common in markets',
      'Carry small bills for tips'
    ],
    'Middle East': [
      'Dress conservatively',
      'Avoid public displays of affection',
      'Ramadan affects restaurant hours',
      'Friday is often the day off',
      'Ask permission before photographing'
    ],
    'South America': [
      'Learn basic Spanish/Portuguese',
      'Avoid drinking tap water',
      'Be cautious with street food initially',
      'Use registered taxis only',
      'Keep valuables hidden'
    ],
    Africa: [
      'Get recommended vaccinations',
      'Carry malaria prophylaxis if needed',
      'Respect wildlife distances',
      'Support local businesses',
      'Ask before photographing'
    ],
    'North America': [
      'Tipping is expected (15-20%)',
      'Sales tax added at checkout',
      'ID required for alcohol purchase',
      'Jaywalking fines in major cities',
      'Emergency number is 911'
    ],
    Oceania: [
      'Sun protection is essential',
      'Respect indigenous cultures',
      'Be aware of wildlife dangers',
      'Tipping not expected but appreciated',
      'Emergency number is 000 (AU) / 111 (NZ)'
    ]
  }
};

const PACKING_LISTS = {
  essentials: [
    'Passport/ID',
    'Visa documents',
    'Travel insurance',
    'Flight tickets',
    'Hotel reservations',
    'Credit/debit cards',
    'Cash (local currency)',
    'Phone & charger',
    'Power adapter',
    'Medications'
  ],
  clothing: [
    'Underwear & socks',
    'T-shirts/shirts',
    'Pants/shorts',
    'Comfortable shoes',
    'Sandals',
    'Light jacket',
    'Sleepwear',
    'Swimwear',
    'Hat/cap',
    'Sunglasses'
  ],
  toiletries: [
    'Toothbrush & toothpaste',
    'Deodorant',
    'Shampoo & soap',
    'Sunscreen',
    'Insect repellent',
    'Razor',
    'Hairbrush/comb',
    'Skincare products',
    'Prescription meds',
    'First aid kit'
  ],
  electronics: [
    'Phone',
    'Camera',
    'Laptop/tablet',
    'Headphones',
    'Portable charger',
    'Memory cards',
    'E-reader',
    'Universal adapter',
    'Charging cables',
    'Smartwatch'
  ],
  miscellaneous: [
    'Reusable water bottle',
    'Day backpack',
    'Travel pillow',
    'Eye mask',
    'Earplugs',
    'Umbrella/raincoat',
    'Snacks',
    'Book/magazine',
    'Pen (for forms)',
    'Laundry bag'
  ]
};

const TravelGuide = ({ destination, selectedCategory }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tips'); // 'tips', 'packing', 'culture'
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const toggleItem = (item) => {
    setCheckedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const filteredTips = useMemo(() => {
    if (!searchQuery) return TRAVEL_TIPS.general;
    
    return TRAVEL_TIPS.general
      .map(cat => ({
        ...cat,
        tips: cat.tips.filter(tip =>
          tip.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(cat => cat.tips.length > 0);
  }, [searchQuery]);

  const regionalTips = destination?.region ? TRAVEL_TIPS.regional[destination.region] : null;

  const packingProgress = useMemo(() => {
    const totalItems = Object.values(PACKING_LISTS).flat().length;
    return Math.round((checkedItems.length / totalItems) * 100);
  }, [checkedItems]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Book className="w-8 h-8 text-primary-500" />
          <h2 className="text-2xl font-bold text-white">Travel Guide</h2>
        </div>
        <p className="text-dark-400">Essential tips for your journey</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          type="text"
          placeholder="Search tips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'tips', label: 'Travel Tips', icon: Lightbulb },
          { id: 'packing', label: 'Packing List', icon: Camera },
          { id: 'culture', label: 'Culture & Safety', icon: Heart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar for Packing */}
      {activeTab === 'packing' && (
        <div className="mb-6 bg-dark-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-400">Packing Progress</span>
            <span className="text-sm font-semibold text-primary-400">{packingProgress}%</span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-300"
              initial={{ width: 0 }}
              animate={{ width: `${packingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-xs text-dark-500">
            {checkedItems.length} of {Object.values(PACKING_LISTS).flat().length} items packed
          </div>
        </div>
      )}

      {/* Regional Tips */}
      {regionalTips && activeTab !== 'packing' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-primary-500/20 to-dark-800 rounded-xl border border-primary-500/30 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary-400" />
            <h3 className="font-semibold text-white">Tips for {destination?.region}</h3>
          </div>
          <ul className="space-y-1">
            {regionalTips.map((tip, idx) => (
              <li key={idx} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-primary-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tips' && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {filteredTips.map((category, idx) => (
              <div
                key={idx}
                className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-primary-400" />
                    <span className="font-semibold text-white">{category.category}</span>
                  </div>
                  {expandedCategory === category.category ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedCategory === category.category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="p-4 pt-0 space-y-2">
                        {category.tips.map((tip, tipIdx) => (
                          <li
                            key={tipIdx}
                            className="flex items-start gap-2 text-dark-300 text-sm"
                          >
                            <span className="text-primary-400 mt-1">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'packing' && (
          <motion.div
            key="packing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {Object.entries(PACKING_LISTS).map(([category, items]) => (
              <div
                key={category}
                className="bg-dark-800 rounded-xl border border-dark-700 p-4"
              >
                <h3 className="font-semibold text-white mb-3 capitalize flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary-400" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        checkedItems.includes(item)
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'hover:bg-dark-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(item)}
                        onChange={() => toggleItem(item)}
                        className="w-4 h-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                      />
                      <span className={`text-sm ${
                        checkedItems.includes(item) ? 'line-through' : ''
                      }`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'culture' && (
          <motion.div
            key="culture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Cultural Etiquette */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Cultural Etiquette
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Respect Local Customs</div>
                    <p className="text-sm text-dark-400">
                      Research and follow local traditions, especially at religious sites. 
                      Dress modestly when required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Learn Basic Phrases</div>
                    <p className="text-sm text-dark-400">
                      Hello, thank you, please, and excuse me in the local language 
                      go a long way in showing respect.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Photography Etiquette</div>
                    <p className="text-sm text-dark-400">
                      Always ask permission before photographing people. 
                      Some places prohibit photography entirely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Safety Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: 'Emergency Numbers', desc: 'Know local emergency numbers' },
                  { title: 'Embassy Location', desc: 'Note your embassy address' },
                  { title: 'Travel Insurance', desc: 'Keep policy details handy' },
                  { title: 'Document Copies', desc: 'Store digital copies securely' },
                  { title: 'Local Laws', desc: 'Research important regulations' },
                  { title: 'Health Precautions', desc: 'Know required vaccinations' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white text-sm">{item.title}</div>
                      <div className="text-xs text-dark-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Tips */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-yellow-400" />
                Budget Tips
              </h3>
              <ul className="space-y-2">
                {[
                  'Use public transportation instead of taxis',
                  'Eat where locals eat for authentic, cheaper meals',
                  'Book attractions online for discounts',
                  'Carry a reusable water bottle',
                  'Take advantage of free walking tours',
                  'Visit free museums and parks'
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-dark-300">
                    <span className="text-yellow-400">💰</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelGuide;

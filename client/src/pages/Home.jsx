import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Play, 
  MapPin, 
  Globe2, 
  Compass, 
  Camera,
  Star,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import TourGrid from '../components/tours/TourGrid';
import { useFeaturedTours, usePopularTours } from '../hooks/useTours';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    title: 'Explore the Alps',
    subtitle: 'Switzerland'
  },
  {
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920',
    title: 'Discover Venice',
    subtitle: 'Italy'
  },
  {
    image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1920',
    title: 'Ancient Wonders',
    subtitle: 'Egypt'
  }
];

const features = [
  {
    icon: Globe2,
    title: '360° Virtual Tours',
    description: 'Immerse yourself in stunning panoramic views from anywhere in the world.'
  },
  {
    icon: Compass,
    title: 'AR Navigation',
    description: 'Experience destinations with augmented reality guides and information.'
  },
  {
    icon: Camera,
    title: 'Live Experiences',
    description: 'Join live-guided tours with local experts in real-time.'
  }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const { data: featuredTours, isLoading: featuredLoading } = useFeaturedTours();
  const { data: popularTours, isLoading: popularLoading } = usePopularTours();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/30 to-dark-900" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Explore 10,000+ Virtual Destinations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white max-w-4xl mb-6"
          >
            Travel the World
            <br />
            <span className="gradient-text">Without Limits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl mb-8"
          >
            Experience breathtaking destinations through immersive virtual tours, 
            360° panoramas, and AR-enhanced exploration.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full max-w-2xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle search
              }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to explore?"
                className="w-full pl-12 pr-36 py-4 bg-dark-800/80 backdrop-blur-lg border border-dark-700 rounded-2xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-6"
              >
                Explore
              </button>
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <span className="text-dark-500 text-sm">Popular:</span>
            {['Paris', 'Tokyo', 'New York', 'Bali'].map((place) => (
              <Link
                key={place}
                to={`/explore?q=${place}`}
                className="px-4 py-2 rounded-full bg-dark-800/50 text-dark-300 hover:text-white hover:bg-dark-700 transition-all text-sm"
              >
                {place}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-dark-500 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Experience Travel Like Never Before
            </h2>
            <p className="section-subtitle mx-auto">
              Our cutting-edge technology brings destinations to life with immersive 
              experiences you can enjoy from anywhere.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:bg-dark-800 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-6 group-hover:bg-primary-500/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-dark-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 px-4 bg-dark-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title"
              >
                Featured Tours
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="section-subtitle"
              >
                Hand-picked virtual experiences from around the world
              </motion.p>
            </div>
            <Link
              to="/explore?featured=true"
              className="hidden sm:flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <TourGrid 
            tours={featuredTours?.tours || []} 
            isLoading={featuredLoading}
          />

          <div className="mt-8 text-center sm:hidden">
            <Link to="/explore?featured=true" className="btn-primary">
              View All Featured Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Tours Section */}
      <section className="py-20 px-4 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title"
              >
                Popular Right Now
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="section-subtitle"
              >
                See what other travelers are exploring
              </motion.p>
            </div>
            <Link
              to="/explore?sort=popular"
              className="hidden sm:flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <TourGrid 
            tours={popularTours?.tours || []} 
            isLoading={popularLoading}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary-600/20 to-secondary-600/20 border border-primary-500/30"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
              Create a free account to save your favorite destinations, 
              book virtual experiences, and access exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/explore" className="btn-outline text-lg px-8 py-4">
                Explore Tours
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
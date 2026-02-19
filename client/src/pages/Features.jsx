import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Globe2, 
  Compass, 
  Camera, 
  Users, 
  Award, 
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Globe2,
    title: '360° Virtual Tours',
    description: 'Explore destinations in stunning panoramic detail. Rotate, zoom, and navigate immersive environments as if you were actually there.'
  },
  {
    icon: Compass,
    title: 'AR Navigation',
    description: 'Experience augmented reality guides that bring destinations to life with interactive information and directions.'
  },
  {
    icon: Camera,
    title: 'Live Experiences',
    description: 'Join live-guided tours with local experts in real-time and ask questions directly to experienced guides.'
  },
  {
    icon: Users,
    title: 'Community Tours',
    description: 'Explore with friends through our collaborative tour experiences and share discoveries.'
  },
  {
    icon: Award,
    title: 'Curated Collections',
    description: 'Handpicked tours organized by themes, difficulty levels, and local expertise.'
  },
  {
    icon: Heart,
    title: 'Personalized Recommendations',
    description: 'AI-powered suggestions based on your interests, travel history, and preferences.'
  }
];

const stats = [
  { number: '500+', label: 'Destinations' },
  { number: '1000+', label: 'Virtual Tours' },
  { number: '50K+', label: 'Active Users' },
  { number: '100+', label: 'Expert Guides' }
];

export default function Features() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary-500" />
              </div>
            </div>
            <h1 className="section-title">Powerful Features</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Discover what makes Virtual Tourist the world's most immersive travel platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-dark-700">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <p className="text-dark-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group p-8 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-dark-700">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Explore the World?
            </h2>
            <p className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto">
              Start your virtual journey today and discover thousands of immersive experiences
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            >
              Explore Tours
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

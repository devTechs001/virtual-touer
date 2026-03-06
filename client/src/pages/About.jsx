import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Globe2, Award, ArrowRight, Code, Palette, Server, Smartphone } from 'lucide-react';

const devTeam = [
  { name: 'Wanjiru Kamau', role: 'Founder & CEO', image: 'https://i.pravatar.cc/150?img=5', icon: Users },
  { name: 'Omondi Okello', role: 'CTO', image: 'https://i.pravatar.cc/150?img=11', icon: Server },
  { name: 'Achieng Odhiambo', role: 'Head of Design', image: 'https://i.pravatar.cc/150?img=9', icon: Palette },
  { name: 'Kipchoge Kiprop', role: 'Lead Developer', image: 'https://i.pravatar.cc/150?img=13', icon: Code },
  { name: 'Njeri Mwangi', role: 'Mobile Lead', image: 'https://i.pravatar.cc/150?img=10', icon: Smartphone },
  { name: 'Mutua Kimani', role: 'Head of Community', image: 'https://i.pravatar.cc/150?img=12', icon: Heart }
];

const values = [
  {
    icon: Globe2,
    title: 'Global Accessibility',
    description: 'Making world travel accessible to everyone, regardless of location or ability.'
  },
  {
    icon: Heart,
    title: 'Passion for Discovery',
    description: 'We believe travel transforms lives and broadens perspectives.'
  },
  {
    icon: Target,
    title: 'Innovation First',
    description: 'Constantly pushing the boundaries of what\'s possible with virtual reality and AR.'
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'Every tour is carefully curated to deliver authentic, high-quality experiences.'
  }
];

export default function About() {
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
            <h1 className="section-title">About Virtual Tourist</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Revolutionizing how people explore the world through immersive virtual experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-b border-dark-700">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-dark-400 mb-4 leading-relaxed text-lg">
                Virtual Tourist was founded with a simple mission: to make world travel accessible to everyone. We believe that geographical boundaries and physical limitations shouldn't prevent anyone from experiencing the world's most incredible destinations.
              </p>
              <p className="text-dark-400 leading-relaxed text-lg">
                Through cutting-edge virtual reality and augmented reality technology, we're creating immersive experiences that transport you to the heart of the world's most captivating places.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600"
                alt="Our mission"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-b border-dark-700">
        <div className="page-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center text-white"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">{value.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-b border-dark-700">
        <div className="page-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4 text-center text-white"
          >
            Meet Our Development Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-dark-400 text-center max-w-2xl mx-auto mb-12"
          >
            Proudly built in Kenya 🇰🇪 by a talented team of developers, designers, and innovators
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devTeam.map((member, i) => {
              const Icon = member.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center group bg-dark-800/50 rounded-2xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 mx-auto max-w-xs">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary-400" />
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  </div>
                  <p className="text-primary-400">{member.role}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kenya Roots Section */}
      <section className="py-20 border-b border-dark-700 bg-gradient-to-br from-green-900/20 via-black-900/20 to-red-900/20">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">🇰🇪 Proudly Kenyan</h2>
            <p className="text-xl text-dark-400 max-w-3xl mx-auto">
              Born in Nairobi, built for the world. We're a Kenyan tech company bringing
              African innovation to the global travel industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
            >
              <div className="text-4xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold text-white mb-2">Nairobi HQ</h3>
              <p className="text-dark-400">
                Operating from Silicon Savannah, Nairobi's thriving tech hub
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
            >
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Local Talent</h3>
              <p className="text-dark-400">
                Empowering Kenyan developers, designers, and content creators
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
            >
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
              <p className="text-dark-400">
                Showcasing Kenya's beauty while connecting the world virtually
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline/History Section */}
      <section className="py-20 border-b border-dark-700">
        <div className="page-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center text-white"
          >
            Our Journey
          </motion.h2>

          <div className="max-w-2xl mx-auto space-y-8">
            {[
              { year: '2020', title: 'Founded in Nairobi', description: 'Virtual Tourist launched from Nairobi, Kenya with vision to democratize travel' },
              { year: '2021', title: '10K Users', description: 'Reached 10,000 active users and expanded tour library with African destinations' },
              { year: '2022', title: 'Series A Funding', description: 'Raised $5M in Series A to accelerate platform development and hire local talent' },
              { year: '2023', title: '100K Users', description: 'Milestone of 100,000 users exploring virtually worldwide, showcasing Kenya\'s beauty' },
              { year: '2024', title: 'Global Expansion', description: 'Expanded to 50+ countries with localized content, proudly flying the Kenyan flag' }
            ].map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={`flex gap-6 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all">
                    <p className="text-primary-400 font-semibold mb-2">{milestone.year}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-dark-400">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary-500 mt-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Join Our Community
            </h2>
            <p className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto">
              Start exploring the world with thousands of travelers discovering new perspectives every day
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                Explore Tours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-dark-700 border border-dark-600 text-white font-semibold hover:border-primary-500/50 transition-all"
              >
                <Users className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

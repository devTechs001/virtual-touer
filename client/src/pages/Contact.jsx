import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, ExternalLink, MessageSquare, Clock, Globe2 } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@virtualtourist.co.ke',
    description: 'We reply within 24 hours'
  },
  {
    icon: Phone,
    title: 'Phone (Kenya)',
    value: '+254 700 123 456',
    description: 'Mon-Sat, 8am-6pm EAT'
  },
  {
    icon: Phone,
    title: 'Phone (US)',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-5pm EST'
  },
  {
    icon: MapPin,
    title: 'Nairobi HQ',
    value: 'Westlands, Nairobi',
    description: 'Silicon Savannah, Kenya'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'EAT (UTC+3)',
    description: 'East Africa Time'
  },
  {
    icon: Globe2,
    title: 'Global Support',
    value: '24/7 Online',
    description: 'Chat support available'
  }
];

const socialLinks = [
  { name: 'Twitter', url: 'https://twitter.com/virtualtourist' },
  { name: 'Facebook', url: 'https://facebook.com/virtualtourist' },
  { name: 'Instagram', url: 'https://instagram.com/virtualtourist' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/virtualtourist' },
  { name: 'TikTok', url: 'https://tiktok.com/@virtualtourist' }
];

const regionalOffices = [
  {
    region: '🇰🇪 Kenya (HQ)',
    address: 'Westlands Business Park, Nairobi',
    phone: '+254 700 123 456',
    email: 'kenya@virtualtourist.co.ke'
  },
  {
    region: '🇹🇿 Tanzania',
    address: 'Upanga Road, Dar es Salaam',
    phone: '+255 22 123 4567',
    email: 'tanzania@virtualtourist.co.tz'
  },
  {
    region: '🇺🇬 Uganda',
    address: 'Kampala Road, Kampala',
    phone: '+256 41 123 4567',
    email: 'uganda@virtualtourist.co.ug'
  },
  {
    region: '🇷🇼 Rwanda',
    address: 'KN 3 Avenue, Kigali',
    phone: '+250 252 123 456',
    email: 'rwanda@virtualtourist.co.rw'
  },
  {
    region: '🇿🇦 South Africa',
    address: 'Sandton, Johannesburg',
    phone: '+27 11 123 4567',
    email: 'southafrica@virtualtourist.co.za'
  },
  {
    region: '🇺🇸 United States',
    address: '123 Tech Avenue, San Francisco, CA',
    phone: '+1 (555) 123-4567',
    email: 'usa@virtualtourist.com'
  }
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Contact form submitted:', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Hero Section with African-inspired gradient */}
      <section className="relative py-24 bg-gradient-to-br from-primary-900/30 via-dark-900 to-secondary-900/30 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"></div>
        </div>

        <div className="page-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl shadow-primary-500/50">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 text-center hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{method.title}</h3>
                  <p className="text-primary-400 font-semibold mb-1">{method.value}</p>
                  <p className="text-dark-500 text-sm">{method.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="page-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card p-8 md:p-10 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-dark-700/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Subject
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300 resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-20 bg-gradient-to-br from-dark-900/50 to-dark-950/50 border-t border-dark-800">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">🌍 Our Regional Offices</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Headquartered in Nairobi, with offices across East Africa and beyond
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalOffices.map((office, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`group p-6 rounded-2xl bg-dark-800/30 border backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                  i === 0
                    ? 'lg:col-span-2 border-primary-500/40 bg-primary-500/5 hover:shadow-primary-500/10'
                    : 'border-dark-700/50 hover:border-primary-500/30 hover:bg-dark-800/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{office.region.split(' ')[0]}</span>
                  <h3 className="text-lg font-bold text-white">{office.region.split(' ').slice(1).join(' ')}</h3>
                </div>
                <div className="space-y-3 text-dark-400 text-sm">
                  <p className="flex items-center gap-2 group-hover:text-primary-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary-400" />
                    </div>
                    {office.address}
                  </p>
                  <p className="flex items-center gap-2 group-hover:text-primary-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary-400" />
                    </div>
                    {office.phone}
                  </p>
                  <p className="flex items-center gap-2 group-hover:text-primary-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary-400" />
                    </div>
                    {office.email}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Africa-First Features */}
      <section className="py-20 bg-gradient-to-br from-green-900/5 via-transparent to-red-900/5 border-t border-dark-800">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">🇰🇪 Africa-First Platform</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Proudly African, we showcase the beauty and diversity of our continent first
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { flag: '🇰🇪', name: 'Kenya', tours: '50+ tours', highlight: 'Maasai Mara, Diani' },
              { flag: '🇹🇿', name: 'Tanzania', tours: '40+ tours', highlight: 'Serengeti, Zanzibar' },
              { flag: '🇺🇬', name: 'Uganda', tours: '30+ tours', highlight: 'Gorillas, Nile' },
              { flag: '🇷🇼', name: 'Rwanda', tours: '25+ tours', highlight: 'Volcanoes NP' },
              { flag: '🇿🇦', name: 'South Africa', tours: '45+ tours', highlight: 'Cape Town, Safari' },
              { flag: '🇪🇹', name: 'Ethiopia', tours: '20+ tours', highlight: 'Lalibela' },
              { flag: '🇲🇦', name: 'Morocco', tours: '35+ tours', highlight: 'Marrakech, Sahara' },
              { flag: '🇪🇬', name: 'Egypt', tours: '40+ tours', highlight: 'Pyramids, Luxor' }
            ].map((country, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group text-center p-5 rounded-2xl bg-dark-800/30 border border-dark-700/50 hover:border-primary-500/40 hover:bg-dark-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <motion.span
                  className="text-4xl md:text-5xl mb-3 block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {country.flag}
                </motion.span>
                <h3 className="font-bold text-white mb-1">{country.name}</h3>
                <p className="text-primary-400 text-sm font-medium">{country.tours}</p>
                <p className="text-dark-500 text-xs mt-2 group-hover:text-dark-400 transition-colors">{country.highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 bg-dark-900/50 border-t border-dark-800">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Follow Us</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-800/50 hover:bg-primary-500/20 border border-dark-700 hover:border-primary-500/50 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20"
                >
                  {link.name}
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

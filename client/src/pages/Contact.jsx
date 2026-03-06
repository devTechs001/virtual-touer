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
    <div className="min-h-screen">
      <section className="relative py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <MessageSquare className="w-12 h-12 text-primary-500" />
            </div>
            <h1 className="section-title">Get in Touch</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-b border-dark-700">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 text-center hover:border-primary-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{method.title}</h3>
                  <p className="text-primary-400 font-semibold mb-1">{method.value}</p>
                  <p className="text-dark-400 text-sm">{method.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Subject
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : (
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
      <section className="py-20 border-b border-dark-700">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">🌍 Our Regional Offices</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Headquartered in Nairobi, with offices across East Africa and beyond
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalOffices.map((office, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all ${
                  i === 0 ? 'lg:col-span-2 border-primary-500/30 bg-primary-500/5' : ''
                }`}
              >
                <h3 className="text-lg font-bold text-white mb-3">{office.region}</h3>
                <div className="space-y-2 text-dark-400 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-400" />
                    {office.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary-400" />
                    {office.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-400" />
                    {office.email}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Africa-First Features */}
      <section className="py-20 border-b border-dark-700 bg-gradient-to-br from-green-900/10 via-black-900/10 to-red-900/10">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">🇰🇪 Africa-First Platform</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Proudly African, we showcase the beauty and diversity of our continent first
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { flag: '🇰🇪', name: 'Kenya', tours: '50+ tours', highlight: 'Maasai Mara, Diani Beach' },
              { flag: '🇹🇿', name: 'Tanzania', tours: '40+ tours', highlight: 'Serengeti, Zanzibar' },
              { flag: '🇺🇬', name: 'Uganda', tours: '30+ tours', highlight: 'Gorillas, Nile' },
              { flag: '🇷🇼', name: 'Rwanda', tours: '25+ tours', highlight: 'Volcanoes, Kigali' },
              { flag: '🇿🇦', name: 'South Africa', tours: '45+ tours', highlight: 'Cape Town, Safari' },
              { flag: '🇪🇹', name: 'Ethiopia', tours: '20+ tours', highlight: 'Lalibela, Axum' },
              { flag: '🇲🇦', name: 'Morocco', tours: '35+ tours', highlight: 'Marrakech, Sahara' },
              { flag: '🇪🇬', name: 'Egypt', tours: '40+ tours', highlight: 'Pyramids, Luxor' }
            ].map((country, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-center p-4 rounded-xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all"
              >
                <span className="text-4xl mb-2 block">{country.flag}</span>
                <h3 className="font-bold text-white">{country.name}</h3>
                <p className="text-primary-400 text-sm">{country.tours}</p>
                <p className="text-dark-500 text-xs mt-2">{country.highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-dark-700 bg-dark-800/50">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-8 text-white">Follow Us</h2>
            <div className="flex justify-center gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-primary-500/20 border border-dark-600 hover:border-primary-500/50 text-white transition-all"
                >
                  {link.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

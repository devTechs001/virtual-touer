import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', to: '/features' },
      { label: 'Virtual Tours', to: '/explore' },
      { label: 'Destinations', to: '/destinations' },
      { label: 'Pricing', to: '/pricing' }
    ],
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Blog', to: '/blog' }
    ],
    support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-800 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                VTourist
              </span>
            </Link>
            <p className="text-dark-400 mb-6 max-w-sm">
              Explore the world from anywhere with immersive virtual tours, 
              360° experiences, and interactive travel guides.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-dark-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@vtourist.com</span>
              </div>
              <div className="flex items-center gap-3 text-dark-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-dark-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-dark-100 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-100 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-100 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {currentYear} Virtual Tourist. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 text-dark-500 hover:text-primary-400 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
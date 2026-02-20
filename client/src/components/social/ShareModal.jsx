import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  Share2,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { socialService } from '../../services/api';

const ShareModal = ({ isOpen, onClose, tour }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/tour/${tour?._id}`;
  const shareText = `Check out "${tour?.title}" on Virtual Tourist!`;

  const handleShare = async (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }

    // Track share
    try {
      await socialService.shareTour(tour._id, { platform });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      
      await socialService.shareTour(tour._id, { platform: 'copy' });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (!isOpen) return null;

  const shareButtons = [
    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-[#1877f2]' },
    { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'bg-[#1da1f2]' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'bg-[#0a66c2]' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'bg-[#25d366]' },
    { id: 'email', icon: Mail, label: 'Email', color: 'bg-dark-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Share Tour</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour Preview */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex gap-4">
            <img
              src={tour?.images?.[0]?.url || '/placeholder-tour.jpg'}
              alt={tour?.title}
              className="w-20 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-white line-clamp-1">{tour?.title}</h3>
              <p className="text-sm text-dark-400 line-clamp-2">{tour?.shortDescription}</p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {shareButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleShare(btn.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${btn.color} hover:opacity-90 transition-opacity`}
              >
                <btn.icon className="w-6 h-6 text-white" />
                <span className="text-xs text-white/80">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="flex items-center gap-2 p-3 bg-dark-700 rounded-xl">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-dark-300 text-sm outline-none"
            />
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                copied ? 'bg-secondary-500 text-white' : 'bg-dark-600 text-dark-300 hover:text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;
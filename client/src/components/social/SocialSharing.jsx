import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link as LinkIcon, Facebook, Twitter, Linkedin, Mail, MessageCircle, Copy, Check, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * SocialSharing Component
 * Features:
 * - Multiple social platforms
 * - Copy link functionality
 * - Share via native API
 * - Custom share text
 */

const SocialSharing = ({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check this out!',
  description = '',
  image = '',
  compact = false
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const sharePlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      getUrl: (shareUrl, shareTitle) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      getUrl: (shareUrl, shareTitle) => 
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      getUrl: (shareUrl, shareTitle) => 
        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      getUrl: (shareUrl, shareTitle) => 
        `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-dark-700',
      getUrl: (shareUrl, shareTitle) => 
        `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareTitle}\n\n${shareUrl}`)}`
    }
  ];

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          toast.error('Failed to share');
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  }, [title, description, url, showShareMenu]);

  const handleShareClick = useCallback((platform) => {
    const shareUrl = platform.getUrl(url, title);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  }, [url, title]);

  if (compact) {
    return (
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Share this</h3>
        <p className="text-sm text-dark-400">Share with friends and family</p>
      </div>

      {/* Native Share Button (Mobile) */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>Share via...</span>
        </button>
      )}

      {/* Share Options */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {sharePlatforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShareClick(platform)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl ${platform.color} hover:opacity-90 transition-opacity`}
          >
            <platform.icon className="w-6 h-6 text-white" />
            <span className="text-xs text-white font-medium">{platform.name}</span>
          </button>
        ))}
      </div>

      {/* Copy Link */}
      <div className="flex items-center gap-2 p-2 bg-dark-800 rounded-xl border border-dark-700">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-dark-900 rounded-lg">
          <LinkIcon className="w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent text-sm text-dark-400 truncate focus:outline-none"
          />
        </div>
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Share Menu Modal (for non-native share) */}
      <AnimatePresence>
        {showShareMenu && !navigator.share && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setShowShareMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-dark-900 rounded-t-2xl md:rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Share this</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="p-2 hover:bg-dark-800 rounded-lg"
                >
                  <Globe className="w-5 h-5 text-dark-400" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {sharePlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleShareClick(platform)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${platform.color} hover:opacity-90 transition-opacity`}
                  >
                    <platform.icon className="w-8 h-8 text-white" />
                    <span className="text-xs text-white font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowShareMenu(false)}
                className="w-full mt-6 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl text-white font-medium transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialSharing;

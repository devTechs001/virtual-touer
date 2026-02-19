import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Camera, 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard,
  Clock,
  Heart,
  LogOut,
  Check,
  ChevronRight,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import TourCard from '../components/tours/TourCard';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional()
});

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'history', label: 'Watch History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || ''
    }
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-32 md:h-48 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden">
            <div className="w-full h-full bg-[url('/patterns/topography.svg')] opacity-20" />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-12 px-4 md:px-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-dark-800 border-4 border-dark-900 overflow-hidden">
                {avatarPreview || user?.avatar ? (
                  <img
                    src={avatarPreview || user?.avatar}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-4xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2 bg-dark-800 rounded-full cursor-pointer hover:bg-dark-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-dark-400">{user?.email}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pb-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user?.stats?.toursViewed || 0}</p>
                <p className="text-sm text-dark-400">Tours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{favoritesData?.favorites?.length || 0}</p>
                <p className="text-sm text-dark-400">Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user?.stats?.totalWatchTime || 0}h</p>
                <p className="text-sm text-dark-400">Watch Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-2 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </button>
              ))}
              <hr className="my-2 border-dark-700" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Full Name
                      </label>
                      <input
                        {...register('name')}
                        disabled={!isEditing}
                        className="input disabled:opacity-60"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Email Address
                      </label>
                      <input
                        {...register('email')}
                        disabled={!isEditing}
                        className="input disabled:opacity-60"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="input resize-none disabled:opacity-60"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">Saved Tours</h2>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="card">
                        <div className="aspect-video skeleton" />
                        <div className="p-4 space-y-3">
                          <div className="h-6 skeleton rounded w-3/4" />
                          <div className="h-4 skeleton rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : favoritesData?.favorites?.length === 0 ? (
                  <div className="card p-12 text-center">
                    <Heart className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-dark-200 mb-2">
                      No saved tours yet
                    </h3>
                    <p className="text-dark-400 mb-6">
                      Start exploring and save tours you'd like to experience later
                    </p>
                    <a href="/explore" className="btn-primary">
                      Explore Tours
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoritesData.favorites.map((fav, index) => (
                      <TourCard key={fav._id} tour={fav.tour} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Notifications */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications', description: 'Receive updates via email' },
                      { label: 'Push notifications', description: 'Get notified on your device' },
                      { label: 'New tours alerts', description: 'Be notified about new tours in your saved destinations' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-sm text-dark-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Preferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Language
                      </label>
                      <select className="input">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Currency
                      </label>
                      <select className="input">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="card p-6 border-red-500/20">
                  <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-dark-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
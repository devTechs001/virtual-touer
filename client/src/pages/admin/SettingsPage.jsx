import { useState } from 'react';
import { Settings, Bell, Shield, Globe, Palette, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-dark-400 mt-1">Manage your admin preferences</p>
      </div>

      <div className="flex gap-2 border-b border-dark-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-dark-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Virtual Tourist"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Language
                  </label>
                  <select className="input">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
            {[
              { label: 'Email Notifications', desc: 'Receive email updates about bookings' },
              { label: 'Push Notifications', desc: 'Get browser push notifications' },
              { label: 'New User Alerts', desc: 'Be notified when new users register' },
              { label: 'Booking Alerts', desc: 'Get notified about new bookings' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-dark-400 text-sm">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Current Password
                </label>
                <input type="password" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  New Password
                </label>
                <input type="password" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <input type="password" className="input" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Appearance Settings</h3>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Dark', 'Light', 'System'].map((theme) => (
                  <button
                    key={theme}
                    className="p-4 rounded-xl border-2 border-dark-700 hover:border-primary-500 transition-colors"
                  >
                    <p className="text-white font-medium">{theme}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

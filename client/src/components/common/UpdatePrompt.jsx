import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

export default function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r?.active?.state === 'activated') {
        console.log('Service Worker active:', swUrl);
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration failed:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      console.log('App ready to work offline');
      setOfflineReady(false);
    }
    
    if (needRefresh) {
      setShowUpdate(true);
      toast.custom((t) => (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 shadow-xl flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-primary-400 animate-spin" />
          <div className="text-white">
            <p className="font-medium">New version available</p>
            <p className="text-sm text-dark-400">Click update to refresh the app</p>
          </div>
          <button
            onClick={() => {
              updateServiceWorker(true);
              setShowUpdate(false);
              toast.dismiss(t.id);
            }}
            className="btn-primary text-sm px-4 py-2 ml-2"
          >
            Update
          </button>
          <button
            onClick={() => {
              setShowUpdate(false);
              toast.dismiss(t.id);
            }}
            className="text-dark-400 hover:text-white p-2"
          >
            ✕
          </button>
        </div>
      ), {
        duration: Infinity,
        position: 'bottom-right',
      });
    }
  }, [offlineReady, needRefresh, setOfflineReady, setNeedRefresh, updateServiceWorker]);

  return null;
}

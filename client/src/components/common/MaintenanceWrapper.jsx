import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Navigate } from 'react-router-dom';

import { systemService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Maintenance from '../../pages/Maintenance';

const MaintenanceWrapper = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [bypassMaintenance, setBypassMaintenance] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: () => systemService.getMaintenanceStatus().then(res => res.data),
    refetchInterval: 60000, // Check every minute
    staleTime: 30000
  });

  const maintenance = data?.maintenance;

  // Check if user can bypass maintenance
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      setBypassMaintenance(true);
    } else {
      setBypassMaintenance(false);
    }
  }, [isAuthenticated, user]);

  // Don't block if loading or maintenance is not enabled
  if (isLoading || !maintenance?.enabled) {
    return children;
  }

  // Allow admins to bypass
  if (bypassMaintenance) {
    return (
      <>
        {/* Admin Maintenance Banner */}
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500/90 text-dark-900 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm font-medium">
            <span>🔧 Maintenance Mode Active - You have admin bypass</span>
            <a href="/admin/system" className="underline hover:no-underline">
              Manage
            </a>
          </div>
        </div>
        <div className="pt-10">
          {children}
        </div>
      </>
    );
  }

  // Show maintenance page
  return <Maintenance />;
};

export default MaintenanceWrapper;
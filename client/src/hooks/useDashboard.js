import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, userService, tourService, bookingService } from '../services/api';

/**
 * Dashboard Data Hook - Shared between Admin and User dashboards
 * Provides synchronized data access and updates
 */
export const useDashboardData = (isAdmin = false) => {
  const queryClient = useQueryClient();

  // Admin stats
  const { data: adminStats, isLoading: adminLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats().then(res => res.data),
    enabled: isAdmin,
    refetchInterval: 60000
  });

  // User dashboard data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: () => userService.getDashboard().then(res => res.data),
    enabled: !isAdmin,
    refetchInterval: 30000
  });

  // Shared: Recent bookings (admin sees all, user sees theirs)
  const { data: bookings } = useQuery({
    queryKey: isAdmin ? ['admin', 'bookings'] : ['user', 'bookings'],
    queryFn: () => isAdmin 
      ? bookingService.getAll().then(res => res.data)
      : userService.getBookings('me').then(res => res.data),
    refetchInterval: 30000
  });

  // Shared: Tours data
  const { data: tours } = useQuery({
    queryKey: ['tours', 'all'],
    queryFn: () => tourService.getAll().then(res => res.data),
    refetchInterval: 60000
  });

  // Mutation to refresh dashboards after admin actions
  const refreshDashboards = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['admin']),
        queryClient.invalidateQueries(['user']),
        queryClient.invalidateQueries(['tours']),
        queryClient.invalidateQueries(['bookings'])
      ]);
    }
  });

  return {
    adminStats,
    userData,
    bookings,
    tours,
    isLoading: isAdmin ? adminLoading : userLoading,
    refreshDashboards
  };
};

/**
 * Admin Actions Hook - For managing content that affects user dashboard
 */
export const useAdminActions = () => {
  const queryClient = useQueryClient();

  // Update tour status (affects user's available tours)
  const updateTourStatus = useMutation({
    mutationFn: ({ tourId, data }) => adminService.updateTour(tourId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tours']);
      queryClient.invalidateQueries(['admin', 'stats']);
      queryClient.invalidateQueries(['user', 'dashboard']);
    }
  });

  // Approve/reject booking (affects user's bookings)
  const updateBooking = useMutation({
    mutationFn: ({ bookingId, data }) => bookingService.update(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['admin', 'stats']);
      queryClient.invalidateQueries(['user', 'dashboard']);
    }
  });

  // Create tour (adds to user's available tours)
  const createTour = useMutation({
    mutationFn: (data) => adminService.createTour(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tours']);
      queryClient.invalidateQueries(['admin', 'stats']);
      queryClient.invalidateQueries(['user', 'recommendations']);
    }
  });

  // Delete tour (removes from user dashboard)
  const deleteTour = useMutation({
    mutationFn: (tourId) => adminService.deleteTour(tourId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tours']);
      queryClient.invalidateQueries(['admin', 'stats']);
      queryClient.invalidateQueries(['user', 'dashboard']);
    }
  });

  return {
    updateTourStatus,
    updateBooking,
    createTour,
    deleteTour
  };
};

/**
 * Stats Comparison Hook - Compare admin vs user metrics
 */
export const useStatsComparison = () => {
  const { data: adminStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats().then(res => res.data.data)
  });

  const { data: userData } = useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: () => userService.getDashboard().then(res => res.data.data)
  });

  const comparison = {
    // Total bookings (admin) vs User's bookings
    bookings: {
      total: adminStats?.bookings?.total || 0,
      user: userData?.bookings?.length || 0,
      percentage: adminStats?.bookings?.total 
        ? ((userData?.bookings?.length || 0) / adminStats.bookings.total * 100).toFixed(1)
        : 0
    },
    // Revenue (admin only)
    revenue: {
      total: adminStats?.revenue?.total || 0,
      change: adminStats?.revenue?.change || 0
    },
    // Tours (admin manages, user consumes)
    tours: {
      total: adminStats?.tours?.total || 0,
      userCompleted: userData?.stats?.toursCompleted || 0,
      userWatchlist: userData?.watchlist?.length || 0
    },
    // Users (admin sees all, user is one)
    users: {
      total: adminStats?.users?.total || 0,
      active: adminStats?.users?.active || 0
    }
  };

  return { comparison, adminStats, userData };
};

export default useDashboardData;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourService } from '../services/api';

export const useTours = (params = {}) => {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => tourService.getAll(params).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
    cacheTime: 10 * 60 * 1000, // 10 minutes - cache lives for 10 min
    retry: 2, // Retry twice on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000) // Exponential backoff
  });
};

export const useTour = (id) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => tourService.getById(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2
  });
};

export const useFeaturedTours = () => {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: () => tourService.getFeatured().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes - featured tours change less often
    cacheTime: 20 * 60 * 1000,
    retry: 2
  });
};

export const usePopularTours = () => {
  return useQuery({
    queryKey: ['tours', 'popular'],
    queryFn: () => tourService.getPopular().then(res => res.data),
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    retry: 2
  });
};

export const useSearchTours = (query) => {
  return useQuery({
    queryKey: ['tours', 'search', query],
    queryFn: () => tourService.search(query).then(res => res.data),
    enabled: query?.length > 2,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1 // Less retries for search
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, data }) => tourService.addReview(tourId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tour', variables.tourId]);
    }
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourService } from '../services/api';

export const useTours = (params = {}) => {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => tourService.getAll(params).then(res => res.data)
  });
};

export const useTour = (id) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => tourService.getById(id).then(res => res.data),
    enabled: !!id
  });
};

export const useFeaturedTours = () => {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: () => tourService.getFeatured().then(res => res.data)
  });
};

export const usePopularTours = () => {
  return useQuery({
    queryKey: ['tours', 'popular'],
    queryFn: () => tourService.getPopular().then(res => res.data)
  });
};

export const useSearchTours = (query) => {
  return useQuery({
    queryKey: ['tours', 'search', query],
    queryFn: () => tourService.search(query).then(res => res.data),
    enabled: query?.length > 2
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
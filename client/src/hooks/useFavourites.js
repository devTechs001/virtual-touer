import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/api';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.getAll().then(res => res.data)
  });
};

export const useCheckFavorite = (tourId) => {
  return useQuery({
    queryKey: ['favorite', tourId],
    queryFn: () => favoriteService.check(tourId).then(res => res.data),
    enabled: !!tourId
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tourId, isFavorite }) => {
      if (isFavorite) {
        return favoriteService.remove(tourId);
      }
      return favoriteService.add(tourId);
    },
    onMutate: async ({ tourId, isFavorite }) => {
      await queryClient.cancelQueries(['favorites']);
      await queryClient.cancelQueries(['favorite', tourId]);
      
      const previousFavorites = queryClient.getQueryData(['favorites']);
      
      queryClient.setQueryData(['favorite', tourId], { isFavorite: !isFavorite });
      
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['favorites'], context.previousFavorites);
      toast.error('Failed to update favorites');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['favorites']);
    },
    onSuccess: (_, { isFavorite }) => {
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }
  });
};
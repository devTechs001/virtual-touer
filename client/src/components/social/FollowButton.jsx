import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, UserCheck, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/api';

const FollowButton = ({ userId, size = 'md' }) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const { data: followStatus } = useQuery({
    queryKey: ['followStatus', userId],
    queryFn: () => socialService.checkFollowing(userId).then(res => res.data),
    enabled: isAuthenticated && userId !== user?.id
  });

  const followMutation = useMutation({
    mutationFn: () => 
      followStatus?.isFollowing 
        ? socialService.unfollowUser(userId)
        : socialService.followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries(['followStatus', userId]);
      const previous = queryClient.getQueryData(['followStatus', userId]);
      queryClient.setQueryData(['followStatus', userId], {
        isFollowing: !followStatus?.isFollowing
      });
      return { previous };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['followStatus', userId], context.previous);
      toast.error('Failed to update follow status');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['followStatus', userId]);
      queryClient.invalidateQueries(['user', userId]);
    }
  });

  if (!isAuthenticated || userId === user?.id) {
    return null;
  }

  const isFollowing = followStatus?.isFollowing;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={() => followMutation.mutate()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={followMutation.isPending}
      className={`
        flex items-center gap-2 rounded-xl font-medium transition-all
        ${sizeClasses[size]}
        ${isFollowing
          ? isHovered
            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
            : 'bg-dark-700 text-dark-300 border border-dark-600'
          : 'bg-primary-500 text-white hover:bg-primary-600'
        }
      `}
    >
      {followMutation.isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          {isHovered ? (
            <>
              <UserPlus className="w-4 h-4" />
              Unfollow
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Following
            </>
          )}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
};

export default FollowButton;
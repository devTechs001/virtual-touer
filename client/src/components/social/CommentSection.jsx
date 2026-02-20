import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  Heart,
  Reply,
  MoreHorizontal,
  Send,
  Trash2,
  Edit2,
  Flag,
  Pin,
  ChevronDown
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/api';

const CommentSection = ({ tourId }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const inputRef = useRef(null);

  const { data, isLoading, fetchNextPage, hasNextPage } = useQuery({
    queryKey: ['comments', tourId],
    queryFn: ({ pageParam = 1 }) => 
      socialService.getComments(tourId, { page: pageParam }).then(res => res.data)
  });

  const addCommentMutation = useMutation({
    mutationFn: (data) => socialService.addComment(tourId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', tourId]);
      setNewComment('');
      setReplyingTo(null);
      toast.success('Comment added');
    },
    onError: () => toast.error('Failed to add comment')
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => socialService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', tourId]);
      toast.success('Comment deleted');
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId) => socialService.likeComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(['comments', tourId]);
      // Optimistic update would go here
    },
    onSettled: () => {
      queryClient.invalidateQueries(['comments', tourId]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addCommentMutation.mutate({
      content: newComment,
      parentId: replyingTo?._id
    });
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const comments = data?.comments || [];

  return (
    <div className="space-y-6">
      {/* Comment Count */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">
          {data?.pagination?.total || 0} Comments
        </h3>
      </div>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyingTo && (
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 rounded-lg">
              <Reply className="w-4 h-4 text-dark-400" />
              <span className="text-sm text-dark-300">
                Replying to <span className="text-primary-400">@{replyingTo.user.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="ml-auto text-dark-500 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
                className="w-full px-4 py-3 pr-12 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 resize-none focus:outline-none focus:border-primary-500"
                rows={2}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className="absolute right-3 bottom-3 p-2 text-primary-400 hover:text-primary-300 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-dark-800/50 rounded-xl text-center">
          <p className="text-dark-400 mb-3">Sign in to join the conversation</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton rounded w-32" />
                <div className="h-16 skeleton rounded" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400">No comments yet. Be the first!</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?.id}
                onReply={handleReply}
                onDelete={() => deleteCommentMutation.mutate(comment._id)}
                onLike={() => likeCommentMutation.mutate(comment._id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="w-full py-3 text-dark-400 hover:text-white text-center"
        >
          <ChevronDown className="w-5 h-5 mx-auto" />
          Load more comments
        </button>
      )}
    </div>
  );
};

const CommentItem = ({ comment, currentUserId, onReply, onDelete, onLike }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = currentUserId === comment.user._id;
  const hasLiked = comment.likes?.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <Link to={`/profile/${comment.user._id}`}>
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
            {comment.user.name?.charAt(0)}
          </div>
        )}
      </Link>

      <div className="flex-1">
        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${comment.user._id}`}
                className="font-medium text-white hover:text-primary-400"
              >
                {comment.user.name}
              </Link>
              <span className="text-xs text-dark-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-dark-600">(edited)</span>
              )}
              {comment.isPinned && (
                <Pin className="w-3 h-3 text-primary-400" />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-dark-500 hover:text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-dark-700 rounded-xl border border-dark-600 shadow-xl z-20 py-1">
                    {isOwner && (
                      <>
                        <button className="w-full px-4 py-2 text-left text-sm text-dark-300 hover:bg-dark-600 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onDelete();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-dark-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </>
                    )}
                    <button className="w-full px-4 py-2 text-left text-sm text-dark-300 hover:bg-dark-600 flex items-center gap-2">
                      <Flag className="w-4 h-4" /> Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-dark-200">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2 px-2">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-sm ${
              hasLiked ? 'text-red-400' : 'text-dark-500 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            {comment.likeCount > 0 && comment.likeCount}
          </button>
          <button
            onClick={() => onReply(comment)}
            className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-400"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>
          {comment.replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-primary-400"
            >
              {showReplies ? 'Hide' : 'View'} {comment.replyCount} replies
            </button>
          )}
        </div>

        {/* Replies */}
        {showReplies && comment.replies && (
          <div className="mt-4 ml-4 space-y-4 border-l-2 border-dark-700 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={() => {}}
                onLike={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;
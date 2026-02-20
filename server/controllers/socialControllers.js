import Follow from '../models/Follow.model.js';
import Comment from '../models/Comment.model.js';
import Share from '../models/Share.model.js';
import User from '../models/User.model.js';
import Tour from '../models/Tour.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import notificationService from '../services/notificationService.js';

// ============ FOLLOW ============

// @desc    Follow a user
// @route   POST /api/social/follow/:userId
export const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) {
    throw new ApiError('You cannot follow yourself', 400);
  }

  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    throw new ApiError('User not found', 404);
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    follower: req.user.id,
    following: userId
  });

  if (existingFollow) {
    throw new ApiError('You are already following this user', 400);
  }

  await Follow.create({
    follower: req.user.id,
    following: userId
  });

  // Update follower/following counts
  await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: 1 } });
  await User.findByIdAndUpdate(userId, { $inc: { followerCount: 1 } });

  // Send notification
  await notificationService.send(userId, 'system', {
    title: 'New Follower',
    message: `${req.user.name} started following you`,
    url: `/profile/${req.user.id}`
  });

  res.json({ success: true, message: 'User followed successfully' });
});

// @desc    Unfollow a user
// @route   DELETE /api/social/follow/:userId
export const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const follow = await Follow.findOneAndDelete({
    follower: req.user.id,
    following: userId
  });

  if (!follow) {
    throw new ApiError('You are not following this user', 400);
  }

  // Update follower/following counts
  await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(userId, { $inc: { followerCount: -1 } });

  res.json({ success: true, message: 'User unfollowed successfully' });
});

// @desc    Get followers
// @route   GET /api/social/followers/:userId
export const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const followers = await Follow.find({ following: userId })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('follower', 'name avatar bio');

  const total = await Follow.countDocuments({ following: userId });

  res.json({
    success: true,
    followers: followers.map(f => f.follower),
    pagination: { page: Number(page), limit: Number(limit), total }
  });
});

// @desc    Get following
// @route   GET /api/social/following/:userId
export const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const following = await Follow.find({ follower: userId })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('following', 'name avatar bio');

  const total = await Follow.countDocuments({ follower: userId });

  res.json({
    success: true,
    following: following.map(f => f.following),
    pagination: { page: Number(page), limit: Number(limit), total }
  });
});

// @desc    Check if following
// @route   GET /api/social/follow/check/:userId
export const checkFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const follow = await Follow.findOne({
    follower: req.user.id,
    following: userId
  });

  res.json({ success: true, isFollowing: !!follow });
});

// ============ COMMENTS ============

// @desc    Get comments for a tour
// @route   GET /api/social/comments/:tourId
export const getComments = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

  const comments = await Comment.find({ 
    tour: tourId, 
    parent: null,
    isHidden: false 
  })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .populate({
      path: 'replies',
      options: { sort: { createdAt: 1 }, limit: 3 },
      populate: { path: 'user', select: 'name avatar' }
    });

  const total = await Comment.countDocuments({ tour: tourId, parent: null, isHidden: false });

  res.json({
    success: true,
    comments,
    pagination: { page: Number(page), limit: Number(limit), total }
  });
});

// @desc    Add a comment
// @route   POST /api/social/comments/:tourId
export const addComment = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { content, parentId } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  const commentData = {
    user: req.user.id,
    tour: tourId,
    content
  };

  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      throw new ApiError('Parent comment not found', 404);
    }
    commentData.parent = parentId;

    // Update reply count
    await Comment.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
  }

  const comment = await Comment.create(commentData);
  await comment.populate('user', 'name avatar');

  // Notify tour owner or parent comment owner
  const notifyUserId = parentId 
    ? (await Comment.findById(parentId)).user 
    : tour.guide;

  if (notifyUserId && notifyUserId.toString() !== req.user.id) {
    await notificationService.send(notifyUserId, 'system', {
      title: parentId ? 'New Reply' : 'New Comment',
      message: `${req.user.name} ${parentId ? 'replied to your comment' : 'commented'} on "${tour.title}"`,
      tourId: tour._id,
      url: `/tour/${tourId}#comments`
    });
  }

  res.status(201).json({ success: true, comment });
});

// @desc    Update a comment
// @route   PUT /api/social/comments/:commentId
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  if (comment.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized to edit this comment', 403);
  }

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  res.json({ success: true, comment });
});

// @desc    Delete a comment
// @route   DELETE /api/social/comments/:commentId
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to delete this comment', 403);
  }

  // Delete all replies
  await Comment.deleteMany({ parent: commentId });

  // Update parent reply count if this is a reply
  if (comment.parent) {
    await Comment.findByIdAndUpdate(comment.parent, { $inc: { replyCount: -1 } });
  }

  await comment.deleteOne();

  res.json({ success: true, message: 'Comment deleted' });
});

// @desc    Like a comment
// @route   POST /api/social/comments/:commentId/like
export const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  const hasLiked = comment.likes.includes(req.user.id);

  if (hasLiked) {
    // Unlike
    comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    comment.likeCount = Math.max(0, comment.likeCount - 1);
  } else {
    // Like
    comment.likes.push(req.user.id);
    comment.likeCount += 1;
  }

  await comment.save();

  res.json({ 
    success: true, 
    liked: !hasLiked, 
    likeCount: comment.likeCount 
  });
});

// ============ SHARING ============

// @desc    Share a tour
// @route   POST /api/social/share/:tourId
export const shareTour = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { platform, message } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new ApiError('Tour not found', 404);
  }

  await Share.create({
    user: req.user.id,
    tour: tourId,
    platform,
    message
  });

  // Increment share count
  tour.shareCount = (tour.shareCount || 0) + 1;
  await tour.save();

  res.json({ success: true, message: 'Tour shared successfully' });
});

// @desc    Get share stats for a tour
// @route   GET /api/social/share/:tourId/stats
export const getShareStats = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  const stats = await Share.aggregate([
    { $match: { tour: mongoose.Types.ObjectId(tourId) } },
    {
      $group: {
        _id: '$platform',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await Share.countDocuments({ tour: tourId });

  res.json({
    success: true,
    total,
    byPlatform: Object.fromEntries(stats.map(s => [s._id, s.count]))
  });
});

// ============ FEED ============

// @desc    Get social feed
// @route   GET /api/social/feed
export const getFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  // Get users being followed
  const following = await Follow.find({ follower: req.user.id }).select('following');
  const followingIds = following.map(f => f.following);

  // Get activities from followed users
  const Activity = (await import('../models/Activity.model.js')).default;
  
  const activities = await Activity.find({
    user: { $in: followingIds },
    type: { $in: ['tour_complete', 'review', 'favorite'] }
  })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .populate('tour', 'title images location');

  const total = await Activity.countDocuments({
    user: { $in: followingIds },
    type: { $in: ['tour_complete', 'review', 'favorite'] }
  });

  res.json({
    success: true,
    activities,
    pagination: { page: Number(page), limit: Number(limit), total }
  });
});
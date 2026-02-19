import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('Email already registered', 400);
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    verificationToken
  });

  // Send verification email
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your Virtual Tourist account',
      template: 'verification',
      data: { name: user.name, verificationUrl }
    });
  } catch (error) {
    console.error('Email send error:', error);
    // Don't fail registration if email fails
  }

  // Generate token
  const token = user.generateAuthToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  // Generate token
  const token = user.generateAuthToken();

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      preferences: user.preferences,
      stats: user.stats
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      preferences: user.preferences,
      stats: user.stats,
      createdAt: user.createdAt
    }
  });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'avatar', 'bio', 'preferences'];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      preferences: user.preferences
    }
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = user.generateAuthToken();

  res.json({
    success: true,
    message: 'Password updated successfully',
    token
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists
    return res.json({
      success: true,
      message: 'If an account exists, a reset email has been sent'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  // Send email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your Virtual Tourist password',
      template: 'reset-password',
      data: { name: user.name, resetUrl }
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new ApiError('Email could not be sent', 500);
  }

  res.json({
    success: true,
    message: 'If an account exists, a reset email has been sent'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash token
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new auth token
  const authToken = user.generateAuthToken();

  res.json({
    success: true,
    message: 'Password reset successful',
    token: authToken
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });

  if (!user) {
    throw new ApiError('Invalid verification token', 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.isVerified) {
    throw new ApiError('Email already verified', 400);
  }

  // Generate new token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  // Send email
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Verify your Virtual Tourist account',
    template: 'verification',
    data: { name: user.name, verificationUrl }
  });

  res.json({
    success: true,
    message: 'Verification email sent'
  });
});
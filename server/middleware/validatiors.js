import { body, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new ApiError(messages.join(', '), 400);
  }
  next();
};

// Register validation
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidation
];

// Tour validation
export const validateTour = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['cultural', 'nature', 'adventure', 'historical', 'urban', 'relaxation', 'food', 'art'])
    .withMessage('Invalid category'),
  body('duration')
    .notEmpty().withMessage('Duration is required'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative'),
  handleValidation
];

// Review validation
export const validateReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters'),
  handleValidation
];

// Booking validation
export const validateBooking = [
  body('tour')
    .notEmpty().withMessage('Tour ID is required')
    .isMongoId().withMessage('Invalid tour ID'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('participants')
    .notEmpty().withMessage('Participants count is required')
    .isInt({ min: 1, max: 20 }).withMessage('Participants must be between 1 and 20'),
  handleValidation
];
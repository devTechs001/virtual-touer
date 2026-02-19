import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload single image
// @route   POST /api/upload/image
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError('No file uploaded', 400);
  }

  // Convert buffer to base64
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'virtual-tourist',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });

  res.json({
    success: true,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError('No files uploaded', 400);
  }

  const uploadPromises = req.files.map(async (file) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'virtual-tourist',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  });

  const images = await Promise.all(uploadPromises);

  res.json({ success: true, images });
});

// @desc    Delete image
// @route   DELETE /api/upload/image/:publicId
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  await cloudinary.uploader.destroy(publicId);

  res.json({ success: true, message: 'Image deleted' });
});
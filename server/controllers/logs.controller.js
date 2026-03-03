import asyncHandler from 'express-async-handler';

// @desc    Log client-side error
// @route   POST /api/logs/error
// @access  Public
export const logClientError = asyncHandler(async (req, res) => {
  const { error, userInfo, pageUrl, userAgent } = req.body;

  // Log the error to console (in production, send to monitoring service)
  console.error('Client Error:', {
    error,
    userInfo,
    pageUrl,
    userAgent,
    timestamp: new Date().toISOString()
  });

  // In production, you could save to database or send to Sentry/LogRocket
  // await ErrorLog.create({ ... });

  res.json({ 
    success: true, 
    message: 'Error logged successfully' 
  });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle database errors
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      error: 'Database error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};

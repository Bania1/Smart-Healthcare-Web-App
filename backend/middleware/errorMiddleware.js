/**
 * Error handling middleware
 * @param {Error} err - The Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorMiddleware = (err, req, res, next) => {
	// 1. Log the error stack for debugging
	console.error('Error Middleware:', err.stack);
  
	// 2. Determine the HTTP status code (default to 500)
	const statusCode = err.statusCode || 500;
  
	// 3. Determine the error message (use err.message or a generic one)
	const message = err.message || 'Internal Server Error';
  
	// 4. Hide stack trace in production for security, or show in development
	if (process.env.NODE_ENV === 'production') {
	  return res.status(statusCode).json({ error: message });
	} else {
	  return res.status(statusCode).json({
		error: message,
		stack: err.stack
	  });
	}
  };
  
  module.exports = errorMiddleware;
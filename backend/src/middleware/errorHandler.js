const logger = require('../utils/logger');

class ErrorHandler {
  handle(error, req, res, next) {
    // Log the error
    logger.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Default error response
    let status = error.status || error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Handle specific error types
    if (error.name === 'ValidationError') {
      status = 400;
      message = 'Validation Error';
    } else if (error.name === 'CastError') {
      status = 400;
      message = 'Invalid ID format';
    } else if (error.code === 11000) {
      status = 409;
      message = 'Duplicate entry';
    }

    // Prepare error response
    const errorResponse = {
      error: {
        message,
        status,
        timestamp: new Date().toISOString()
      }
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = error.stack;
      errorResponse.error.details = error.details || null;
    }

    res.status(status).json(errorResponse);
  }

  // Custom error creator
  static createError(message, status = 500, details = null) {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    return error;
  }

  // Async error wrapper
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = new ErrorHandler().handle;
module.exports.ErrorHandler = ErrorHandler;

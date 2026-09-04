const logger = require("../utils/logger");

const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : Number.isInteger(error.status)
      ? error.status
      : 500;
  const isServerError = statusCode >= 500;

  logger.error("Unhandled request error", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });

  return res.status(statusCode).json({
    success: false,
    error: isServerError ? "Internal server error" : error.message,
    requestId: req.requestId,
  });
};

module.exports = { errorHandler, notFoundHandler };
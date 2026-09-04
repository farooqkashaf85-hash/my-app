const crypto = require("crypto");
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const requestId = req.get("x-request-id") || crypto.randomBytes(16).toString("hex");
  const startedAt = Date.now();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    logger.info("HTTP request completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};

module.exports = requestLogger;
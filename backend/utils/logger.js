const writeLog = (level, message, metadata = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  };

  process.stdout.write(`${JSON.stringify(entry)}\n`);
};

module.exports = {
  info: (message, metadata) => writeLog("info", message, metadata),
  error: (message, metadata) => writeLog("error", message, metadata),
};
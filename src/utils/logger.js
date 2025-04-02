const logger = {
  log: (message) => {
    console.log(`[LOG] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${message}`);
  },
  cacheHit: (key) => {
    console.log(`[CACHE HIT] Key: ${key}`);
  },
  cacheMiss: (key) => {
    console.log(`[CACHE MISS] Key: ${key}`);
  },
};

module.exports = logger;

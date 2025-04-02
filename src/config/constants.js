const CACHE_TTL = {
  USER: 3600, // 1 hour
  PRODUCT: 1800, // 30 minutes
};

const CACHE_KEYS = {
  USER: 'user:',
  PRODUCT: 'product:',
};

module.exports = {
  CACHE_TTL,
  CACHE_KEYS,
};

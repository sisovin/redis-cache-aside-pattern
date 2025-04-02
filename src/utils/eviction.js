const LRU = require('lru-cache');
const { CACHE_TTL } = require('../config/constants');

const options = {
  max: 500, // Maximum number of items in cache
  ttl: CACHE_TTL.DEFAULT, // Default TTL for cache entries
};

const cache = new LRU(options);

const evictionService = {
  get(key) {
    return cache.get(key);
  },

  set(key, value, ttl = CACHE_TTL.DEFAULT) {
    cache.set(key, value, { ttl });
  },

  del(key) {
    cache.del(key);
  },

  has(key) {
    return cache.has(key);
  },

  reset() {
    cache.reset();
  },
};

module.exports = evictionService;

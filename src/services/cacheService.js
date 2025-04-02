const { getAsync, setAsync, delAsync } = require('../config/cache');
const { CACHE_TTL } = require('../config/constants');

const cacheService = {
  async get(key) {
    try {
      const value = await getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  },

  async set(key, value, ttl = CACHE_TTL.DEFAULT) {
    try {
      await setAsync(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  async del(key) {
    try {
      await delAsync(key);
    } catch (error) {
      console.error('Error deleting cache:', error);
    }
  },
};

module.exports = cacheService;

const cacheService = require('../services/cacheService');

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;

  cacheService.get(key)
    .then((cachedData) => {
      if (cachedData) {
        console.log('Cache hit');
        return res.json(cachedData);
      }

      console.log('Cache miss');
      res.sendResponse = res.json;
      res.json = (body) => {
        cacheService.set(key, body);
        res.sendResponse(body);
      };

      next();
    })
    .catch((error) => {
      console.error('Cache error:', error);
      next();
    });
};

module.exports = cacheMiddleware;

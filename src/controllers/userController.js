const cacheService = require('../services/cacheService');
const dbService = require('../services/dbService');
const { CACHE_KEYS, CACHE_TTL } = require('../config/constants');

const getUser = async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `${CACHE_KEYS.USER}${userId}`;

  try {
    // Check cache first
    let user = await cacheService.get(cacheKey);

    if (user) {
      // Cache hit
      return res.status(200).json(JSON.parse(user));
    }

    // Cache miss
    user = await dbService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Write to cache
    await cacheService.set(cacheKey, JSON.stringify(user), CACHE_TTL.USER);

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  const userData = req.body;

  try {
    // Update database
    const newUser = await dbService.createUser(userData);

    // Invalidate cache
    const cacheKey = `${CACHE_KEYS.USER}${newUser.id}`;
    await cacheService.del(cacheKey);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  createUser,
};

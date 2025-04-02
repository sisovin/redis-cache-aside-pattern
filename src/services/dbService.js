const db = require('../config/database');
const cacheService = require('./cacheService');
const { CACHE_KEYS, CACHE_TTL } = require('../config/constants');

const dbService = {
  async getUserById(userId) {
    const cacheKey = `${CACHE_KEYS.USER}${userId}`;
    let user = await cacheService.get(cacheKey);

    if (!user) {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      user = result.rows[0];
      await cacheService.set(cacheKey, user, CACHE_TTL.USER);
    }

    return user;
  },

  async getProductById(productId) {
    const cacheKey = `${CACHE_KEYS.PRODUCT}${productId}`;
    let product = await cacheService.get(cacheKey);

    if (!product) {
      const result = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
      product = result.rows[0];
      await cacheService.set(cacheKey, product, CACHE_TTL.PRODUCT);
    }

    return product;
  },

  async updateUser(userId, userData) {
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [userData.name, userData.email, userId]
    );
    const updatedUser = result.rows[0];
    const cacheKey = `${CACHE_KEYS.USER}${userId}`;
    await cacheService.del(cacheKey);
    return updatedUser;
  },

  async updateProduct(productId, productData) {
    const result = await db.query(
      'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
      [productData.name, productData.price, productId]
    );
    const updatedProduct = result.rows[0];
    const cacheKey = `${CACHE_KEYS.PRODUCT}${productId}`;
    await cacheService.del(cacheKey);
    return updatedProduct;
  },
};

module.exports = dbService;

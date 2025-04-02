const cacheService = require('../services/cacheService');
const dbService = require('../services/dbService');
const { CACHE_KEYS, CACHE_TTL } = require('../config/constants');

const getProduct = async (req, res) => {
  const productId = req.params.id;
  const cacheKey = `${CACHE_KEYS.PRODUCT}${productId}`;

  try {
    // Check cache first
    let product = await cacheService.get(cacheKey);

    if (product) {
      console.log('Cache hit');
      return res.status(200).json(JSON.parse(product));
    }

    // Cache miss, fetch from database
    console.log('Cache miss');
    product = await dbService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Write to cache
    await cacheService.set(cacheKey, JSON.stringify(product), CACHE_TTL.PRODUCT);

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  const productData = req.body;

  try {
    // Create product in database
    const newProduct = await dbService.createProduct(productData);

    // Invalidate cache
    const cacheKey = `${CACHE_KEYS.PRODUCT}${newProduct.id}`;
    await cacheService.del(cacheKey);

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProduct,
  createProduct,
};

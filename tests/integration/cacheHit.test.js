const request = require('supertest');
const app = require('../../src/app');
const cacheService = require('../../src/services/cacheService');
const dbService = require('../../src/services/dbService');
const { CACHE_KEYS, CACHE_TTL } = require('../../src/config/constants');

describe('Cache Hit Integration Tests', () => {
  beforeAll(async () => {
    // Seed the database with test data
    await dbService.createUser({ id: 1, name: 'John Doe' });
    await dbService.createProduct({ id: 1, name: 'Test Product' });

    // Populate the cache with test data
    await cacheService.set(`${CACHE_KEYS.USER}1`, JSON.stringify({ id: 1, name: 'John Doe' }), CACHE_TTL.USER);
    await cacheService.set(`${CACHE_KEYS.PRODUCT}1`, JSON.stringify({ id: 1, name: 'Test Product' }), CACHE_TTL.PRODUCT);
  });

  afterAll(async () => {
    // Clear the cache and database
    await cacheService.del(`${CACHE_KEYS.USER}1`);
    await cacheService.del(`${CACHE_KEYS.PRODUCT}1`);
    await dbService.deleteUser(1);
    await dbService.deleteProduct(1);
  });

  test('should return cached user data on cache hit', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John Doe' });
  });

  test('should return cached product data on cache hit', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Test Product' });
  });
});

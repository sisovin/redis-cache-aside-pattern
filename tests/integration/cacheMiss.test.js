const request = require('supertest');
const app = require('../../src/app');
const cacheService = require('../../src/services/cacheService');
const dbService = require('../../src/services/dbService');
const { CACHE_KEYS, CACHE_TTL } = require('../../src/config/constants');

describe('Cache Miss Integration Tests', () => {
  beforeAll(async () => {
    // Seed the database with test data
    await dbService.createUser({ id: 1, name: 'John Doe' });
    await dbService.createProduct({ id: 1, name: 'Test Product' });
  });

  afterAll(async () => {
    // Clear the cache and database
    await cacheService.del(`${CACHE_KEYS.USER}1`);
    await cacheService.del(`${CACHE_KEYS.PRODUCT}1`);
    await dbService.deleteUser(1);
    await dbService.deleteProduct(1);
  });

  test('should fetch user data from database on cache miss', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John Doe' });

    // Verify that the data is now cached
    const cachedUser = await cacheService.get(`${CACHE_KEYS.USER}1`);
    expect(cachedUser).toEqual(JSON.stringify({ id: 1, name: 'John Doe' }));
  });

  test('should fetch product data from database on cache miss', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Test Product' });

    // Verify that the data is now cached
    const cachedProduct = await cacheService.get(`${CACHE_KEYS.PRODUCT}1`);
    expect(cachedProduct).toEqual(JSON.stringify({ id: 1, name: 'Test Product' }));
  });
});

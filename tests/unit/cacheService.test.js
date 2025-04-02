const cacheService = require('../../src/services/cacheService');
const { CACHE_TTL } = require('../../src/config/constants');

describe('cacheService', () => {
  const testKey = 'testKey';
  const testValue = { data: 'testData' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null if cache is empty', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      const result = await cacheService.get(testKey);
      expect(result).toBeNull();
    });

    it('should return cached value if cache is not empty', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(testValue);
      const result = await cacheService.get(testKey);
      expect(result).toEqual(testValue);
    });
  });

  describe('set', () => {
    it('should set value in cache with default TTL', async () => {
      const setSpy = jest.spyOn(cacheService, 'set').mockResolvedValue();
      await cacheService.set(testKey, testValue);
      expect(setSpy).toHaveBeenCalledWith(testKey, testValue, CACHE_TTL.DEFAULT);
    });

    it('should set value in cache with custom TTL', async () => {
      const customTTL = 600;
      const setSpy = jest.spyOn(cacheService, 'set').mockResolvedValue();
      await cacheService.set(testKey, testValue, customTTL);
      expect(setSpy).toHaveBeenCalledWith(testKey, testValue, customTTL);
    });
  });

  describe('del', () => {
    it('should delete value from cache', async () => {
      const delSpy = jest.spyOn(cacheService, 'del').mockResolvedValue();
      await cacheService.del(testKey);
      expect(delSpy).toHaveBeenCalledWith(testKey);
    });
  });
});

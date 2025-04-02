const { client: cacheClient } = require('../src/config/cache');

async function flushCache() {
  try {
    await cacheClient.flushall();
    console.log('Cache flushed successfully.');
  } catch (error) {
    console.error('Error flushing cache:', error);
  } finally {
    cacheClient.quit();
  }
}

flushCache();

const redis = require('redis');
const { promisify } = require('util');

// Create a Redis client
const client = redis.createClient({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
});

// Promisify Redis client methods for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

// Export the Redis client and promisified methods
module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
};

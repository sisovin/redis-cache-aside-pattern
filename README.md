# Cache Aside Pattern Implementation

## Introduction

The Cache Aside Pattern is a caching strategy where the application code is responsible for loading data into the cache and invalidating the cache when necessary. This pattern is beneficial for improving application performance and reducing the load on the primary data store.

### Benefits of the Cache Aside Pattern
- **Reduced database load**: Fewer queries to the database as data is served from the cache.
- **Faster response times**: Cache hits provide quicker data retrieval compared to database queries.
- **Improved scalability**: The application can handle higher traffic with reduced latency.
- **Controlled data freshness**: TTL (Time to Live) and cache invalidation ensure data consistency.

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- Redis or Memcached
- PostgreSQL

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/githubnext/workspace-blank.git
   cd workspace-blank
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   CACHE_HOST=your_cache_host
   CACHE_PORT=your_cache_port
   ```

4. Start the application:
   ```sh
   npm start
   ```

## Caching Strategy

### Overview

The caching strategy implemented in this project follows the Cache Aside Pattern. The application first checks the cache for the requested data. If the data is found in the cache (cache hit), it is returned immediately. If the data is not found in the cache (cache miss), the application fetches the data from the database, stores it in the cache, and then returns the data to the client.

### Implementation

1. **Cache Setup**: The cache is set up using Redis or Memcached. The cache client is configured in `src/config/cache.js`.

2. **Database Setup**: The database connection is configured in `src/config/database.js`.

3. **Cache Service**: The core caching logic is implemented in `src/services/cacheService.js`. This includes methods to read from, write to, and invalidate the cache.

4. **Controllers**: The application controllers (`src/controllers/userController.js` and `src/controllers/productController.js`) handle the business logic for reading and writing data. They integrate the cache-aside logic to ensure data is cached appropriately.

5. **Middleware**: Custom middleware (`src/middleware/cacheMiddleware.js`) is used to automatically cache frequent requests.

6. **Eviction Policy**: The eviction logic for cache entries is implemented in `src/utils/eviction.js`. This includes LRU (Least Recently Used) and TTL-based eviction policies.

7. **Monitoring**: Cache hits and misses are logged using a custom logger (`src/utils/logger.js`).

## Directory Structure

```
cache-aside-pattern/
│
├── .env                    # Environment variables (cache/database config)
├── .gitignore
├── README.md               # Project docs (setup, workflow, caching strategy)
│
├── src/
│   ├── config/             # Configuration files
│   │   ├── cache.js        # Redis/Memcached client setup
│   │   ├── database.js     # DB connection (e.g., PostgreSQL)
│   │   └── constants.js    # TTL values, cache keys prefix
│   │
│   ├── controllers/        # Business logic
│   │   ├── userController.js  # Example: User data handling
│   │   └── productController.js
│   │
│   ├── services/           # Core caching logic
│   │   ├── cacheService.js # Cache read/write/invalidate methods
│   │   └── dbService.js    # Database queries
│   │
│   ├── models/            # Data models/ORM (e.g., Sequelize, Mongoose)
│   │   ├── userModel.js
│   │   └── productModel.js
│   │
│   ├── routes/            # API endpoints
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── middleware/        # Custom middleware
│   │   ├── cacheMiddleware.js  # Auto-cache frequent requests
│   │   └── errorHandler.js
│   │
│   ├── utils/             # Helpers
│   │   ├── logger.js      # Log cache hits/misses
│   │   └── eviction.js    # LRU/TTL eviction logic
│   │
│   └── app.js             # Main application entry point
│
├── tests/
│   ├── unit/              # Unit tests (e.g., Jest, Mocha)
│   │   ├── cacheService.test.js
│   │   └── userController.test.js
│   │
│   └── integration/      # Integration tests
│       ├── cacheHit.test.js
│       └── cacheMiss.test.js
│
├── scripts/               # Utility scripts
│   ├── seedDb.js          # Populate test data
│   └── flushCache.js      # Clear cache manually
│
└── docker-compose.yml     # Spin up Redis + DB containers (optional)
```

## Expected Outcomes

- **Reduced database load**: Fewer queries to the database.
- **Faster response times**: Cache hits provide quicker data retrieval.
- **Improved scalability**: The application can handle higher traffic with reduced latency.
- **Controlled data freshness**: TTL (Time to Live) and cache invalidation ensure data consistency.

const userController = require('../../src/controllers/userController');
const dbService = require('../../src/services/dbService');
const cacheService = require('../../src/services/cacheService');
const { CACHE_KEYS, CACHE_TTL } = require('../../src/config/constants');

jest.mock('../../src/services/dbService');
jest.mock('../../src/services/cacheService');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user data from cache if available', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const cachedUser = { id: '1', name: 'John Doe' };

      cacheService.get.mockResolvedValue(JSON.stringify(cachedUser));

      await userController.getUser(req, res);

      expect(cacheService.get).toHaveBeenCalledWith(`${CACHE_KEYS.USER}1`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cachedUser);
    });

    it('should return user data from database if not in cache', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const dbUser = { id: '1', name: 'John Doe' };

      cacheService.get.mockResolvedValue(null);
      dbService.getUserById.mockResolvedValue(dbUser);

      await userController.getUser(req, res);

      expect(cacheService.get).toHaveBeenCalledWith(`${CACHE_KEYS.USER}1`);
      expect(dbService.getUserById).toHaveBeenCalledWith('1');
      expect(cacheService.set).toHaveBeenCalledWith(
        `${CACHE_KEYS.USER}1`,
        JSON.stringify(dbUser),
        CACHE_TTL.USER
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(dbUser);
    });

    it('should return 404 if user not found in database', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      cacheService.get.mockResolvedValue(null);
      dbService.getUserById.mockResolvedValue(null);

      await userController.getUser(req, res);

      expect(cacheService.get).toHaveBeenCalledWith(`${CACHE_KEYS.USER}1`);
      expect(dbService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      cacheService.get.mockRejectedValue(new Error('Cache error'));

      await userController.getUser(req, res);

      expect(cacheService.get).toHaveBeenCalledWith(`${CACHE_KEYS.USER}1`);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('createUser', () => {
    it('should create a new user and invalidate cache', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const newUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

      dbService.createUser.mockResolvedValue(newUser);
      cacheService.del.mockResolvedValue(null);

      await userController.createUser(req, res);

      expect(dbService.createUser).toHaveBeenCalledWith(req.body);
      expect(cacheService.del).toHaveBeenCalledWith(`${CACHE_KEYS.USER}1`);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    it('should return 500 if an error occurs', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      dbService.createUser.mockRejectedValue(new Error('Database error'));

      await userController.createUser(req, res);

      expect(dbService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});

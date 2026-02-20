import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import User from '../../models/User.model.js';
import { setupTestDB, clearTestDB, closeTestDB } from '../setup.js';

describe('User Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Validation', () => {
    it('should create user with valid data', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user._id).toBeDefined();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
    });

    it('should require name', async () => {
      await expect(
        User.create({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow();
    });

    it('should require valid email', async () => {
      await expect(
        User.create({
          name: 'Test',
          email: 'invalid-email',
          password: 'password123'
        })
      ).rejects.toThrow();
    });

    it('should require password with minimum length', async () => {
      await expect(
        User.create({
          name: 'Test',
          email: 'test@example.com',
          password: '123'
        })
      ).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await User.create({
        name: 'User 1',
        email: 'test@example.com',
        password: 'password123'
      });

      await expect(
        User.create({
          name: 'User 2',
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await User.findById(user._id).select('+password');
      expect(savedUser.password).not.toBe('password123');
    });

    it('should compare password correctly', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await User.findById(user._id).select('+password');
      
      const isMatch = await savedUser.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isWrong = await savedUser.comparePassword('wrongpassword');
      expect(isWrong).toBe(false);
    });
  });

  describe('Token Generation', () => {
    it('should generate valid JWT token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const token = user.generateAuthToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('Default Values', () => {
    it('should set default role to user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.role).toBe('user');
    });

    it('should set default isVerified to false', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.isVerified).toBe(false);
    });

    it('should set default stats', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.stats.toursViewed).toBe(0);
      expect(user.stats.toursCompleted).toBe(0);
      expect(user.stats.totalWatchTime).toBe(0);
    });
  });
});

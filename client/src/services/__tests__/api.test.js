import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { tourService, authService, bookingService } from '../api';
import { server } from '../../test/setup';
import { http, HttpResponse } from 'msw';

describe('API Service', () => {
  describe('tourService', () => {
    it('getAll fetches tours successfully', async () => {
      const response = await tourService.getAll();
      
      expect(response.data.success).toBe(true);
      expect(response.data.tours).toBeInstanceOf(Array);
    });

    it('getAll handles query parameters', async () => {
      const response = await tourService.getAll({ category: 'cultural', page: 1 });
      
      expect(response.data.success).toBe(true);
    });

    it('getById fetches single tour', async () => {
      const response = await tourService.getById('1');
      
      expect(response.data.success).toBe(true);
      expect(response.data.tour._id).toBe('1');
    });

    it('getById handles not found', async () => {
      server.use(
        http.get('/api/tours/:id', () => {
          return HttpResponse.json(
            { success: false, message: 'Tour not found' },
            { status: 404 }
          );
        })
      );

      await expect(tourService.getById('nonexistent')).rejects.toThrow();
    });

    it('getFeatured fetches featured tours', async () => {
      const response = await tourService.getFeatured();
      
      expect(response.data.success).toBe(true);
      expect(response.data.tours).toBeInstanceOf(Array);
    });

    it('search returns matching tours', async () => {
      const response = await tourService.search('Paris');
      
      expect(response.data.success).toBe(true);
    });
  });

  describe('authService', () => {
    it('login with valid credentials', async () => {
      const response = await authService.login({
        email: 'john@example.com',
        password: 'password123'
      });
      
      expect(response.data.success).toBe(true);
      expect(response.data.token).toBeDefined();
      expect(response.data.user).toBeDefined();
    });

    it('login with invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow();
    });

    it('register creates new user', async () => {
      const response = await authService.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      });
      
      expect(response.data.success).toBe(true);
      expect(response.data.user.name).toBe('Jane Doe');
    });
  });

  describe('bookingService', () => {
    it('create creates new booking', async () => {
      const response = await bookingService.create({
        tour: '1',
        date: '2024-01-15',
        participants: 2
      });
      
      expect(response.data.success).toBe(true);
      expect(response.data.booking.confirmationCode).toBeDefined();
    });

    it('getAll fetches user bookings', async () => {
      const response = await bookingService.getAll();
      
      expect(response.data.success).toBe(true);
      expect(response.data.bookings).toBeInstanceOf(Array);
    });
  });
});

describe('API Interceptors', () => {
  it('adds authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');
    
    const response = await api.get('/auth/me');
    
    expect(response.config.headers.Authorization).toBe('Bearer test-token');
    
    localStorage.removeItem('token');
  });

  it('handles 401 errors by clearing token', async () => {
    localStorage.setItem('token', 'invalid-token');
    
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      })
    );

    try {
      await api.get('/auth/me');
    } catch (error) {
      expect(localStorage.getItem('token')).toBeNull();
    }
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import Tour from '../../models/Tour.model.js';
import User from '../../models/User.model.js';
import { setupTestDB, clearTestDB, closeTestDB } from '../setup.js';

describe('Tour Controller', () => {
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    
    // Create admin user
    adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = adminUser.generateAuthToken();
  });

  describe('GET /api/tours', () => {
    beforeEach(async () => {
      await Tour.create([
        {
          title: 'Paris Tour',
          description: 'A beautiful tour of Paris with amazing sights',
          category: 'cultural',
          duration: '45 minutes',
          location: { city: 'Paris', country: 'France' },
          guide: adminUser._id
        },
        {
          title: 'Tokyo Tour',
          description: 'Explore the vibrant city of Tokyo',
          category: 'urban',
          duration: '30 minutes',
          location: { city: 'Tokyo', country: 'Japan' },
          guide: adminUser._id
        }
      ]);
    });

    it('should return all tours', async () => {
      const res = await request(app).get('/api/tours');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.tours).toHaveLength(2);
    });

    it('should filter tours by category', async () => {
      const res = await request(app)
        .get('/api/tours')
        .query({ category: 'cultural' });

      expect(res.status).toBe(200);
      expect(res.body.tours).toHaveLength(1);
      expect(res.body.tours[0].category).toBe('cultural');
    });

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/tours')
        .query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.tours).toHaveLength(1);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.pagination.pages).toBe(2);
    });

    it('should sort tours', async () => {
      const res = await request(app)
        .get('/api/tours')
        .query({ sort: 'title' });

      expect(res.status).toBe(200);
      expect(res.body.tours[0].title).toBe('Paris Tour');
    });
  });

  describe('GET /api/tours/:id', () => {
    let tour;

    beforeEach(async () => {
      tour = await Tour.create({
        title: 'Test Tour',
        description: 'Test description for the tour with enough characters',
        category: 'cultural',
        duration: '30 minutes',
        location: { city: 'Test City', country: 'Test Country' },
        guide: adminUser._id
      });
    });

    it('should return single tour by id', async () => {
      const res = await request(app).get(`/api/tours/${tour._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.tour._id).toBe(tour._id.toString());
    });

    it('should return 404 for non-existent tour', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/tours/${fakeId}`);

      expect(res.status).toBe(404);
    });

    it('should increment participants count on view', async () => {
      const initialParticipants = tour.participants;
      
      await request(app).get(`/api/tours/${tour._id}`);
      
      const updatedTour = await Tour.findById(tour._id);
      expect(updatedTour.participants).toBe(initialParticipants + 1);
    });
  });

  describe('POST /api/tours', () => {
    const validTour = {
      title: 'New Tour',
      description: 'A new tour description with sufficient length for testing',
      category: 'cultural',
      duration: '45 minutes',
      location: { city: 'New City', country: 'New Country' }
    };

    it('should create tour as admin', async () => {
      const res = await request(app)
        .post('/api/tours')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validTour);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.tour.title).toBe('New Tour');
    });

    it('should return error without auth', async () => {
      const res = await request(app)
        .post('/api/tours')
        .send(validTour);

      expect(res.status).toBe(401);
    });

    it('should return error for invalid data', async () => {
      const res = await request(app)
        .post('/api/tours')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'AB' }); // Too short

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/tours/:id', () => {
    let tour;

    beforeEach(async () => {
      tour = await Tour.create({
        title: 'Original Tour',
        description: 'Original description with enough characters',
        category: 'cultural',
        duration: '30 minutes',
        location: { city: 'Original City', country: 'Original Country' },
        guide: adminUser._id
      });
    });

    it('should update tour as admin', async () => {
      const res = await request(app)
        .put(`/api/tours/${tour._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Tour' });

      expect(res.status).toBe(200);
      expect(res.body.tour.title).toBe('Updated Tour');
    });

    it('should return 404 for non-existent tour', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/tours/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tours/:id', () => {
    let tour;

    beforeEach(async () => {
      tour = await Tour.create({
        title: 'Tour to Delete',
        description: 'This tour will be deleted in tests',
        category: 'cultural',
        duration: '30 minutes',
        location: { city: 'Delete City', country: 'Delete Country' },
        guide: adminUser._id
      });
    });

    it('should delete tour as admin', async () => {
      const res = await request(app)
        .delete(`/api/tours/${tour._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deletedTour = await Tour.findById(tour._id);
      expect(deletedTour).toBeNull();
    });
  });
});
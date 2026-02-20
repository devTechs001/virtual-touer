# Backend Testing Guide

## 🧪 Testing Setup

The server uses **Vitest** for testing with **MongoDB Memory Server** for database isolation.

## 📦 Dependencies

```bash
pnpm add -D vitest supertest mongodb-memory-server @vitest/coverage-v8
```

## 🚀 Commands

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

## 📁 Test Structure

```
server/tests/
├── setup.js              # Database setup/teardown
├── controllers/          # Controller tests
│   ├── auth.test.js
│   ├── tour.test.js
│   └── booking.test.js
├── models/              # Model tests
│   ├── User.test.js
│   └── Tour.test.js
└── middleware/          # Middleware tests
    └── auth.test.js
```

## ✍️ Writing Tests

### Controller Test Example

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
```

### Database Setup

```javascript
import { setupTestDB, closeTestDB } from '../setup';

describe('Controller', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });
});
```

## 🎯 Test Coverage

Tests cover:
- Authentication endpoints
- Tour CRUD operations
- Booking flow
- User management
- Middleware (auth, validation)
- Model methods

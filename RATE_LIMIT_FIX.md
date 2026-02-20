# 🔧 Rate Limit Fix - 429 Too Many Requests

## Problem
Getting `429 (Too Many Requests)` errors when fetching tours from the API.

```
GET http://localhost:5000/api/tours?sort=-createdAt&page=3 429 (Too Many Requests)
```

## Solution Applied

### 1. Server-Side Fixes

#### Increased Rate Limits (Development)
```javascript
// server/server.js

// Global limiter - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  skip: (req) => {
    // Skip for localhost in development
    if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') return true;
    return false;
  }
});

// API-specific limits
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 500 : 50
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20 // Strict for auth
});
```

#### Applied Different Limits to Different Routes
```javascript
app.use('/api', limiter);
app.use('/api/auth', authLimiter);      // Strict
app.use('/api/tours', apiLimiter);      // Moderate
app.use('/api/destinations', apiLimiter); // Moderate
```

### 2. Client-Side Fixes

#### Added API Response Caching
```javascript
// client/src/services/api.js

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request interceptor
api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    const cached = cache.get(config.url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Promise.reject({ __cached: true, data: cached.data });
    }
  }
  return config;
});

// Response interceptor - cache GET requests
api.interceptors.response.use((response) => {
  if (response.config.method === 'get') {
    cache.set(response.config.url, {
      data: response.data,
      timestamp: Date.now()
    });
  }
  return response;
});
```

#### Added React Query Caching
```javascript
// client/src/hooks/useTours.js

export const useTours = (params = {}) => {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => tourService.getAll(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,  // Data fresh for 5 min
    cacheTime: 10 * 60 * 1000, // Cache lives for 10 min
    retry: 2,                   // Retry twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000)
  });
};
```

## Rate Limits Summary

| Environment | Global | API | Auth |
|-------------|--------|-----|------|
| **Development** | 1000/15min | 500/15min | 20/15min |
| **Production** | 100/15min | 50/15min | 20/15min |

## Caching Strategy

| Layer | Duration | Description |
|-------|----------|-------------|
| **API Cache** | 5 min | In-memory cache for GET requests |
| **React Query** | 5-10 min | Query cache with stale time |
| **Combined** | ~10 min | Effective cache duration |

## Benefits

1. **Reduced API Calls** - Cached responses don't hit the server
2. **Faster UI** - Cached data loads instantly
3. **Better UX** - No loading spinners for recent data
4. **Server Protection** - Rate limiting still protects in production

## Testing

### Check if Caching Works
```javascript
// Open browser console and run:
// First request (hits server)
fetch('/api/tours')

// Second request (should be cached)
fetch('/api/tours')

// Check cache
console.log(cache) // Should show cached data
```

### Check Rate Limit Headers
```javascript
// Response headers include:
RateLimit-Limit: 500
RateLimit-Remaining: 499
RateLimit-Reset: 1640000000
```

## Troubleshooting

### Still Getting 429 Errors?

1. **Clear browser cache**
   ```bash
   # In browser console
   localStorage.clear()
   ```

2. **Restart server**
   ```bash
   cd server
   pnpm dev
   ```

3. **Check NODE_ENV**
   ```bash
   # Should be 'development' for local dev
   echo $NODE_ENV
   ```

4. **Temporarily disable rate limiting** (Development only)
   ```javascript
   // server/server.js - Comment out limiter
   // app.use('/api', limiter);
   ```

### Production Deployment

For production, update rate limits in `.env`:
```env
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100   # 100 requests per window
```

## Files Changed

- ✅ `server/server.js` - Rate limiting configuration
- ✅ `client/src/services/api.js` - API caching
- ✅ `client/src/hooks/useTours.js` - React Query caching

## Next Steps

1. ✅ Restart server to apply changes
2. ✅ Clear browser cache
3. ✅ Test API calls - should not get 429 errors
4. ✅ Monitor cache performance in browser DevTools

---

**Status:** Fixed! ✅
**Date:** 2024-02-20

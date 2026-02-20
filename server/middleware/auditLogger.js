import AuditLog from '../models/AuditLog.js';

// Simple audit logger: logs POST/PUT/DELETE requests and auth events
export default async function auditLogger(req, res, next) {
  const shouldLog = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) || req.path.startsWith('/api/auth');

  if (!shouldLog) return next();

  const start = Date.now();

  res.on('finish', async () => {
    try {
      const entry = new AuditLog({
        user: req.user?.id || null,
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        body: req.body,
        params: req.params,
        query: req.query,
        meta: { durationMs: Date.now() - start }
      });
      await entry.save();
    } catch (err) {
      // non-blocking: log to console only
      console.error('Audit log save failed:', err?.message || err);
    }
  });

  next();
}

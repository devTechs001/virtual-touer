import express from 'express';
import { logClientError } from '../controllers/logs.controller.js';

const router = express.Router();

// POST /api/logs/error - Log client-side errors
router.post('/error', logClientError);

export default router;

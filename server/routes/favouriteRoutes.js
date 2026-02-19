import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} from '../controllers/favorite.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:tourId', checkFavorite);
router.delete('/:tourId', removeFavorite);

export default router;
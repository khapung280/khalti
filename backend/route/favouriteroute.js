import express from 'express';
import {
  addToFavorites,
  getFavorites,
  getFavoriteById,
  removeFromFavorites,
  clearFavorites,
} from '../controller/favouritecontroller.js';

const router = express.Router();

router.post('/add', addToFavorites); // POST { userId, productId }
router.get('/user/:userId', getFavorites); // legacy path used by older frontend
router.get('/:userId', getFavorites); // GET all favorites
router.get('/:userId/:productId', getFavoriteById); // GET single favorite
router.delete('/remove', removeFromFavorites); // DELETE { userId, productId }
router.delete('/clear/:userId', clearFavorites); // DELETE all favorites

export default router;
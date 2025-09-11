import express from 'express';
import {
  getHomeContent,
  updateHomeContent,
  resetHomeContent,
} from '../controller/homecontroller.js';

const router = express.Router();

router.get('/', getHomeContent);
router.put('/', updateHomeContent);
router.post('/reset', resetHomeContent);

export default router;

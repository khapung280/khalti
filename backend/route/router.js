import express from 'express';
import { register, login } from '../controller/kcontroller.js';
import { requireDb } from '../middleware/requireDb.js';

const router = express.Router();

router.post('/register', requireDb, register);
router.post('/login', requireDb, login);

export default router;
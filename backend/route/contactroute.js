import express from 'express';
import {
  createContactMessage,
  listContactMessages,
} from '../controller/contactcontroller.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', listContactMessages);

export default router;

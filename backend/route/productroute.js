import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  seedGroceryProducts,
} from '../controller/productcontroller.js';

const router = express.Router();
router.post('/seed', seedGroceryProducts);
router.post('/', createProduct);
router.get('/', getAllProducts); 

router.get('/:id', getProductById);

export default router;
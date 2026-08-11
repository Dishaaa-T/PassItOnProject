import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getRelatedProducts,
} from '../controller/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, createProduct);
router.get('/my', protect, getMyProducts);
router.get('/:id/related', getRelatedProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;

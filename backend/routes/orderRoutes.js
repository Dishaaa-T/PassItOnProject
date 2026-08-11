import express from 'express';
import {
  createOrder,
  getMyOrders,
  getMySales,
  updateOrderStatus,
} from '../controller/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder);
router.get('/my', getMyOrders);
router.get('/sales', getMySales);
router.put('/:id/status', updateOrderStatus);

export default router;

import express from 'express';
import { updateProfile, getUserStats } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.get('/stats', getUserStats);

export default router;

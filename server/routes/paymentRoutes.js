import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPayments
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getPayments);

export default router;
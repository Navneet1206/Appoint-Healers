import express from 'express';
import {
  getAvailability,
  createAvailability,
  deleteAvailability
} from '../controllers/availabilityController.js';
import { protect, professional } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:professionalId', getAvailability);

// Protected routes
router.post('/', protect, professional, createAvailability);
router.delete('/:id', protect, professional, deleteAvailability);

export default router;
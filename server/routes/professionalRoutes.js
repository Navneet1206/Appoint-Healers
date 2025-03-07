import express from 'express';
import {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  getProfessionalProfile
} from '../controllers/professionalController.js';
import { protect, professional } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProfessionals);
router.get('/:id', getProfessionalById);

// Protected routes
router.route('/profile')
  .get(protect, getProfessionalProfile)
  .post(protect, createProfessional);

router.put('/:id', protect, professional, updateProfessional);

export default router;
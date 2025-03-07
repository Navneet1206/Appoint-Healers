import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { registerProfessionalByAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Admin endpoint for registering professionals
router.post('/professional/register', protect, admin, registerProfessionalByAdmin);

export default router;

import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointmentStatus);

export default router;
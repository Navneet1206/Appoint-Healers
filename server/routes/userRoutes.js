import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  verifyPhone,
  sendEmailVerification,
  sendPhoneVerification,
  getUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/verify/email', protect, verifyEmail);
router.post('/verify/phone', protect, verifyPhone);
router.post('/send/email-verification', protect, sendEmailVerification);
router.post('/send/phone-verification', protect, sendPhoneVerification);
// Admin routes
router.get('/', protect, admin, getUsers);

export default router;
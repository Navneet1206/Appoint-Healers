import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  verifyEmail,
  verifyPhone,
  resendEmailOTP,
  resendPhoneOTP,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.post('/verify/email', protect, verifyEmail);
router.post('/verify/phone', protect, verifyPhone);
router.post('/resend/email-otp', protect, resendEmailOTP);
router.post('/resend/phone-otp', protect, resendPhoneOTP);

export default router;
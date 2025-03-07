import express from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logout,
  getCurrentUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { 
  validate, 
  userRegisterSchema, 
  loginSchema, 
  refreshTokenSchema 
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// User registration and login endpoints (used for both users and professionals)
router.post('/user/register', validate(userRegisterSchema), registerUser);
router.post('/user/login', validate(loginSchema), loginUser);

router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);

export default router;

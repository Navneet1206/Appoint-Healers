import { verifyAccessToken } from '../utils/jwtUtils.js';
import User from '../models/userModel.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Get token from authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, user not found'
      });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed'
    });
  }
};

// Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Not authorized as admin'
    });
  }
};

// Middleware to check if user is professional
export const professional = (req, res, next) => {
  if (req.user && (req.user.role === 'professional' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Not authorized as professional'
    });
  }
};
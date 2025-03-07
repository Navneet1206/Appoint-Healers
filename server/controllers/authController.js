import User from '../models/userModel.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils.js';
import { AppError } from '../middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Helper function to send tokens
const sendTokenResponse = (user, statusCode, res) => {
  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  // Save refresh token to database
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  
  // Set cookies
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  // Send response
  res.status(statusCode).json({
    status: 'success',
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified
    }
  });
};

// @desc    Register user
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth) {
      return next(new AppError('Please provide all required fields: email, password, firstName, lastName, phone, and dateOfBirth', 400));
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('User already exists with this email', 400));
    }
    
    // Create new user with role 'user'
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      role: 'user'
    });
    
    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error); // Log error for debugging
    next(error);
  }
};

export const verifyPhone = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return next(new AppError('Invalid OTP. Must be 6 digits.', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.phoneOTPExpires < Date.now()) {
      return next(new AppError('Phone OTP has expired. Request a new one.', 400));
    }

    if (user.phoneOTP !== otp) {
      return next(new AppError('Incorrect Phone OTP', 400));
    }

    user.phoneVerified = true;
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    next(error);
  }
};
// @desc    Login (for both users and professionals)
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email (works for both roles)
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }
    
    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await User.findOne({ _id: decoded.id, refreshToken });
    if (!user) {
      return next(new AppError('Invalid refresh token', 401));
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.refreshToken = undefined;
      await req.user.save({ validateBeforeSave: false });
    }
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      isVerified: req.user.isVerified
    }
  });
};
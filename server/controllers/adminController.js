import User from '../models/userModel.js';
import Professional from '../models/professionalModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Register a professional account (admin only)
// @route   POST /api/admin/professional/register
// @access  Private/Admin
export const registerProfessionalByAdmin = async (req, res, next) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      specialization, 
      licenseNumber, 
      yearsOfExperience, 
      bio,
      name,         // professional display name; if not provided, can use firstName + lastName
      hourlyRate
    } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('User already exists with this email', 400));
    }
    
    // Create new user with professional role
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'professional'
    });
    
    // Create professional profile (admin approved by default)
    const professional = await Professional.create({
      user: user._id,
      name: name || `${firstName} ${lastName}`,
      specialization,
      licenseNumber,
      yearsOfExperience,
      bio,
      hourlyRate,
      isApproved: true
    });
    
    // Generate tokens and send response
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    res.status(201).json({
      status: 'success',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      professional
    });
  } catch (error) {
    next(error);
  }
};

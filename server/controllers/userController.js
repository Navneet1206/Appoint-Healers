import User from '../models/userModel.js';
import nodemailer from 'nodemailer';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { AppError } from '../middleware/errorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    }
  });
};


// @desc    Register user
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      role: 'user',
      emailVerified: false,
      phoneVerified: false,
    });

    // Generate and store email OTP
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOTPExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    user.emailOTP = emailOTP;
    user.emailOTPExpires = emailOTPExpires;
    await user.save({ validateBeforeSave: false });

    // Send email OTP
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email for SAVAYAS HEALS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a9d8e;">SAVAYAS HEALS</h2>
          <p>Thank you for registering. Please verify your email address using the following OTP:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${emailOTP}</strong>
          </div>
          <p>This OTP will expire in 30 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br>The SAVAYAS HEALS Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions).catch((emailError) => {
      console.error('Failed to send email OTP:', emailError);
      throw new AppError('Failed to send email verification OTP', 500);
    });

    console.log(`Email OTP ${emailOTP} sent to ${email}`); // Debug log

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      return next(new AppError('Invalid email or password', 401));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email
// @route   POST /api/users/verify/email
// @access  Private
export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return next(new AppError('Invalid OTP', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailOTPExpires < Date.now()) {
      return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    if (user.emailOTP !== otp) {
      return next(new AppError('Incorrect OTP', 400));
    }

    user.emailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user phone
// @route   POST /api/users/verify/phone
// @access  Private
export const verifyPhone = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (otp.length !== 6) {
      return next(new AppError('Invalid OTP', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Note: In a real app, validate OTP against a stored value
    user.phoneVerified = true;
    await user.save();

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      });
    } else {
      return next(new AppError('User not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.email = req.body.email || user.email;
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;

      if (req.body.phone && req.body.phone !== user.phone) {
        user.phone = req.body.phone;
        user.phoneVerified = false;
      }

      if (req.body.dateOfBirth) {
        user.dateOfBirth = req.body.dateOfBirth;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      sendTokenResponse(updatedUser, 200, res);
    } else {
      return next(new AppError('User not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Send verification email
// @route   POST /api/users/send/email-verification
// @access  Private
export const sendEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOTP = token;
    user.emailOTPExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Verify your email for SAVAYAS HEALS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a9d8e;">SAVAYAS HEALS</h2>
          <p>Please verify your email address by entering the following code:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${token}</strong>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>The SAVAYAS HEALS Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Send phone verification OTP
// @route   POST /api/users/send/phone-verification
// @access  Private
export const sendPhoneVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Sending OTP ${otp} to ${user.phone}`); // Simulate SMS

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};
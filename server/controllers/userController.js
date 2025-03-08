import User from '../models/userModel.js';
import nodemailer from 'nodemailer';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { AppError } from '../middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper function to send tokens
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

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
      phoneVerified: user.phoneVerified,
    },
  });
};

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register user with OTPs
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth) {
      return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('User already exists with this email', 400));
    }

    const emailOTP = generateOTP();
    const phoneOTP = generateOTP();
    console.log('Generated Email OTP:', emailOTP);
    console.log('Generated Phone OTP:', phoneOTP);
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000);

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
      emailOTP,
      emailOTPExpires: otpExpiration,
      phoneOTP,
      phoneOTPExpires: otpExpiration,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email - SAVAYAS HEALS',
      html: `...`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email OTP sent to:', email);

    await twilioClient.messages.create({
      body: `Your SAVAYAS HEALS verification OTP is ${phoneOTP}. It expires in 30 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log('Phone OTP sent to:', phone);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};
// @desc    Verify email OTP
// @route   POST /api/users/verify/email
// @access  Private
export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return next(new AppError('Invalid OTP. Must be 6 digits.', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailOTPExpires < Date.now()) {
      return next(new AppError('Email OTP has expired. Request a new one.', 400));
    }

    if (user.emailOTP !== otp) {
      return next(new AppError('Incorrect Email OTP', 400));
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

// @desc    Verify phone OTP
// @route   POST /api/users/verify/phone
// @access  Private
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

// @desc    Resend email OTP
// @route   POST /api/users/resend/email-otp
// @access  Private
export const resendEmailOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailVerified) {
      return next(new AppError('Email already verified', 400));
    }

    const emailOTP = generateOTP();
    console.log('Resending Email OTP:', emailOTP);
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000);

    user.emailOTP = emailOTP;
    user.emailOTPExpires = otpExpiration;
    await user.save({ validateBeforeSave: false });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Verify Your Email - SAVAYAS HEALS',
      html: `...`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email OTP resent to:', user.email);
    res.json({ message: 'Email OTP resent successfully' });
  } catch (error) {
    console.error('Resend Email OTP error:', error);
    next(error);
  }
};

// @desc    Resend phone OTP
// @route   POST /api/users/resend/phone-otp
// @access  Private
export const resendPhoneOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.phoneVerified) {
      return next(new AppError('Phone already verified', 400));
    }

    const phoneOTP = generateOTP();
    console.log('Resending Phone OTP:', phoneOTP);
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000);

    user.phoneOTP = phoneOTP;
    user.phoneOTPExpires = otpExpiration;
    await user.save({ validateBeforeSave: false });

    await twilioClient.messages.create({
      body: `Your SAVAYAS HEALS verification OTP is ${phoneOTP}. It expires in 30 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });
    console.log('Phone OTP resent to:', user.phone);

    res.json({ message: 'Phone OTP resent successfully' });
  } catch (error) {
    console.error('Resend Phone OTP error:', error);
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      return next(new AppError('Invalid email or password', 401));
    }
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
        phoneVerified: user.phoneVerified,
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

    const token = generateOTP();
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
      `,
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

    const otp = generateOTP();
    user.phoneOTP = otp;
    user.phoneOTPExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await twilioClient.messages.create({
      body: `Your SAVAYAS HEALS verification OTP is ${otp}. It expires in 30 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    res.json({ message: 'Phone OTP sent successfully' });
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
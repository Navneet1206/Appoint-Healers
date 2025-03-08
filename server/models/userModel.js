import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'Please add your first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please add your last name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\+91[0-9]{10}$/, 'Phone number must be a valid 10-digit number starting with +91'],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add your date of birth'],
  },
  role: {
    type: String,
    enum: ['user', 'professional', 'admin'],
    default: 'user',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  emailOTP: String,
  emailOTPExpires: Date,
  phoneOTP: String,
  phoneOTPExpires: Date,
  refreshToken: String,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
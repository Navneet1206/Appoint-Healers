import Joi from 'joi';
import { AppError } from './errorMiddleware.js';

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit number',
    'any.required': 'Phone is required',
  }),
  dateOfBirth: Joi.date().required().messages({
    'date.base': 'Date of Birth must be a valid date',
    'any.required': 'Date of Birth is required',
  }),
});



// Professional registration validation schema
export const professionalRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password'
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  specialization: Joi.string().required().messages({
    'any.required': 'Specialization is required'
  }),
  licenseNumber: Joi.string().required().messages({
    'any.required': 'License number is required'
  }),
  yearsOfExperience: Joi.number().min(0).required().messages({
    'number.min': 'Years of experience must be a positive number',
    'any.required': 'Years of experience is required'
  }),
  bio: Joi.string().max(1000).required().messages({
    'string.max': 'Bio must be less than 1000 characters',
    'any.required': 'Bio is required'
  })
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required'
  })
});

// Validation middleware
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  next();
};
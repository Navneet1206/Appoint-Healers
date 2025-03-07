import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { registerUser, error, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    shouldUnregister: false,
  });

  const password = watch('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      console.log('Form Data Submitted:', data); // Debug log
      await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      });
      navigate('/verify');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
              step > index + 1
                ? 'bg-teal-500 text-white'
                : step === index + 1
                ? 'bg-blue-100 border-2 border-teal-500 text-teal-500'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`h-1 w-12 transition-colors duration-300 ${
                step > index + 1 ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">SAVAYAS HEALS</h1>
        <div className="mt-4 flex justify-center">
          <div className="bg-teal-500 p-3 rounded-full shadow-xl">
            <UserPlus className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-teal-500 hover:text-teal-600 transition-colors"
          >
            sign in to your SAVAYAS HEALS account
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 border border-gray-200">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {renderStepIndicator()}
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Personal Information
                </h3>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="form-input mt-1 block w-full"
                    {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex justify-center items-center py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john.doe@example.com"
                    className="form-input mt-1 block w-full"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    className="form-input mt-1 block w-full"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number',
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 flex justify-center items-center py-2 px-4 bg-gray-200 rounded-md"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-1/2 flex justify-center items-center py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="form-input block w-full pr-10"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="form-input block w-full pr-10"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 flex justify-center items-center py-2 px-4 bg-gray-200 rounded-md"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 flex justify-center items-center py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { VerifyEmailFormData, VerifyPhoneFormData } from '../types';
import { CheckCircle, Mail, Phone } from 'lucide-react';

const Verify: React.FC = () => {
  const { user, verifyEmail, verifyPhone, resendEmailOTP, resendPhoneOTP, loading, error } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [verificationSuccess, setVerificationSuccess] = useState<{ email: boolean; phone: boolean }>(
    {
      email: user?.emailVerified || false,
      phone: user?.phoneVerified || false,
    }
  );

  const {
    register: registerEmailForm,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<VerifyEmailFormData>();

  const {
    register: registerPhoneForm,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<VerifyPhoneFormData>();

  useEffect(() => {
    setVerificationSuccess({
      email: user?.emailVerified || false,
      phone: user?.phoneVerified || false,
    });
  }, [user]);

  if (!user) {
    navigate('/register');
    return null;
  }

  if (user.emailVerified && user.phoneVerified) {
    navigate('/dashboard');
    return null;
  }

  const onEmailSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmail(data.otp);
      setVerificationSuccess((prev) => ({ ...prev, email: true }));
      if (verificationSuccess.phone || user.phoneVerified) {
        navigate('/dashboard');
      } else {
        setActiveTab('phone');
      }
    } catch (err) {
      console.error('Email verification error:', err);
    }
  };

  const onPhoneSubmit = async (data: VerifyPhoneFormData) => {
    try {
      await verifyPhone(data.otp);
      setVerificationSuccess((prev) => ({ ...prev, phone: true }));
      if (verificationSuccess.email || user.emailVerified) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Phone verification error:', err);
    }
  };

  const resendEmailVerification = async () => {
    try {
      await resendEmailOTP();
      alert('Verification email with OTP has been resent. Please check your inbox.');
    } catch (err) {
      console.error('Resend email OTP error:', err);
    }
  };

  const resendPhoneVerification = async () => {
    try {
      await resendPhoneOTP();
      alert('OTP has been resent to your phone. Please check your messages.');
    } catch (err) {
      console.error('Resend phone OTP error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-full">
            {activeTab === 'email' ? (
              <Mail className="h-12 w-12 text-white" />
            ) : (
              <Phone className="h-12 w-12 text-white" />
            )}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please complete both email and phone verification to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('email')}
                className={`${
                  activeTab === 'email'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center flex items-center justify-center`}
                disabled={verificationSuccess.email}
              >
                {verificationSuccess.email && (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                Email Verification
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={`${
                  activeTab === 'phone'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center flex items-center justify-center`}
                disabled={verificationSuccess.phone}
              >
                {verificationSuccess.phone && (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                Phone Verification
              </button>
            </nav>
          </div>

          {activeTab === 'email' && (
            <>
              {verificationSuccess.email ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Email verified successfully!</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your email has been verified. Please proceed to phone verification.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('phone')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue to Phone Verification
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleEmailSubmit(onEmailSubmit)}>
                  <div>
                    <p className="text-sm text-gray-700 mb-4">
                      We've sent an OTP to your email address. Please check your inbox and enter the OTP below.
                    </p>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter the 6-digit OTP"
                        {...registerEmailForm('otp', { required: 'OTP is required' })}
                      />
                      {emailErrors.otp && (
                        <p className="mt-2 text-sm text-red-600">{emailErrors.otp.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendEmailVerification}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Didn't receive the OTP? Resend
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === 'phone' && (
            <>
              {verificationSuccess.phone ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Phone verified successfully!</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your phone number has been verified.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
                  <div>
                    <p className="text-sm text-gray-700 mb-4">
                      We've sent an OTP to your phone number {user.phone}. Please enter the OTP below.
                    </p>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter the 6-digit OTP"
                        {...registerPhoneForm('otp', {
                          required: 'OTP is required',
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Please enter a valid 6-digit OTP',
                          },
                        })}
                      />
                      {phoneErrors.otp && (
                        <p className="mt-2 text-sm text-red-600">{phoneErrors.otp.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify Phone'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendPhoneVerification}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Didn't receive the OTP? Resend
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
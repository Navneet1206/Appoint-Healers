import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setEmailCode('');
    setUserId(null);
    setShowVerification(false);
    setTermsAccepted(false);
    setShowPassword(false);
  };

  const switchMode = (newState) => {
    setState(newState);
    resetForm();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (state === 'Sign Up' && !showVerification) {
        if (!name || !email || !password || !phone) {
          toast.error("Please fill in all fields");
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (!termsAccepted) {
          toast.error("Please accept the Terms and Services");
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          phone
        });

        if (data.success) {
          setUserId(data.userId);
          setShowVerification(true);
          toast.success('Verification code sent to your email');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      }
      else if (state === 'Sign Up' && showVerification) {
        if (!emailCode) {
          toast.error("Please enter the verification code");
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/verify`, {
          userId,
          emailCode
        });

        if (data.success) {
          toast.success('Email verified successfully');
          switchMode('Login');
        } else {
          toast.error(data.message || 'Verification failed');
        }
      }
      else if (state === 'Login') {
        if (!email || !password) {
          toast.error("Please fill in all fields");
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Logged in successfully');
          navigate('/');
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        toast.success(data.message);
        setShowForgotPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {!showForgotPassword ? (
          <form onSubmit={onSubmitHandler} className="bg-white shadow-xl rounded-xl px-8 pt-6 pb-8 mb-4">
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => switchMode('Sign Up')}
                className={`px-4 py-2 rounded ${state === 'Sign Up' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => switchMode('Login')}
                className={`px-4 py-2 rounded ${state === 'Login' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Login
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {state === 'Sign Up'
                ? (showVerification ? 'Verify Email' : 'Create Account')
                : 'Welcome Back'}
            </h2>

            {state === 'Sign Up' && !showVerification && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      I accept the <Link to="/terms" className="text-rose-500 hover:text-rose-600">Terms and Services</Link>
                    </span>
                  </label>
                </div>
              </>
            )}

            {state === 'Sign Up' && showVerification && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Verification Code
                </label>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            )}

            {state === 'Login' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-rose-600 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : (
                state === 'Sign Up' ? (showVerification ? 'Verify Email' : 'Create Account') : 'Login'
              )}
            </button>

            <div className="mt-4 text-center">
              {state === 'Sign Up' ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode('Login')}
                    className="text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode('Sign Up')}
                      className="text-rose-500 hover:text-rose-600 font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-rose-500 hover:text-rose-600 mt-2"
                  >
                    Forgot your password?
                  </button>
                </>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={forgotPasswordHandler} className="bg-white shadow-xl rounded-xl px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-rose-600 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-rose-500 hover:text-rose-600"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

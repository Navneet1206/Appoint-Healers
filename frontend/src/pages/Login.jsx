// src/pages/Login.jsx

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [mode, setMode] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [code, setCode] = useState('');
  const [dob, setDob] = useState('');      // Added DOB state
  const [gender, setGender] = useState(''); // Added Gender state
  const [userId, setUserId] = useState(null);

  const [verifying, setVerifying] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const reset = () => {
    setName(''); setEmail(''); setPhone('');
    setPassword(''); setConfirmPwd(''); setCode('');
    setDob(''); setGender('');             // Reset DOB and Gender
    setUserId(null); setVerifying(false);
    setTerms(false); setShowPwd(false); setShowConfirm(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    reset();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === 'SignUp' && !verifying) {
        if (!name || !email || !phone || !password || !dob || !gender) { // Added DOB and Gender to validation
          toast.error('All fields are required');
          setLoading(false);
          return;
        }
        if (password !== confirmPwd) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!terms) {
          toast.error('You must accept the Terms');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, phone, password, dob, gender } // Added DOB and Gender to request
        );
        if (data.success) {
          setUserId(data.userId);
          setVerifying(true);
          toast.success('Check your email for the code');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } else if (mode === 'SignUp' && verifying) {
        if (!code) {
          toast.error('Enter the verification code');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(
          `${backendUrl}/api/user/verify`,
          { userId, emailCode: code }
        );
        if (data.success) {
          toast.success('Email verified — please log in');
          switchMode('Login');
        } else {
          toast.error(data.message || 'Verification failed');
        }
      } else {
        if (!email || !password) {
          toast.error('Email and password are required');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password }
        );
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Logged in successfully');
          navigate('/');
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      setForgot(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-8">
          <h2 className="text-3xl font-playfair font-bold text-rose-900 mb-6 text-center">
            Savayas Heal
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            {['Login', 'SignUp'].map((tab) => (
              <button
                key={tab}
                onClick={() => switchMode(tab)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  mode === tab
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab === 'SignUp' ? 'Sign Up' : 'Login'}
              </button>
            ))}
          </div>

          <form onSubmit={forgot ? onForgot : onSubmit}>
            {forgot ? (
              <>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border-b-2 border-gray-300 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                />
              </>
            ) : (
              <>
                {mode === 'SignUp' && !verifying && (
                  <>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />

                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />

                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 123‑4567"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />

                    <label className="block text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />

                    <label className="block text-gray-700 mb-2">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <label className="block text-gray-700 mb-2">Password</label>
                    <div className="relative mb-4">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full border-b-2 border-gray-300 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showPwd ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative mb-4">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full border-b-2 border-gray-300 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={e => setTerms(e.target.checked)}
                        className="mr-2"
                        required
                      />
                      <label className="text-gray-600 text-sm">
                        I accept the{' '}
                        <Link to="/terms" className="text-rose-500 hover:underline">
                          Terms & Services
                        </Link>
                      </label>
                    </div>
                  </>
                )}

                {mode === 'SignUp' && verifying && (
                  <>
                    <label className="block text-gray-700 mb-2">Verification Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />
                  </>
                )}

                {mode === 'Login' && (
                  <>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                    />

                    <label className="block text-gray-700 mb-2">Password</label>
                    <div className="relative mb-6">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full border-b-2 border-gray-300 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showPwd ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mb-4 rounded-full font-semibold transition ${
                loading
                  ? 'bg-rose-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600'
              } text-white`}
            >
              {forgot
                ? loading
                  ? 'Sending…'
                  : 'Send Reset Link'
                : loading
                ? 'Processing…'
                : mode === 'SignUp'
                ? verifying
                  ? 'Verify Email'
                  : 'Create Account'
                : 'Login'}
            </button>

            <div className="text-center text-gray-700 text-sm">
              {forgot ? (
                <button
                  type="button"
                  onClick={() => setForgot(false)}
                  className="text-rose-500 hover:underline"
                >
                  Back to Login
                </button>
              ) : mode === 'Login' ? (
                <>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('SignUp')}
                    className="text-rose-500 hover:underline"
                  >
                    Sign Up
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="mt-2 text-rose-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('Login')}
                    className="text-rose-500 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
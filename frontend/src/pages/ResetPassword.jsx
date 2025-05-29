import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Custom Popup Component
const CustomPopup = ({ isOpen, onClose, type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-12 h-12 text-blue-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 ${getBgColor()}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ResetPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '' });
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        setUserId(data.userId); // Store userId from response
        setStep('otp'); // Move to OTP verification step
        showPopup('success', 'OTP Sent', data.message);
      } else {
        showPopup('error', 'Error', data.message);
      }
    } catch (error) {
      showPopup('error', 'Error', error.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP for password reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, { userId, otp });
      if (data.success) {
        setStep('reset'); // Move to password reset step
        showPopup('success', 'OTP Verified', 'OTP verified successfully! Enter your new password.');
      } else {
        showPopup('error', 'Invalid OTP', data.message || "Invalid OTP! Try again.");
      }
    } catch (error) {
      showPopup('error', 'Error', error.response?.data?.message || "Error verifying OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { userId, newPassword });
      if (data.success) {
        showPopup('success', 'Password Reset', 'Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        showPopup('error', 'Error', data.message);
      }
    } catch (error) {
      showPopup('error', 'Error', error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      {step === 'email' && (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">Forgot Password</h2>
          <p>Enter your email to receive an OTP for password reset</p>
          <div className="w-full">
            <label>Email</label>
            <input
              type="email"
              className="border p-2 rounded w-full mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white py-2 w-full rounded mt-2">
            Send OTP
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">Verify OTP</h2>
          <p>Enter the OTP sent to your email</p>
          <div className="w-full">
            <label>OTP</label>
            <input
              type="text"
              className="border p-2 rounded w-full mt-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white py-2 w-full rounded mt-2">
            Verify OTP
          </button>
          <p>
            Didn’t receive OTP?{' '}
            <span onClick={() => setStep('email')} className="text-primary underline cursor-pointer">
              Resend OTP
            </span>
          </p>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p>Enter your new password</p>
          <div className="w-full">
            <label>New Password</label>
            <input
              type="password"
              className="border p-2 rounded w-full mt-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white py-2 w-full rounded mt-2">
            Reset Password
          </button>
          <p>
            Back to login?{' '}
            <span onClick={() => navigate('/login')} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
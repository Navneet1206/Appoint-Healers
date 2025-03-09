import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        setUserId(data.userId); // Store userId from response
        setStep('otp'); // Move to OTP verification step
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP for password reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, { userId, otp });
      if (data.success) {
        setStep('reset'); // Move to password reset step
        toast.success("OTP verified successfully! Enter your new password.");
      } else {
        toast.error(data.message || "Invalid OTP! Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { userId, newPassword });
      if (data.success) {
        toast.success("Password reset successful! Redirecting to login...");
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
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

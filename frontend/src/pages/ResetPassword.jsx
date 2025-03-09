import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { userId: paramUserId } = useParams(); // userId from URL (optional if coming from forgot password link)
  const [step, setStep] = useState('email'); // 'email' for requesting OTP, 'verify' for OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState(paramUserId || null); // Store userId from OTP request or URL
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        setUserId(data.userId); // Store userId from response
        setStep('verify'); // Move to OTP verification step
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { userId, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      {step === 'email' ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">Forgot Password</p>
          <p>Enter your email to receive a password reset OTP</p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>
          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
            Send OTP
          </button>
          <p>
            Back to login?{' '}
            <span onClick={() => navigate('/login')} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">Reset Password</p>
          <p>Enter the OTP sent to your email and your new password</p>
          <div className="w-full">
            <p>OTP</p>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
          <div className="w-full">
            <p>New Password</p>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>
          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
            Reset Password
          </button>
          <p>
            Didn’t receive OTP?{' '}
            <span onClick={() => setStep('email')} className="text-primary underline cursor-pointer">
              Resend
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
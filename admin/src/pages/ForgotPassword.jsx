import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/forgot-password`, { email });
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error sending OTP');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/reset-password`, { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error resetting password');
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>Forgot Password</p>
        {!otpSent ? (
          <div className='w-full'>
            <div className='w-full'>
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="email"
                required
              />
            </div>
            <button onClick={sendOtp} className='bg-primary text-white w-full py-2 rounded-md text-base mt-4'>Send OTP</button>
          </div>
        ) : (
          <div className='w-full'>
            <div className='w-full'>
              <p>OTP</p>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
            <div className='w-full'>
              <p>New Password</p>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                required
              />
            </div>
            <button onClick={resetPassword} className='bg-primary text-white w-full py-2 rounded-md text-base mt-4'>Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
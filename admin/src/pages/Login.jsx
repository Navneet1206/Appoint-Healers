import axios from 'axios';
import React, { useContext, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
        if (data.success) {
          setOtpSent(true);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
        if (data.success) {
          setOtpSent(true);
          setDoctorId(data.doctorId);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error('Error during login');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let url, payload;
      if (state === 'Admin') {
        url = `${backendUrl}/api/admin/verify-login-otp`;
        payload = { otp };
      } else {
        url = `${backendUrl}/api/doctor/verify-login-otp`;
        payload = { doctorId, otp };
      }
      const { data } = await axios.post(url, payload);
      if (data.success) {
        if (state === 'Admin') {
          setAToken(data.token);
          localStorage.setItem('aToken', data.token);
        } else {
          setDToken(data.token);
          localStorage.setItem('dToken', data.token);
        }
        toast.success('Login successful');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        {otpSent ? (
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
            <button
              onClick={verifyOtp}
              className='bg-primary text-white w-full py-2 rounded-md text-base mt-4 flex items-center justify-center'
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Verify OTP
            </button>
            <p onClick={() => setOtpSent(false)} className='text-primary underline cursor-pointer mt-2'>Back to Login</p>
          </div>
        ) : (
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
            <div className='w-full relative'>
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type={showPassword ? 'text' : 'password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-2 top-[65%] transform -translate-y-1/2 text-gray-500'
              >
                {showPassword ? (
                  <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={onSubmitHandler}
              className='bg-primary text-white w-full py-2 rounded-md text-base mt-4 flex items-center justify-center'
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Login
            </button>
            {state === 'Doctor' && (
              <p onClick={() => navigate('/forgot-password')} className='text-primary underline cursor-pointer mt-2'>Forgot Password? Click here</p>
            )}
          </div>
        )}
        {state === 'Admin' ? (
          <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
        ) : (
          <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
        )}
      </div>
    </div>
  );
};

export default Login;
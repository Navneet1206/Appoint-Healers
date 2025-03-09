import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up' && !showVerification) {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, phone });
        if (data.success) {
          setUserId(data.userId);
          setShowVerification(true);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (state === 'Sign Up' && showVerification) {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/verify`, { userId, phoneCode, emailCode });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (state === 'Login') {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Logged in successfully');
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        toast.success(data.message);
        setShowForgotPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center">
      {!showForgotPassword ? (
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">{state === 'Sign Up' ? (showVerification ? 'Verify Phone & Email' : 'Create Account') : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? (showVerification ? 'enter the verification codes sent to your phone and email' : 'sign up') : 'log in'} to book an appointment</p>

          {state === 'Sign Up' && !showVerification && (
            <>
              <div className="w-full">
                <p>Full Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="text" required />
              </div>
              <div className="w-full">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required />
              </div>
              <div className="w-full">
                <p>Phone Number</p>
                <input onChange={(e) => setPhone(e.target.value)} value={phone} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="tel" required />
              </div>
              <div className="w-full">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="password" required />
              </div>
            </>
          )}

          {state === 'Sign Up' && showVerification && (
            <>
              <div className="w-full">
                <p>Phone Verification Code</p>
                <input onChange={(e) => setPhoneCode(e.target.value)} value={phoneCode} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="text" required />
              </div>
              <div className="w-full">
                <p>Email Verification Code</p>
                <input onChange={(e) => setEmailCode(e.target.value)} value={emailCode} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="text" required />
              </div>
            </>
          )}

          {state === 'Login' && (
            <>
              <div className="w-full">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required />
              </div>
              <div className="w-full">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="password" required />
              </div>
            </>
          )}

          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
            {state === 'Sign Up' ? (showVerification ? 'Verify' : 'Create account') : 'Login'}
          </button>

          {state === 'Sign Up' && !showVerification && (
            <p>
              Already have an account? <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">Login here</span>
            </p>
          )}
          {state === 'Login' && (
            <>
              <p>
                Create a new account? <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">Click here</span>
              </p>
              <p>
                Forgot Password? <span onClick={() => setShowForgotPassword(true)} className="text-primary underline cursor-pointer">Reset here</span>
              </p>
            </>
          )}
        </form>
      ) : (
        <form onSubmit={forgotPasswordHandler} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">Forgot Password</p>
          <p>Enter your email to receive a password reset OTP</p>
          <div className="w-full">
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required />
          </div>
          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">Send Reset OTP</button>
          <p>
            Back to login? <span onClick={() => setShowForgotPassword(false)} className="text-primary underline cursor-pointer">Click here</span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
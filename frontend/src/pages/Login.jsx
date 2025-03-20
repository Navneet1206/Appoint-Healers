import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up'); // 'Sign Up' or 'Login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  // Removed mobile verification state variable
  const [emailCode, setEmailCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Disable submission if loading
    if(isLoading) return;
    
    if(state === 'Sign Up' && !showVerification) {
      // Check confirm password and TOS
      if(password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if(!termsAccepted) {
        toast.error("Please accept the Terms and Services");
        return;
      }
      try {
        setIsLoading(true);
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, phone });
        setIsLoading(false);
        if (data.success) {
          setUserId(data.userId);
          setShowVerification(true);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    } else if (state === 'Sign Up' && showVerification) {
      try {
        setIsLoading(true);
        // Removed phoneCode from the verification payload
        const { data } = await axios.post(`${backendUrl}/api/user/verify`, { userId, emailCode });
        setIsLoading(false);
        if (data.success) {
          toast.success(data.message);
          setState('Login');
          setShowVerification(false);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    } else if (state === 'Login') {
      try {
        setIsLoading(true);
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        setIsLoading(false);
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Logged in successfully');
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  };

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      setIsLoading(false);
      if (data.success) {
        toast.success(data.message);
        setShowForgotPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Render the two top switching buttons
  const renderSwitchButtons = () => (
    <div className="flex justify-center gap-4 mb-4">
      <button 
        onClick={() => { setState('Sign Up'); setShowVerification(false); }} 
        className={`px-4 py-2 rounded ${state === 'Sign Up' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        Sign Up
      </button>
      <button 
        onClick={() => { setState('Login'); setShowVerification(false); }} 
        className={`px-4 py-2 rounded ${state === 'Login' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        Login
      </button>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center">
      {!showForgotPassword ? (
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg relative">
          {renderSwitchButtons()}
          <p className="text-2xl font-semibold">
            {state === 'Sign Up' ? (showVerification ? 'Verify Email' : 'Create Account') : 'Login'}
          </p>
          <p>
            Please {state === 'Sign Up' ? (showVerification ? 'enter the verification code sent to your email' : 'sign up') : 'log in'} to book an appointment
          </p>

          {state === 'Sign Up' && !showVerification && (
            <>
              <div className="w-full">
                <p>Full Name</p>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1" 
                  type="text" 
                  required 
                />
              </div>
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
              <div className="w-full">
                <p>Phone Number</p>
                <input 
                  onChange={(e) => setPhone(e.target.value)} 
                  value={phone} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1" 
                  type="tel" 
                  required 
                />
              </div>
              <div className="w-full relative">
                <p>Password</p>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10" 
                  type={showPassword ? "text" : "password"} 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 mt-4"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.795.125-1.565.354-2.29M6.24 6.24a9.99 9.99 0 0115.52 0M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="w-full relative">
                <p>Confirm Password</p>
                <input 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  value={confirmPassword} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10" 
                  type={showPassword ? "text" : "password"} 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 mt-4"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.795.125-1.565.354-2.29M6.24 6.24a9.99 9.99 0 0115.52 0M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="w-full flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                  required 
                />
                <p className="text-xs">I accept the <a href="/terms" className="text-rose-500 underline">Terms and Services</a></p>
              </div>
            </>
          )}

          {state === 'Sign Up' && showVerification && (
            <>
              <div className="w-full">
                <p>Email Verification Code</p>
                <input 
                  onChange={(e) => setEmailCode(e.target.value)} 
                  value={emailCode} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1" 
                  type="text" 
                  required 
                />
              </div>
            </>
          )}

          {state === 'Login' && (
            <>
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
              <div className="w-full relative">
                <p>Password</p>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10" 
                  type={showPassword ? "text" : "password"} 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.795.125-1.565.354-2.29M6.24 6.24a9.99 9.99 0 0115.52 0M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}

          <button 
            className="bg-rose-500 text-white w-full py-2 my-2 rounded-md text-base flex items-center justify-center" 
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : state === 'Sign Up' ? (showVerification ? 'Verify' : 'Create Account') : 'Login'}
          </button>

          {state === 'Sign Up' && !showVerification && (
            <p>
              Already have an account?{" "}
              <button onClick={() => setState('Login')} className="text-rose-500 underline cursor-pointer">
                Login here
              </button>
            </p>
          )}
          {state === 'Login' && (
            <>
              <p>
                Create a new account?{" "}
                <button onClick={() => setState('Sign Up')} className="text-rose-500 underline cursor-pointer">
                  Click here
                </button>
              </p>
              <p>
                Forgot Password?{" "}
                <button onClick={() => setShowForgotPassword(true)} className="text-rose-500 underline cursor-pointer">
                  Reset here
                </button>
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
          <button className="bg-rose-500 text-white w-full py-2 my-2 rounded-md text-base" disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : 'Send Reset OTP'}
          </button>
          <p>
            Back to login?{" "}
            <button onClick={() => setShowForgotPassword(false)} className="text-rose-500 underline cursor-pointer">
              Click here
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;

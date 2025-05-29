import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Users, Lock, Shield, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// Custom Popup Component
const CustomPopup = ({ isOpen, onClose, type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error': return <XCircle className="w-12 h-12 text-red-500" />;
      case 'info': return <AlertCircle className="w-12 h-12 text-blue-500" />;
      default: return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
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
                <div className="flex justify-center mb-4">
                  {getIcon()}
                </div>
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

// Custom Loader Component
const CustomLoader = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-white border-opacity-30 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const Login = () => {
  const [mode, setMode] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [code, setCode] = useState('');
  const [dob, setDob] = useState('');     
  const [gender, setGender] = useState(''); 
  const [userId, setUserId] = useState(null);

  const [verifying, setVerifying] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Popup states
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '' });

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  const reset = () => {
    setName(''); setEmail(''); setPhone('');
    setPassword(''); setConfirmPwd(''); setCode('');
    setDob(''); setGender('');
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
        if (!name || !email || !phone || !password || !dob || !gender) {
          showPopup('error', 'Missing Fields', 'All fields are required to create your account.');
          setLoading(false);
          return;
        }
        if (password !== confirmPwd) {
          showPopup('error', 'Password Mismatch', 'Passwords do not match. Please check and try again.');
          setLoading(false);
          return;
        }
        if (!terms) {
          showPopup('error', 'Terms Required', 'You must accept the Terms & Services to continue.');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, phone, password, dob, gender }
        );
        if (data.success) {
          setUserId(data.userId);
          setVerifying(true);
          showPopup('success', 'Verification Sent', 'Check your email for the verification code to complete registration.');
        } else {
          showPopup('error', 'Registration Failed', data.message || 'Unable to create account. Please try again.');
        }
      } else if (mode === 'SignUp' && verifying) {
        if (!code) {
          showPopup('error', 'Code Required', 'Please enter the verification code sent to your email.');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(
          `${backendUrl}/api/user/verify`,
          { userId, emailCode: code }
        );
        if (data.success) {
          showPopup('success', 'Email Verified', 'Your account has been verified successfully. Please log in to continue.');
          switchMode('Login');
        } else {
          showPopup('error', 'Verification Failed', data.message || 'Invalid verification code. Please check and try again.');
        }
      } else {
        if (!email || !password) {
          showPopup('error', 'Missing Credentials', 'Email and password are required to log in.');
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
          showPopup('success', 'Welcome Back!', 'You have been logged in successfully.');
          setTimeout(() => navigate('/'), 1500);
        } else {
          showPopup('error', 'Login Failed', data.message || 'Invalid credentials. Please check your email and password.');
        }
      }
    } catch (err) {
      showPopup('error', 'Connection Error', err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
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
      if (data.success) {
        showPopup('success', 'Reset Link Sent', data.message || 'Password reset link has been sent to your email.');
      } else {
        showPopup('error', 'Reset Failed', data.message || 'Unable to send reset link. Please try again.');
      }
      setForgot(false);
    } catch (err) {
      showPopup('error', 'Connection Error', err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, type, value, onChange, placeholder, required, label }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424] transition-colors" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] transition-all duration-200 bg-gray-50 focus:bg-white"
        />
      </div>
    </div>
  );

  const PasswordField = ({ value, onChange, placeholder, label, showPassword, toggleShow }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424] transition-colors" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] transition-all duration-200 bg-gray-50 focus:bg-white"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D20424] transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Image/Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#D20424] to-[#B91C5C] p-12 flex-col justify-center items-center text-white relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-sm"
            >
              <Shield className="w-16 h-16 text-white" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Savayas Heal
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl opacity-90 mb-8"
            >
              Your Health, Our Priority
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg opacity-80"
            >
              {mode === 'Login' ? 'Welcome back! Sign in to continue your health journey.' : 'Join thousands of users who trust us with their healthcare needs.'}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-20"></div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="w-full lg:w-1/2 p-8 lg:p-12"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-md mx-auto">
            {/* Logo for mobile */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-[#D20424] mb-2">Savayas Heal</h1>
              <p className="text-gray-600">Your Health, Our Priority</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              {['Login', 'SignUp'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchMode(tab)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    mode === tab
                      ? 'bg-[#D20424] text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-[#D20424]'
                  }`}
                >
                  {tab === 'SignUp' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>

            <form onSubmit={forgot ? onForgot : onSubmit} className="space-y-6">
              {forgot ? (
                <InputField
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  label="Email Address"
                  required
                />
              ) : (
                <>
                  {mode === 'SignUp' && !verifying && (
                    <>
                      <InputField
                        icon={User}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        label="Full Name"
                        required
                      />

                      <InputField
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        label="Email Address"
                        required
                      />

                      <InputField
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        label="Phone Number"
                        required
                      />

                      <InputField
                        icon={Calendar}
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder=""
                        label="Date of Birth"
                        required
                      />

                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424] transition-colors" />
                          </div>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        label="Password"
                        showPassword={showPwd}
                        toggleShow={() => setShowPwd(!showPwd)}
                      />

                      <PasswordField
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        showPassword={showConfirm}
                        toggleShow={() => setShowConfirm(!showConfirm)}
                      />

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={terms}
                          onChange={(e) => setTerms(e.target.checked)}
                          className="w-4 h-4 text-[#D20424] bg-gray-100 border-gray-300 rounded focus:ring-[#D20424] focus:ring-2"
                          required
                        />
                        <label className="ml-2 text-sm text-gray-600">
                          I accept the{' '}
                          <Link to="/terms" className="text-[#D20424] hover:underline font-medium">
                            Terms & Services
                          </Link>
                        </label>
                      </div>
                    </>
                  )}

                  {mode === 'SignUp' && verifying && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#D20424] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-[#D20424]" />
                      </div>
                      <InputField
                        icon={Shield}
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        label="Verification Code"
                        required
                      />
                    </div>
                  )}

                  {mode === 'Login' && (
                    <>
                      <InputField
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        label="Email Address"
                        required
                      />

                      <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        label="Password"
                        showPassword={showPwd}
                        toggleShow={() => setShowPwd(!showPwd)}
                      />
                    </>
                  )}
                </>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D20424] to-[#B91C5C] hover:from-[#B91C5C] hover:to-[#D20424] transform hover:scale-105 shadow-lg hover:shadow-xl'
                } text-white`}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <CustomLoader />
                ) : (
                  <>
                    <span>
                      {forgot
                        ? 'Send Reset Link'
                        : mode === 'SignUp'
                        ? verifying
                          ? 'Verify Email'
                          : 'Create Account'
                        : 'Sign In'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <div className="text-center space-y-2">
                {forgot ? (
                  <button
                    type="button"
                    onClick={() => setForgot(false)}
                    className="text-[#D20424] hover:underline font-medium"
                  >
                    ← Back to Sign In
                  </button>
                ) : mode === 'Login' ? (
                  <>
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('SignUp')}
                        className="text-[#D20424] hover:underline font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                    <button
                      type="button"
                      onClick={() => setForgot(true)}
                      className="text-[#D20424] hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('Login')}
                      className="text-[#D20424] hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
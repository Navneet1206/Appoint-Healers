import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, Calendar, Users, MapPin, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const CompleteProfile = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '' });

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (password !== confirmPwd) {
      showPopup('error', 'Password Mismatch', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!password || !mobile || !dob || !gender) {
      showPopup('error', 'Missing Fields', 'All required fields must be filled.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/complete-profile`,
        { password, dob, mobile, gender, addressLine1, addressLine2 },
        { headers: { token } }
      );

      if (data.success) {
        showPopup('success', 'Profile Completed', 'Your profile has been updated successfully. Please log in.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showPopup('error', 'Profile Update Failed', data.message || 'Unable to complete profile.');
      }
    } catch (err) {
      showPopup('error', 'Connection Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, type, value, onChange, placeholder, required, label }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424]" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] bg-gray-50 focus:bg-white"
        />
      </div>
    </div>
  );

  const PasswordField = ({ value, onChange, placeholder, label, showPassword, toggleShow }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424]" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] bg-gray-50 focus:bg-white"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D20424]"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  // Inline loader to replace CustomLoader
  const SimpleLoader = () => (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Inline popup to replace CustomPopup
  const SimplePopup = ({ isOpen, onClose, type, title, message }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
    const textColor = isSuccess ? 'text-green-700' : 'text-red-700';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-lg p-6 max-w-sm w-full border ${bgColor}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-sm ${textColor}`}>{message}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <SimplePopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D20424]">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Please provide additional details to complete your account setup.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
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
          <InputField
            icon={Phone}
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your phone number"
            label="Mobile Number"
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
                <Users className="h-5 w-5 text-gray-400 group-focus-within:text-[#D20424]" />
              </div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <InputField
            icon={MapPin}
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Street address, city"
            label="Address Line 1"
            required={false}
          />
          <InputField
            icon={MapPin}
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Apartment, suite, etc. (optional)"
            label="Address Line 2"
            required={false}
          />
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D20424] to-[#B91C5C] hover:from-[#B91C5C] hover:to-[#D20424] transform hover:scale-105 shadow-lg hover:shadow-xl text-white'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <SimpleLoader />
            ) : (
              <>
                <span>Complete Profile</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
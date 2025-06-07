import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Full Screen Loader Component
const FullScreenLoader = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-red-500 border-gray-300 rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-medium">Processing Payment...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom Popup Component
const CustomPopup = ({ isOpen, onClose, type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
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
        return 'bg-red-50 border-red-200';
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

// Helper Functions
const convertToAmPm = (timeStr) => {
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
};

const getDayOfWeek = (dateStr) => {
  const [d, m, y] = dateStr.split('_').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[dateObj.getDay()];
};

const formatDate = (dateStr) => {
  const [d, m, y] = dateStr.split('_').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]}`;
};

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, userData, getDoctosData } = useContext(AppContext);
  const bookSectionRef = useRef(null);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('video');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '' });

  const showPopup = (type, title, message, keepPaymentLoader = false) => {
    setPopup({ isOpen: true, type, title, message });
    if (!keepPaymentLoader) {
      setIsPaymentLoading(false);
    }
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
    setIsPaymentLoading(false);
  };

  // Backend Functions
  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    if (doc) {
      setDocInfo(doc);
      setFinalPrice(doc.fees || 0);
    } else {
      showPopup('error', 'Doctor Not Found', 'The requested doctor could not be found.');
    }
  };

  const processSlots = () => {
    if (!docInfo || !docInfo.slots) return;
    const activeSlots = docInfo.slots
      .filter((slot) => slot.status === 'Active')
      .map((slot) => ({
        ...slot,
        sessionType: slot.sessionType || 'video',
      }));
    const groups = {};
    activeSlots.forEach((slot) => {
      if (!groups[slot.slotDate]) groups[slot.slotDate] = [];
      groups[slot.slotDate].push(slot);
    });
    const sorted = Object.entries(groups).sort((a, b) => {
      const [d1, m1, y1] = a[0].split('_').map(Number);
      const [d2, m2, y2] = b[0].split('_').map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });
    setGroupedSlots(sorted);
    setSelectedGroupIndex(0);
    setSelectedSlotId('');
  };

  const handleSlotSelect = (slot) => {
    if (!token) {
      showPopup('info', 'Login Required', 'Please login to book an appointment.');
      navigate('/login');
      return;
    }
    setSelectedSlotId(slot._id);
    setSelectedSessionType(slot.sessionType || 'video');
  };

  const handleSessionTypeChange = (type) => {
    setSelectedSessionType(type);
    setSelectedSlotId('');
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      showPopup('error', 'Invalid Coupon', 'Please enter a coupon code.');
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/validate-coupon`,
        { code: couponCode },
        { headers: { token } }
      );
      if (data.success) {
        const discountPercentage = data.discountPercentage;
        const discountAmount = (docInfo.fees * discountPercentage) / 100;
        setDiscount(discountAmount);
        setFinalPrice(docInfo.fees - discountAmount);
        setIsCouponApplied(true);
        showPopup('success', 'Coupon Applied', 'Coupon applied successfully.');
      } else {
        showPopup('error', 'Invalid Coupon', 'The coupon code is invalid or expired.');
      }
    } catch (error) {
      showPopup('error', 'Invalid Coupon', 'The coupon code is invalid or expired.');
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      showPopup('info', 'Login Required', 'Please login to book an appointment.');
      navigate('/login');
      return;
    }
    if (!userData) {
      showPopup('error', 'User Data Error', 'Unable to fetch user data. Please try logging in again.');
      return;
    }
    if (!selectedSlotId) {
      showPopup('info', 'Slot Required', 'Please select a time slot.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotId: selectedSlotId,
          userId: userData._id,
          sessionType: selectedSessionType,
          couponCode: isCouponApplied ? couponCode : null,
        },
        { headers: { token } }
      );
      if (data.success) {
        initiatePayment(data.appointmentId);
      } else {
        showPopup('error', 'Booking Failed', data.message || 'Error booking appointment.');
      }
    } catch (error) {
      showPopup('error', 'Booking Error', error.response?.data?.message || 'Error booking appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async (appointmentId) => {
    setIsPaymentLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Appointment Payment',
          description: 'Appointment Payment',
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post(
                `${backendUrl}/api/user/verifyRazorpay`,
                response,
                { headers: { token } }
              );
              if (verifyRes.data.success) {
                showPopup('success', 'Booking Confirmed', 'Appointment booked successfully! Payment completed.', true);
                getDoctosData();
                fetchDocInfo();
                setTimeout(() => {
                  if (!popup.isOpen) {
                    setIsPaymentLoading(false);
                    navigate('/my-appointments');
                  }
                }, 1500);
              } else {
                showPopup('error', 'Payment Failed', 'Payment verification failed.', true);
              }
            } catch (error) {
              showPopup('error', 'Payment Error', 'Error verifying payment.', true);
            }
          },
          prefill: {
            name: userData?.name || '',
            email: userData?.email || '',
            contact: userData?.phone || '',
          },
          theme: { color: '#0EA5E9' },
          modal: {
            ondismiss: () => {
              showPopup('info', 'Payment Cancelled', 'Payment cancelled by user.', true);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        showPopup('error', 'Payment Error', data.message || 'Error initiating payment.', true);
      }
    } catch (error) {
      showPopup('error', 'Payment Error', 'Error initiating payment.', true);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId, token]);

  useEffect(() => {
    if (docInfo) {
      processSlots();
    }
  }, [docInfo]);

  return docInfo ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-50">
      <FullScreenLoader isOpen={isPaymentLoading} />
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Home</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Doctors</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-red-600 font-medium">{docInfo.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Profile */}
          <div className="lg:col-span-2">
            {/* Doctor Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Doctor Image */}
                  <div className="md:w-64 flex-shrink-0">
                    <div className="relative">
                      <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-red-100 mx-auto">
                        <img
                          src={docInfo.image || assets.default_doctor}
                          alt={docInfo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-3 shadow-lg">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-red-100 to-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                        {docInfo.speciality || 'Healthcare Professional'}
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-800 mb-3">{docInfo.name}</h1>
                    <p className="text-xl text-gray-600 mb-6">{docInfo.degree || 'Medical Professional'}</p>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {docInfo.specialityList?.length > 0 ? (
                          docInfo.specialityList.map((specialty) => (
                            <span
                              key={specialty}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm border"
                            >
                              {specialty}
                            </span>
                          ))
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm border">
                            General Practice
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-50 rounded-xl border border-red-100">
                        <div className="text-2xl font-bold text-red-600">{docInfo.experience || '5+'}</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-600">45</div>
                        <div className="text-sm text-gray-600">Min Session</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  About Dr. {docInfo.name}
                </h2>

                <div className="space-y-8">
                  {/* Biography */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Background</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {docInfo.about || 'Dr. ' + docInfo.name + ' is a dedicated healthcare professional committed to providing excellent patient care and treatment.'}
                    </p>
                  </div>

                  {/* Education & Training */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Education & Qualifications</h3>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{docInfo.degree || 'Medical Degree'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Specialized in {docInfo.speciality || 'Healthcare'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{docInfo.experience || '5+'} years of clinical experience</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Practice Location</h3>
                    <div className="bg-gradient-to-r from-red-50 to-red-50 rounded-xl p-6 border border-red-100">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div>
                          <p className="text-gray-700 font-medium">{docInfo.address?.line1 || 'Healthcare Center'}</p>
                          <p className="text-gray-600">{docInfo.address?.line2 || 'Medical District'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h3>
                    <div className="flex flex-wrap gap-3">
                      {docInfo.languages?.length > 0 ? (
                        docInfo.languages.map((lang) => (
                          <span
                            key={lang}
                            className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium">
                            English
                          </span>
                          <span className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium">
                            Hindi
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-1">
            <div ref={bookSectionRef} className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 via-red-500 to-red-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">Book Your Session</h2>
                  <p className="text-red-100">Choose your preferred consultation type</p>
                  <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {currencySymbol}
                        {finalPrice}
                        {discount > 0 && (
                          <span className="text-lg text-red-200 line-through ml-2">
                            {currencySymbol}
                            {docInfo.fees}
                          </span>
                        )}
                      </div>
                      <div className="text-red-100 text-sm">per session</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Session Type Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Session Type</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleSessionTypeChange('video')}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 ${
                          selectedSessionType === 'video'
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedSessionType === 'video' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Video Call</div>
                          <div className="text-sm opacity-75">Face-to-face consultation</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSessionTypeChange('phone')}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 ${
                          selectedSessionType === 'phone'
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedSessionType === 'phone' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Voice Call</div>
                          <div className="text-sm opacity-75">Audio consultation</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSessionTypeChange('in-person')}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 ${
                          selectedSessionType === 'in-person'
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedSessionType === 'in-person' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">In-Person</div>
                          <div className="text-sm opacity-75">Visit clinic</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date Selection */}
                  {groupedSlots.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {groupedSlots.slice(0, 6).map(([dateStr], index) => (
                          <button
                            key={dateStr}
                            onClick={() => setSelectedGroupIndex(index)}
                            className={`p-3 rounded-xl text-center transition-all border-2 ${
                              selectedGroupIndex === index
                                ? 'bg-red-50 border-red-300 text-red-700'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="text-xs opacity-75 mb-1">{getDayOfWeek(dateStr)}</div>
                            <div className="text-sm font-semibold">{formatDate(dateStr)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Slots */}
                  {groupedSlots[selectedGroupIndex] && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Times</h3>
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {groupedSlots[selectedGroupIndex][1]
                          .filter((slot) => !selectedSessionType || slot.sessionType === selectedSessionType)
                          .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
                          .map((slot) => (
                            <button
                              key={slot._id}
                              onClick={() => handleSlotSelect(slot)}
                              className={`p-3 rounded-xl text-center transition-all border-2 ${
                                selectedSlotId === slot._id
                                  ? 'bg-red-50 border-red-300 text-red-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div className="font-semibold">{convertToAmPm(slot.slotTime)}</div>
                            </button>
                          ))}
                      </div>
                      {groupedSlots[selectedGroupIndex][1].filter(
                        (slot) => !selectedSessionType || slot.sessionType === selectedSessionType
                      ).length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <svg
                            className="w-12 h-12 mx-auto mb-2 opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p>No slots available for {selectedSessionType} sessions on this date.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Coupon Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply Coupon</h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={isCouponApplied}
                      />
                      <button
                        onClick={applyCoupon}
                        className={`px-4 py-2 rounded-xl ${
                          isCouponApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        disabled={isCouponApplied}
                      >
                        {isCouponApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {isCouponApplied && (
                      <p className="mt-2 text-emerald-600">
                        Discount: {currencySymbol}
                        {discount} applied
                      </p>
                    )}
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={bookAppointment}
                    className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white text-lg font-semibold py-4 rounded-xl hover:from-red-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSlotId || isLoading || isPaymentLoading}
                  >
                    {isLoading ? 'Processing...' : `Pay ${currencySymbol}${finalPrice} Now`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Doctors */}
        <div className="mt-12">
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Appointment;
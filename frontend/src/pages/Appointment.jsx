import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [d, m, y] = dateStr.split("_").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[dateObj.getDay()];
};

const formatDate = (dateStr) => {
  const [d, m, y] = dateStr.split("_").map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
};

const formatReviewDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const renderStars = (rating) => {
  const numRating = parseFloat(rating) || 0;
  return [...Array(5)].map((_, index) => (
    <span key={index} className={`text-${index < Math.round(numRating) ? 'yellow' : 'gray'}-400 text-lg`}>★</span>
  ));
};

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, userData, getDoctosData } = useContext(AppContext);
  const bookSectionRef = useRef(null);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState("video");
  const [activeTab, setActiveTab] = useState("about");
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState('N/A');
  const [reviewCount, setReviewCount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Backend Functions
  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    if (doc) {
      setDocInfo(doc);
      setFinalPrice(doc.fees || 0);
    } else {
      toast.error('Doctor not found');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/reviews/${docId}`, { headers: { token } });
      if (response.data.success) {
        const reviews = response.data.reviews;
        const avgRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1) : 'N/A';
        setReviews(reviews);
        setAverageRating(avgRating);
        setReviewCount(reviews.length);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      toast.error('Error fetching reviews');
    }
  };

  const processSlots = () => {
    if (!docInfo || !docInfo.slots) return;
    const activeSlots = docInfo.slots.filter(slot => slot.status === "Active").map(slot => ({
      ...slot,
      sessionType: slot.sessionType || "video" // Default to "video" if sessionType is not provided
    }));
    const groups = {};
    activeSlots.forEach(slot => {
      if (!groups[slot.slotDate]) groups[slot.slotDate] = [];
      groups[slot.slotDate].push(slot);
    });
    const sorted = Object.entries(groups).sort((a, b) => {
      const [d1, m1, y1] = a[0].split("_").map(Number);
      const [d2, m2, y2] = b[0].split("_").map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });
    setGroupedSlots(sorted);
    setSelectedGroupIndex(0);
    setSelectedSlotId("");
  };

  const handleSlotSelect = (slot) => {
    if (!token) {
      toast.warning('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedSlotId(slot._id);
    setSelectedSessionType(slot.sessionType || "video");
  };

  const handleSessionTypeChange = (type) => {
    setSelectedSessionType(type);
    setSelectedSlotId("");
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
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
        toast.success("Coupon applied successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error applying coupon");
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Please login to book an appointment');
      navigate('/login');
      return;
    }
    if (!userData) {
      toast.error('Unable to fetch user data. Please try logging in again.');
      return;
    }
    if (!selectedSlotId) {
      toast.warning('Please select a time slot');
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
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async (appointmentId) => {
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
          name: "Appointment Payment",
          description: "Appointment Payment",
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post(
                `${backendUrl}/api/user/verifyRazorpay`,
                response,
                { headers: { token } }
              );
              if (verifyRes.data.success) {
                toast.success("Appointment booked successfully! Payment completed.");
                getDoctosData();
                fetchDocInfo();
                fetchReviews();
                navigate("/my-appointments");
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              toast.error("Error verifying payment");
            }
          },
          prefill: {
            name: userData?.name || '',
            email: userData?.email || '',
            contact: userData?.phone || '',
          },
          theme: { color: "#D20424" },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled by user");
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error initiating payment");
    }
  };

  const handlegotobookbutton = () => {
    if (!token) {
      toast.warning('Please login to book an appointment');
      navigate('/login');
      return;
    }
    if (!userData) {
      toast.error('Unable to fetch user data. Please try logging in again.');
      return;
    }
    bookSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
      fetchReviews();
    }
  }, [doctors, docId, token]);

  useEffect(() => {
    if (docInfo) {
      processSlots();
    }
  }, [docInfo]);

  // Updated UI
  return docInfo ? (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#D20424] via-[#A0021A] to-[#D20424] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Doctor Image */}
            <div className="lg:w-1/3">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl mx-auto">
                  <img
                    src={docInfo.image || assets.default_doctor}
                    alt={docInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-[#D20424] rounded-full p-4 shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="lg:w-2/3 text-center lg:text-left">
              <div className="mb-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {docInfo.speciality || 'Coming soon'}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-4">{docInfo.name}</h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-6">{docInfo.degree || 'Coming soon'}</p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {docInfo.specialityList?.length > 0 ? (
                  docInfo.specialityList.map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20"
                    >
                      {specialty}
                    </span>
                  ))
                ) : (
                  <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20">
                    Coming soon
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {renderStars(averageRating)}
                  </div>
                  <div className="text-2xl font-bold">{averageRating}</div>
                  <div className="text-white/80">({reviewCount} reviews)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{docInfo.experience || 'N/A'}</div>
                  <div className="text-white/80">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-white/80">Min Session</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="text-center">
                  <div className="text-sm text-white/80 mb-2">Starting from</div>
                  <div className="text-4xl font-bold mb-2">
                    {currencySymbol}{finalPrice}
                    {discount > 0 && (
                      <span className="text-xl text-white/60 line-through ml-2">
                        {currencySymbol}{docInfo.fees}
                      </span>
                    )}
                  </div>
                  <div className="text-white/80">per session</div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handlegotobookbutton}
                className="bg-white text-[#D20424] px-12 py-4 rounded-full text-xl font-bold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex-1 py-6 px-8 font-semibold transition-all ${
                      activeTab === "about"
                        ? "text-[#D20424] border-b-4 border-[#D20424] bg-red-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    About Me
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex-1 py-6 px-8 font-semibold transition-all ${
                      activeTab === "reviews"
                        ? "text-[#D20424] border-b-4 border-[#D20424] bg-red-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Reviews ({reviewCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`flex-1 py-6 px-8 font-semibold transition-all ${
                      activeTab === "faq"
                        ? "text-[#D20424] border-b-4 border-[#D20424] bg-red-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    FAQ
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "about" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#D20424]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        Biography
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {docInfo.about || 'Coming soon'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#D20424]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                          </svg>
                        </div>
                        Education & Training
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-[#D20424] rounded-full"></div>
                            {docInfo.degree || 'Coming soon'}
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-[#D20424] rounded-full"></div>
                            Specialized in {docInfo.speciality || 'Coming soon'}
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-[#D20424] rounded-full"></div>
                            {docInfo.experience ? `${docInfo.experience} of clinical experience` : 'Coming soon'}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#D20424]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                        Location
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-gray-700 text-lg">{docInfo.address?.line1 || 'Coming soon'}</p>
                        <p className="text-gray-700 text-lg">{docInfo.address?.line2 || ''}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#D20424]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.47-6.88L8.83 7.65C9.77 8.96 9.6 10.75 8.49 11.85l-.03.03-2.51-2.54c-.82-.83-2.15-.83-2.97 0s-.83 2.15 0 2.97l2.54 2.51-.03.03C3.75 16.6 3.48 19.31 5.02 21.54l2 -2C6.08 18.23 6.25 16.44 7.36 15.34l.03-.03 2.51 2.54c.82.83 2.15.83 2.97 0s.83-2.15 0-2.97z" />
                          </svg>
                        </div>
                        Languages
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex flex-wrap gap-3">
                          {docInfo.languages?.length > 0 ? (
                            docInfo.languages.map((lang) => (
                              <span key={lang} className="bg-white px-4 py-2 rounded-full text-gray-700 border">
                                {lang}
                              </span>
                            ))
                          ) : (
                            <span className="bg-white px-4 py-2 rounded-full text-gray-700 border">
                              Coming soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {renderStars(averageRating)}
                          </div>
                          <div className="text-3xl font-bold text-gray-800">{averageRating}</div>
                          <div className="text-gray-600">Based on {reviewCount} reviews</div>
                        </div>

                        <div className="space-y-6">
                          {reviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-[#D20424] font-bold text-lg">
                                      {(review.userId?.name?.charAt(0) || 'A').toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">
                                      {review.userId?.name || 'Anonymous'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatReviewDate(review.createdAt)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No reviews available yet.</p>
                        <p className="text-gray-400">Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">FAQ section coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-1">
            <div ref={bookSectionRef} className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D20424] to-[#A0021A] text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">Book a Session</h2>
                  <p className="text-red-100">Choose your preferred date and time</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Session Type Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Type</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => handleSessionTypeChange("video")}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                          selectedSessionType === "video"
                            ? 'bg-[#D20424] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Video</span>
                      </button>
                      <button
                        onClick={() => handleSessionTypeChange("phone")}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                          selectedSessionType === "phone"
                            ? 'bg-[#D20424] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">Phone</span>
                      </button>
                      <button
                        onClick={() => handleSessionTypeChange("in-person")}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                          selectedSessionType === "in-person"
                            ? 'bg-[#D20424] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">In-Person</span>
                      </button>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Date</h3>
                    <div className="flex flex-wrap gap-3">
                      {groupedSlots.map(([dateStr], index) => (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedGroupIndex(index)}
                          className={`p-3 rounded-xl text-center min-w-[120px] transition-all ${
                            selectedGroupIndex === index
                              ? 'bg-[#D20424] text-white'
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-sm opacity-75">{getDayOfWeek(dateStr)}</div>
                          <div className="text-base font-medium">{formatDate(dateStr)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {groupedSlots[selectedGroupIndex] && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Time Slots</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {groupedSlots[selectedGroupIndex][1]
                          .filter(slot => !selectedSessionType || slot.sessionType === selectedSessionType)
                          .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
                          .map((slot) => (
                            <button
                              key={slot._id}
                              onClick={() => handleSlotSelect(slot)}
                              className={`p-4 rounded-xl text-center transition-all ${
                                selectedSlotId === slot._id
                                  ? 'bg-[#D20424] text-white'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div className="text-xl font-bold">{convertToAmPm(slot.slotTime)}</div>
                              <div className="text-sm mt-1 opacity-75">{slot.sessionType}</div>
                            </button>
                          ))}
                      </div>
                      {groupedSlots[selectedGroupIndex][1].filter(slot => !selectedSessionType || slot.sessionType === selectedSessionType).length === 0 && (
                        <p className="text-gray-500 text-center mt-4">No slots available for {selectedSessionType} sessions on this date.</p>
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
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D20424]"
                        disabled={isCouponApplied}
                      />
                      <button
                        onClick={applyCoupon}
                        className={`px-4 py-2 rounded-xl ${
                          isCouponApplied
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#D20424] text-white hover:bg-[#A0021A]'
                        }`}
                        disabled={isCouponApplied}
                      >
                        {isCouponApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {isCouponApplied && (
                      <p className="mt-2 text-green-600">Discount: {currencySymbol}{discount} applied</p>
                    )}
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={bookAppointment}
                    className="w-full bg-[#D20424] text-white text-lg font-semibold py-4 rounded-xl hover:bg-[#A0021A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSlotId || isLoading}
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
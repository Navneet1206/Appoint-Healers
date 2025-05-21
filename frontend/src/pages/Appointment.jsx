import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper functions to format time and dates
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
    <span key={index} className={`text-${index < Math.round(numRating) ? 'yellow' : 'gray'}-400 text-sm`}>★</span>
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

  // Fetch doctor information from the context
  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    if (doc) {
      setDocInfo(doc);
      setFinalPrice(doc.fees || 0);
    } else {
      toast.error('Doctor not found');
      navigate('/doctors');
    }
  };

  // Fetch reviews for the doctor
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/reviews/${docId}`, { headers: { token } });
      if (response.data.success) {
        const reviews = response.data.reviews;
        const avgRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 'N/A';
        setReviews(reviews);
        setAverageRating(avgRating);
        setReviewCount(reviews.length);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      toast.error('Error fetching reviews');
      console.error(error);
    }
  };

  // Process and group slots by date
  const processSlots = () => {
    if (!docInfo || !docInfo.slots) return;
    const activeSlots = docInfo.slots.filter(slot => slot.status === "Active").map(slot => ({
      ...slot,
      sessionType: slot.sessionType || "video"
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

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (!token) {
      toast.warning('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedSlotId(slot._id);
    setSelectedSessionType(slot.sessionType || "video");
  };

  // Handle session type change
  const handleSessionTypeChange = (type) => {
    setSelectedSessionType(type);
    setSelectedSlotId("");
  };

  // Apply coupon code
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
      console.error(error);
    }
  };

  // Book appointment
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
        toast.success(data.message);
        await initiatePayment(data.appointmentId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate Razorpay payment
  const initiatePayment = async (appointmentId) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

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
          name: "Savayas Heals",
          description: "Appointment Payment",
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post(
                `${backendUrl}/api/user/verifyRazorpay`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: { token } }
              );
              if (verifyRes.data.success) {
                toast.success("Payment successful! Appointment confirmed.");
                getDoctosData();
                navigate("/my-appointments");
              } else {
                toast.error(verifyRes.data.message || "Payment verification failed");
              }
            } catch (error) {
              toast.error(error.response?.data?.message || "Error verifying payment");
              console.error("Payment verification error:", error);
            }
          },
          prefill: {
            name: userData.name,
            email: userData.email,
            contact: userData.phone,
          },
          theme: { color: "#F37254" },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled by user");
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          toast.error(response.error.description || "Payment failed. Please try again.");
        });
        rzp.open();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error initiating payment");
      console.error("Payment initiation error:", error);
    }
  };

  // Scroll to booking section
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

  // Fetch doctor info and process slots/reviews on mount or change
  useEffect(() => {
    if (doctors.length > 0) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      processSlots();
      fetchReviews();
    }
  }, [docInfo]);

  return docInfo ? (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Doctor Info Section */}
          <div className="flex flex-col md:flex-row gap-8 p-8">
            <div className="md:w-1/4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img src={docInfo.image || assets.default_doctor} alt={docInfo.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{docInfo.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{docInfo.speciality}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {docInfo.specialityList?.map((specialty) => (
                  <span key={specialty} className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-sm">{specialty}</span>
                )) || ['Anxiety', 'Depression', 'Stress Management', 'Trauma', 'PTSD'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-sm">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">50 min session</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{docInfo.address?.line1}, {docInfo.address?.line2}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">{renderStars(averageRating)} <span className="font-semibold ml-1">{averageRating}</span> <span className="text-gray-500">({reviewCount} reviews)</span></div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{docInfo.experience} years experience</span>
              </div>
              <div className="text-xl font-bold text-pink-500 mb-6">
                {currencySymbol}{finalPrice}/session {discount > 0 && <span className="text-sm text-gray-500 line-through">{currencySymbol}{docInfo.fees}</span>}
              </div>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-all" onClick={handlegotobookbutton}>Book Now</button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-100">
            <div className="p-8">
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab("about")} className={`pb-4 font-medium ${activeTab === "about" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}>About</button>
                <button onClick={() => setActiveTab("reviews")} className={`pb-4 font-medium ${activeTab === "reviews" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}>Reviews</button>
                <button onClick={() => setActiveTab("faq")} className={`pb-4 font-medium ${activeTab === "faq" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}>FAQ</button>
              </div>
              {activeTab === "about" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Biography</h3>
                    <p className="text-gray-600">{docInfo.about}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Education & Training</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• {docInfo.degree}</li>
                      <li>• {docInfo.speciality}</li>
                      <li>• {docInfo.experience} years of experience</li>
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                    <p className="text-gray-600">{docInfo.address?.line1}</p>
                    <p className="text-gray-600">{docInfo.address?.line2}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Languages</h3>
                    <ul className="space-y-2 text-gray-600">
                      {docInfo.languages?.length > 0 ? docInfo.languages.map((lang) => <li key={lang}>• {lang}</li>) : (
                        <>
                          <li>• English</li>
                          <li>• Hindi</li>
                          <li>• Marathi</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="text-gray-600">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">{renderStars(averageRating)} <span className="ml-2 font-semibold">{averageRating}</span> <span className="text-gray-500">({reviewCount} reviews)</span></div>
                      </div>
                      {reviews.map((review, index) => (
                        <div key={index} className="border-t border-gray-200 pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">by {review.userId.name} on {formatReviewDate(review.createdAt)}</span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p>No reviews available yet.</p>}
                </div>
              )}
              {activeTab === "faq" && <div className="text-gray-600"><p>FAQ coming soon...</p></div>}
            </div>
          </div>

          {/* Booking Section */}
          <div ref={bookSectionRef} className="border-t border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Session</h2>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Date</h3>
              <div className="flex flex-wrap gap-3">
                {groupedSlots.map(([dateStr], index) => (
                  <button key={dateStr} onClick={() => setSelectedGroupIndex(index)} className={`p-3 rounded-xl text-center min-w-[120px] transition-all ${selectedGroupIndex === index ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                    <div className="text-sm opacity-75">{getDayOfWeek(dateStr)}</div>
                    <div className="text-base font-medium">{formatDate(dateStr)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Session Type</h3>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => handleSessionTypeChange("video")} className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${selectedSessionType === "video" ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="font-medium">Video</span>
                </button>
                <button onClick={() => handleSessionTypeChange("phone")} className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${selectedSessionType === "phone" ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="font-medium">Phone</span>
                </button>
                <button onClick={() => handleSessionTypeChange("in-person")} className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${selectedSessionType === "in-person" ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-medium">In-Person</span>
                </button>
              </div>
            </div>
            {groupedSlots[selectedGroupIndex] && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {groupedSlots[selectedGroupIndex][1]
                    .filter(slot => !selectedSessionType || slot.sessionType === selectedSessionType)
                    .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
                    .map((slot) => (
                      <button key={slot._id} onClick={() => handleSlotSelect(slot)} className={`p-4 rounded-xl text-center transition-all ${selectedSlotId === slot._id ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
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
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Apply Coupon</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={isCouponApplied}
                />
                <button
                  onClick={applyCoupon}
                  className={`px-4 py-2 rounded-lg ${isCouponApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                  disabled={isCouponApplied}
                >
                  {isCouponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {isCouponApplied && (
                <p className="mt-2 text-green-600">Discount: {currencySymbol}{discount} applied</p>
              )}
            </div>
            <button
              onClick={bookAppointment}
              className="w-full bg-pink-500 text-white text-lg font-semibold py-4 rounded-xl hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSlotId || isLoading}
            >
              {isLoading ? 'Processing...' : `Pay ${currencySymbol}${finalPrice} Now`}
            </button>
          </div>
        </div>
        <div className="mt-8">
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Appointment;
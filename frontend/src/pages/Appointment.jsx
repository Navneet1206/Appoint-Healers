import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper Functions (Unchanged)
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

  // State Variables
  const [docInfo, setDocInfo] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedSessionType] = useState("video"); // Fixed to "video" since others are disabled
  const [activeTab, setActiveTab] = useState("about");
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState('N/A');
  const [reviewCount, setReviewCount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Functions
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
        const avgRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 'N/A';
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

    // Filter only active slots for "video" session type (since others are disabled)
    const activeSlots = docInfo.slots
      .filter(slot => slot.status === "Active" && (slot.sessionType === "video" || !slot.sessionType))
      .map(slot => ({
        ...slot,
        sessionType: "video" // Force to "video" as only this is allowed
      }));

    // Group slots by date, only including dates with at least one active slot
    const groups = {};
    activeSlots.forEach(slot => {
      if (!groups[slot.slotDate]) groups[slot.slotDate] = [];
      groups[slot.slotDate].push(slot);
    });

    // Sort dates
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
          sessionType: "video", // Fixed to "video"
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
        rzp.open();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error initiating payment");
    }
  };

  function handlegotobookbutton() {
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
  }

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

  // Render UI
  return docInfo ? (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center p-6 border-b border-gray-200 bg-beige-50">
            <div className="w-1/4">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                <img src={docInfo.image || assets.default_doctor} alt={docInfo.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-3/4 pl-6">
              <h1 className="text-2xl font-bold text-gray-800">{docInfo.name}</h1>
              <p className="text-lg text-gray-600">{docInfo.experience}+ Years Of Experience</p>
            </div>
            <div className="w-1/12 text-right">
              <svg className="w-6 h-6 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row p-6 gap-6">
            {/* Doctor Info */}
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4">{docInfo.about || "No bio available."}</p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Qualifications:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {docInfo.degree && <li>{docInfo.degree}</li>}
                  {docInfo.speciality && <li>{docInfo.speciality}</li>}
                  {docInfo.experience && <li>{docInfo.experience} years of experience</li>}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Languages:</h3>
                <p className="text-gray-600">
                  {docInfo.languages?.length > 0 ? docInfo.languages.join(", ") : "No languages specified"}
                </p>
              </div>
            </div>

            {/* Booking Section */}
            <div className="md:w-1/2 bg-beige-50 p-6 rounded-lg shadow-inner" ref={bookSectionRef}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book A Session</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Session Type</h3>
                <div className="flex gap-4">
                  <button
                    className="flex-1 p-3 rounded-lg bg-pink-500 text-white font-medium"
                  >
                    Video
                  </button>
                  <button
                    disabled
                    className="flex-1 p-3 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
                  >
                    Audio (Coming Soon)
                  </button>
                  <button
                    disabled
                    className="flex-1 p-3 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
                  >
                    Chat (Coming Soon)
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Audio and Chat sessions will be implemented later.</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Date</h3>
                <div className="flex flex-wrap gap-3">
                  {groupedSlots.length > 0 ? (
                    groupedSlots.map(([dateStr], index) => (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedGroupIndex(index)}
                        className={`p-3 rounded-xl text-center min-w-[120px] transition-all ${selectedGroupIndex === index ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
                      >
                        <div className="text-sm opacity-75">{getDayOfWeek(dateStr)}</div>
                        <div className="text-base font-medium">{formatDate(dateStr)}</div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No available dates.</p>
                  )}
                </div>
              </div>
              {groupedSlots[selectedGroupIndex] && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Slots:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {groupedSlots[selectedGroupIndex][1]
                      .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
                      .map((slot) => (
                        <button
                          key={slot._id}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 ${selectedSlotId === slot._id ? "bg-pink-500 text-white" : ""}`}
                        >
                          {convertToAmPm(slot.slotTime)}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Price Details:</h3>
                <div className="p-3 rounded-lg bg-gray-200 text-gray-700">
                  <div className="flex justify-between mb-2">
                    <span>Session Price</span>
                    <span>{currencySymbol}{docInfo.fees}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Coupon Discount</span>
                      <span>-{currencySymbol}{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <span>Platform Fee</span>
                    <span>{currencySymbol}{(docInfo.fees * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax Fee</span>
                    <span>{currencySymbol}{(docInfo.fees * 0.009).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>{currencySymbol}{(finalPrice + (docInfo.fees * 0.05) + (docInfo.fees * 0.009)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Apply Coupon</h3>
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
                  <div className="mt-2 p-2 bg-green-100 rounded-lg text-green-700">
                    <p>You Save: {currencySymbol}{discount}</p>
                    <p>Coupon: {couponCode}</p>
                  </div>
                )}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Coupon</h3>
                  <div className="p-3 bg-red-100 rounded-lg flex items-center justify-between">
                    <div>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setCouponCode("MERAMAN")}
                      >
                        SavayasHeal
                      </button>
                      <p className="mt-2 text-gray-700">Take the First Step: 50% Off Your First Therapy Session</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={bookAppointment}
                className="w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!selectedSlotId || isLoading}
              >
                {isLoading ? 'Processing...' : (
                  <>
                    Continue <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-100">
            <div className="p-8">
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`pb-4 font-medium ${activeTab === "about" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-4 font-medium ${activeTab === "reviews" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`pb-4 font-medium ${activeTab === "faq" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  FAQ
                </button>
              </div>
              {activeTab === "about" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Biography</h3>
                    <p className="text-gray-600">{docInfo.about || "No bio available."}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Education & Training</h3>
                    <ul className="space-y-2 text-gray-600">
                      {docInfo.degree && <li>• {docInfo.degree}</li>}
                      {docInfo.speciality && <li>• {docInfo.speciality}</li>}
                      {docInfo.experience && <li>• {docInfo.experience} years of experience</li>}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                    <p className="text-gray-600">{docInfo.address?.line1 || "No address available"}</p>
                    <p className="text-gray-600">{docInfo.address?.line2}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Languages</h3>
                    <p className="text-gray-600">
                      {docInfo.languages?.length > 0 ? docInfo.languages.join(", ") : "No languages specified"}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="text-gray-600">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {renderStars(averageRating)}
                          <span className="ml-2 font-semibold">{averageRating}</span>
                          <span className="text-gray-500">({reviewCount} reviews)</span>
                        </div>
                      </div>
                      {reviews.slice(0, 1).map((review, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{review.rating}</span>
                            <span className="text-sm text-gray-500">by {review.userId.name}</span>
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
        </div>
        <div className="mt-8">
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Appointment;
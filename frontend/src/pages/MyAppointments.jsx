import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import ReviewModal from "../components/ReviewModal";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Custom Popup Component
const CustomPopup = ({ isOpen, onClose, type, title, message, showInput, onConfirm, inputValue, setInputValue }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-600" />;
      case 'info':
      case 'confirm':
        return <AlertCircle className="w-12 h-12 text-rose-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return "bg-green-50 border-green-200";
      case 'error':
        return "bg-red-50 border-red-200";
      case 'info':
      case 'confirm':
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  useEffect(() => {
    if (isOpen && type !== 'confirm') {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, type]);

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
              className={`bg-white rounded-lg p-8 max-w-md w-full shadow-2xl border-2 ${getBgColor()}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                {showInput && (
                  <div className="mb-6">
                    <p className="text-gray-800 font-bold text-lg bg-gray-100 p-2 rounded-lg mb-4 select-all cursor-pointer">
                      I want to cancel the slot
                    </p>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type 'I want to cancel the slot'"
                      className="w-full px-2 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <p className="text-red-500 text-sm mt-2">
                      Warning: No refund will occur after cancellation.
                    </p>
                  </div>
                )}
                <div className="flex justify-center gap-4">
                  {type === 'confirm' ? (
                    <>
                      <button
                        onClick={onConfirm}
                        disabled={showInput && inputValue !== 'I want to cancel the slot'}
                        className={`px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 ${showInput && inputValue !== 'I want to cancel the slot' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    showInput: false,
    appointmentId: null,
  });
  const [cancelInput, setCancelInput] = useState('');
  const [loading, setLoading] = useState({
    fetchAppointments: false,
    pay: null,
    cancel: null,
    review: null
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const showPopup = (type, title, message, showInput = false, appointmentId = null) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      showInput,
      appointmentId,
    });
    if (!showInput) {
      setCancelInput('');
    }
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '', showInput: false, appointmentId: null });
    setCancelInput('');
  };

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      showPopup('info', 'Login Required', 'Please login to view your appointments.');
      navigate("/login");
    }
  }, [token, navigate]);

  // Function to format slot date
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  // Get appointments
  const getUserAppointments = async () => {
    setLoading((prev) => ({ ...prev, fetchAppointments: true }));
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      showPopup('error', 'Fetch Error', error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading((prev) => ({ ...prev, fetchAppointments: false }));
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    setLoading((prev) => ({ ...prev, cancel: appointmentId }));
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        showPopup('success', 'Appointment Cancelled', 'Your appointment has been cancelled. No refund will be issued.');
        getUserAppointments();
      } else {
        showPopup('error', 'Cancellation Failed', data.message);
      }
    } catch (error) {
      showPopup('error', 'Cancellation Error', error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading((prev) => ({ ...prev, cancel: null }));
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    if (popup.appointmentId && cancelInput === "I want to cancel the slot") {
      cancelAppointment(popup.appointmentId);
      closePopup();
    }
  };

  // Initialize Razorpay
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        setLoading((prev) => ({ ...prev, pay: order.receipt }));
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            showPopup('success', 'Payment Success', 'Payment completed successfully.');
            navigate("/my-appointments");
            getUserAppointments();
          } else {
            showPopup('error', 'Payment Failed', 'Payment verification failed.');
          }
        } catch (error) {
          showPopup('error', 'Payment Error', error.response?.data?.message || 'Error verifying payment');
        } finally {
          setLoading((prev) => ({ ...prev, pay: null }));
        }
      },
      modal: {
        ondismiss: () => {
          showPopup('info', 'Payment Cancelled', 'Payment cancelled by user.');
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Payment using Razorpay
  const appointmentRazorpay = async (appointmentId) => {
    setLoading((prev) => ({ ...prev, pay: appointmentId }));
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        showPopup('error', 'Payment Error', data.message);
      }
    } catch (error) {
      showPopup('error', 'Payment Error', error.response?.data?.message || 'Error initiating payment');
    } finally {
      setLoading((prev) => ({ ...prev, pay: null }));
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Filter appointments
  const filteredAppointments = appointments.filter((item) =>
    item.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.docData.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slotDateFormat(item.slotDate).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render star rating
  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-${index < rating ? "yellow" : "gray"}-400 text-xl`}
      >
        ★
      </span>
    ));

  return (
    <div className="min-h-screen bg-rose-50 p-4 sm:p-6 md:p-8 lg:p-10">
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        showInput={popup.showInput}
        onConfirm={handleCancelConfirm}
        inputValue={cancelInput}
        setInputValue={setCancelInput}
      />

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-rose-600">
          My Appointments
        </h1>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </header>

      {loading.fetchAppointments ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-center md:items-stretch"
              >
                <div className="md:w-1/4 flex justify-center items-center bg-rose-100 p-4">
                  <img
                    className="w-24 h-24 object-cover rounded-full"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>
                <div className="md:w-1/2 p-4 flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-rose-700">{item.docData.name}</h2>
                  <p className="text-rose-600">{item.docData.speciality}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-rose-600">Address:</span>{" "}
                    {item.docData.address.line1}, {item.docData.address.line2}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium text-rose-600">Date & Time:</span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                  {item.review && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className="flex">{renderStars(item.review.rating)}</div>
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(item.review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {item.review.comment && (
                        <p className="mt-1 text-sm text-gray-600">{item.review.comment}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="md:w-1/4 p-4 flex flex-col gap-2 justify-center items-center">
                  {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="w-full py-2 px-4 border border-rose-500 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                      disabled={loading.pay === item._id}
                    >
                      {loading.pay === item._id ? <LoadingSpinner /> : "Pay Online"}
                    </button>
                  )}
                  {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-rose-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                      disabled={loading.pay === item._id}
                    >
                      {loading.pay === item._id ? (
                        <LoadingSpinner />
                      ) : (
                        <img className="w-16 h-auto" src={assets.razorpay_logo} alt="Razorpay" />
                      )}
                    </button>
                  )}
                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className="w-full py-2 px-4 border rounded bg-rose-100 text-rose-500">
                      Paid
                    </button>
                  )}
                  {item.isCompleted && !item.hasReview && (
                    <button
                      onClick={() => setShowReviewModal(item._id)}
                      className="w-full py-2 px-4 border border-green-500 rounded text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                      disabled={loading.review === item._id}
                    >
                      {loading.review === item._id ? <LoadingSpinner /> : "Leave Review"}
                    </button>
                  )}
                  {item.isCompleted && item.hasReview && (
                    <button className="w-full py-2 px-4 border border-green-500 rounded text-green-500">
                      Review Submitted
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() =>
                        showPopup(
                          "confirm",
                          "Confirm Cancellation",
                          "Please confirm you want to cancel this appointment.",
                          true,
                          item._id
                        )
                      }
                      className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-red-600 hover:text-white transition-colors duration-300 flex items-center justify-center"
                      disabled={loading.cancel === item._id}
                    >
                      {loading.cancel === item._id ? <LoadingSpinner /> : "Cancel Appointment"}
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className="w-full py-2 px-4 border border-red-500 rounded text-red-500">
                      Appointment Cancelled
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-rose-600 font-medium">
              <p>No appointments found.</p>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          appointmentId={showReviewModal}
          onClose={() => setShowReviewModal(null)}
          onSubmit={() => getUserAppointments()}
          setErrorMessage={(msg) => showPopup("error", "Review Error", msg)}
          setSuccessMessage={(msg) => showPopup("success", "Review Submitted", msg)}
          backendUrl={backendUrl}
          token={token}
          appointments={appointments}
        />
      )}

      <footer className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.
      </footer>
    </div>
  );
};

export default MyAppointments;  
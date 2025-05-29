import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { assets } from "../assets/assets";
import ReviewModal from "../components/ReviewModal"; // New ReviewModal component

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Function to format slot date (assumes format "dd_mm_yyyy")
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  // Get appointments from the backend
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  // Cancel appointment API call
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        setSuccessMessage(data.message);
        getUserAppointments();
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  // Initialize Razorpay payment
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
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            setSuccessMessage("Payment completed successfully");
            navigate("/my-appointments");
            getUserAppointments();
          } else {
            setErrorMessage("Payment verification failed");
          }
        } catch (error) {
          setErrorMessage(error.response?.data?.message || "Error verifying payment");
        }
      },
      modal: {
        ondismiss: () => {
          setErrorMessage("Payment cancelled by user");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Payment using Razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error initiating payment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Filter appointments based on search term
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
      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Error</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="w-full py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Success</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage("")}
              className="w-full py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
                    className="w-full py-2 px-4 border border-rose-500 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-rose-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                  >
                    <img className="w-16 h-auto" src={assets.razorpay_logo} alt="Razorpay" />
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
                    className="w-full py-2 px-4 border border-green-500 rounded text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300"
                  >
                    Leave Review
                  </button>
                )}
                {item.isCompleted && item.hasReview && (
                  <button className="w-full py-2 px-4 border border-green-500 rounded text-green-500">
                    Review Submitted
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    Cancel Appointment
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

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          appointmentId={showReviewModal}
          onClose={() => setShowReviewModal(null)}
          onSubmit={() => getUserAppointments()}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
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
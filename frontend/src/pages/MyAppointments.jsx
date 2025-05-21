import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext);
  console.log("Token of mine: ",token);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format slot date (assumes format "dd_mm_yyyy")
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  // Get appointments from the backend
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Error fetching appointments");
    }
  };

  // Submit review
  const submitReview = async (appointmentId) => {
    try {
      setIsSubmittingReview(true);
      const appointment = appointments.find((app) => app._id === appointmentId);
      if (!appointment) {
        toast.error("Appointment not found");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/add-review`,
        {
          userId: localStorage.getItem("userId"),
          doctorId: appointment.docId,
          appointmentId,
          rating: reviewRating,
          comment: reviewComment,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Review submitted successfully");
        setShowReviewForm(null);
        setReviewRating(5);
        setReviewComment("");
        await getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting review");
      console.error("Review submission error:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment");
      console.error("Cancellation error:", error);
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

  // Initialize Razorpay payment
  const initPay = async (order) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Savayas Heals",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
          if (data.success) {
            toast.success("Payment successful! Appointment confirmed.");
            await getUserAppointments();
            navigate("/my-appointments");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Error verifying payment");
          console.error("Payment verification error:", error);
        }
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
        await initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error initiating payment");
      console.error("Payment initiation error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((item) => {
    return (
      item.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docData.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slotDateFormat(item.slotDate).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-${index < rating ? "yellow" : "gray"}-400 text-xl`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-rose-50 p-4 sm:p-6 md:p-8 lg:p-10">
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
                    onClick={() => setShowReviewForm(item._id)}
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

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows="3"
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReviewForm(null);
                  setReviewRating(5);
                  setReviewComment("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => submitReview(showReviewForm)}
                disabled={isSubmittingReview}
                className={`px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 ${isSubmittingReview ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.
      </footer>
    </div>
  );
};

export default MyAppointments;
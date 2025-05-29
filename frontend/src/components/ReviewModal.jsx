import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Custom Popup Component (same as MyAppointments)
const CustomPopup = ({ isOpen, onClose, type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-600" />;
      case "info":
        return <AlertCircle className="w-12 h-12 text-rose-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-gray-50 border-gray-200";
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
              className={`bg-white rounded-lg p-8 max-w-md w-full shadow-2xl border-2 ${getBgColor()}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
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

const ReviewModal = ({ appointmentId, onClose, onSubmit, setErrorMessage, setSuccessMessage, backendUrl, token, appointments }) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
  });

  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  const submitReview = async () => {
    try {
      setIsSubmittingReview(true);
      const appointment = appointments.find((app) => app._id === appointmentId);
      if (!appointment) {
        showPopup("error", "Review Error", "Appointment not found");
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
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        showPopup("success", "Review Submitted", "Review submitted successfully");
        onSubmit();
        onClose();
      } else {
        showPopup("error", "Review Error", data.message || "Failed to submit review");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        showPopup("error", "Review Error", "Review API endpoint not found. Please contact support.");
      } else if (error.response?.status === 403) {
        showPopup("error", "Review Error", "You are not authorized to review this appointment.");
      } else if (error.response?.status === 400) {
        showPopup("error", "Review Error", error.response.data.message || "Invalid review data.");
      } else {
        showPopup("error", "Review Error", error.response?.data?.message || "Failed to submit review. Please try again later.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-rose-600 mb-4">Leave a Review</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className={`text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
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
              onClose();
              setReviewRating(5);
              setReviewComment("");
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            disabled={isSubmittingReview}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 flex items-center ${isSubmittingReview ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            {isSubmittingReview ? <LoadingSpinner /> : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
import React, { useState } from "react";
import axios from "axios";

const ReviewModal = ({ appointmentId, onClose, onSubmit, setErrorMessage, setSuccessMessage, backendUrl, token, appointments }) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] =10
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const submitReview = async () => {
    try {
      setIsSubmittingReview(true);
      const appointment = appointments.find((app) => app._id === appointmentId);
      if (!appointment) {
        setErrorMessage("Appointment not found");
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
        setSuccessMessage("Review submitted successfully");
        onSubmit();
        onClose();
      } else {
        setErrorMessage(data.message || "Failed to submit review");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage("Review API endpoint not found. Please contact support.");
      } else if (error.response?.status === 403) {
        setErrorMessage("You are not authorized to review this appointment.");
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message || "Invalid review data.");
      } else {
        setErrorMessage(error.response?.data?.message || "Failed to submit review. Please try again later.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-rose-600 mb-4">Leave a Review</h3>
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
            className={`px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 ${
              isSubmittingReview ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
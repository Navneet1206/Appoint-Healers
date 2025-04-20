import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorReviews = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/user/reviews/${doctorId}`);
        if (response.data.success) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [doctorId]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-${index < rating ? "yellow" : "gray"}-400`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.userId.image}
                  alt={review.userId.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{review.userId.name}</p>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {new Date(review.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet.</p>
      )}
    </div>
  );
};

export default DoctorReviews;
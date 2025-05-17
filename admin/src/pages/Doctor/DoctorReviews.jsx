import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';


const DoctorReviews = () => {
  const { dToken } = useContext(DoctorContext);
  const { backendUrl } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/reviews`, {
        headers: { dToken },
      });
      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      toast.error('Error loading reviews');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchReviews();
    }
  }, [dToken]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-${index < rating ? 'yellow' : 'gray'}-400 text-lg`}>
        ★
      </span>
    ));
  };

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Reviews</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="max-h-96 overflow-y-auto space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={review.isFake ? assets.default_user : (review.userId?.image || assets.default_user)}
                    alt={review.isFake ? review.fakeUserName : (review.userId?.name || 'User')}
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      {review.isFake ? review.fakeUserName : (review.userId?.name || 'Anonymous')}
                    </p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-600 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
};

export default DoctorReviews;
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
  const [stats, setStats] = useState({ average: 0, total: 0 });

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/reviews`, {
        headers: { dToken },
      });
      if (data.success) {
        const reviewData = data.reviews || [];
        setReviews(reviewData);
        
        // Calculate review statistics
        if (reviewData.length > 0) {
          const total = reviewData.length;
          const sum = reviewData.reduce((acc, review) => acc + review.rating, 0);
          setStats({
            average: (sum / total).toFixed(1),
            total
          });
        }
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
      <span 
        key={index} 
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`}
      >
        ★
      </span>
    ));
  };

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Patient Reviews</h1>
        {reviews.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600">{stats.average}</span>
                  <span className="text-yellow-400 text-3xl ml-1">★</span>
                </div>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
              <div className="h-10 border-l border-gray-300"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Reviews</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto p-6 space-y-6">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className={`p-5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-xl transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                    src={review.isFake ? assets.default_user : (review.userId?.image || assets.default_user)}
                    alt={review.isFake ? review.fakeUserName : (review.userId?.name || 'User')}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {review.isFake ? review.fakeUserName : (review.userId?.name || 'Anonymous')}
                      </h3>
                      <span className="text-sm text-gray-500 font-medium">
                        {getFormattedDate(review.timestamp)}
                      </span>
                    </div>
                    
                    <div className="mt-1 mb-3">
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.comment && (
                      <div className="mt-2 text-gray-700 bg-gray-100 p-4 rounded-lg">
                        <p className="italic">"<span>{review.comment}</span>"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">As you provide care to patients, their feedback will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;
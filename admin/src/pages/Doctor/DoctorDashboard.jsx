import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, currency, backendUrl } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data with error handling
  const fetchDashData = async () => {
    try {
      setIsLoading(true);
      await getDashData();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews for the doctor
  const fetchReviews = async () => {
    if (!dashData?.doctorId) return;
    try {
      setIsLoadingReviews(true);
      const { data } = await axios.get(`${backendUrl}/api/user/reviews/${dashData.doctorId}`, {
        headers: { dToken },
      });
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error loading reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchDashData();
    }
  }, [dToken]);

  useEffect(() => {
    if (dashData?.doctorId) {
      fetchReviews();
    }
  }, [dashData]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-${index < rating ? 'yellow' : 'gray'}-400 text-lg`}
      >
        ★
      </span>
    ));
  };

  // Framer Motion variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const reviewVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDashData}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-5">
      {/* Stats Section */}
      <motion.div
        className="flex flex-wrap gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {[
          { icon: assets.earning_icon, value: `${currency} ${dashData.earnings || 0}`, label: 'Earnings' },
          { icon: assets.appointments_icon, value: dashData.appointments || 0, label: 'Appointments' },
          { icon: assets.patients_icon, value: dashData.patients || 0, label: 'Patients' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariant}
            className="flex items-center gap-3 bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:scale-105 transition-all"
          >
            <img className="w-12" src={stat.icon} alt={stat.label} />
            <div>
              <p className="text-xl font-semibold text-gray-600">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        className="bg-white mt-10 rounded-lg shadow-md border"
        initial="hidden"
        animate="visible"
        variants={cardVariant}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <img src={assets.review_icon || assets.list_icon} alt="Reviews" className="w-6" />
          <p className="font-semibold text-gray-700">Your Reviews</p>
        </div>
        <div className="p-4">
          {isLoadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  Average Rating: {averageRating} / 5
                </p>
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    variants={reviewVariant}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={review.userId?.image || assets.default_user}
                        alt={review.userId?.name || 'User'}
                      />
                      <div>
                        <p className="font-medium text-gray-700">{review.userId?.name || 'Anonymous'}</p>
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
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </motion.div>

      {/* Latest Bookings Section */}
      <motion.div
        className="bg-white mt-10 rounded-lg shadow-md border"
        initial="hidden"
        animate="visible"
        variants={cardVariant}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <img src={assets.list_icon} alt="Bookings" />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>
        <div className="pt-4">
          {dashData.latestAppointments?.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              variants={reviewVariant}
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
            >
              <img
                className="rounded-full w-10"
                src={item.userData?.image || assets.default_user}
                alt={item.userData?.name || 'User'}
              />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.userData?.name || 'Unknown'}</p>
                <p className="text-gray-600">Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-2">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 cursor-pointer hover:opacity-80"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 cursor-pointer hover:opacity-80"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </motion.div>
          )) || <p className="px-6 py-3 text-gray-500">No recent bookings.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
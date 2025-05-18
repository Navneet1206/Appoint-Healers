import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);
  const { slotDateFormat, currency, backendUrl } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ average: 0, total: 0 });

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

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
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
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchDashData();
    }
  }, [dToken]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          <button
            onClick={fetchDashData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {[
          { 
            icon: assets.earning_icon, 
            value: `${currency} ${dashData.earnings || 0}`, 
            label: 'Total Earnings',
            color: 'from-green-500 to-emerald-700',
            textColor: 'text-emerald-50'
          },
          { 
            icon: assets.appointments_icon, 
            value: dashData.appointments || 0, 
            label: 'Appointments',
            color: 'from-blue-500 to-indigo-700',
            textColor: 'text-blue-50'
          },
          { 
            icon: assets.patients_icon, 
            value: dashData.patients || 0, 
            label: 'Total Patients',
            color: 'from-purple-500 to-purple-800',
            textColor: 'text-purple-50'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-6 flex items-center gap-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <img className="w-10 h-10" src={stat.icon} alt={stat.label} />
            </div>
            <div className={stat.textColor}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="opacity-90">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <img src={assets.review_icon || assets.list_icon} alt="Reviews" className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-xl text-white">Your Reviews</h2>
            </div>
            {reviews.length > 0 && (
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300 text-lg">★</span>
                  <span className="text-white font-bold">{stats.average}</span>
                  <span className="text-white text-sm opacity-90">({stats.total})</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {isLoadingReviews ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {reviews.slice(0, 3).map((review, index) => (
                  <motion.div
                    key={index}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                        src={review.isFake ? assets.default_user : (review.userId?.image || assets.default_user)}
                        alt={review.isFake ? review.fakeUserName : (review.userId?.name || 'User')}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <p className="font-semibold text-gray-800">
                            {review.isFake ? review.fakeUserName : (review.userId?.name || 'Anonymous')}
                          </p>
                          <span className="text-sm text-gray-500 font-medium">
                            {getFormattedDate(review.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.comment && (
                          <div className="mt-2 text-gray-700 bg-gray-100 p-3 rounded-lg">
                            <p className="italic text-sm">"<span>{review.comment}</span>"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {reviews.length > 3 && (
                  <div className="text-center pt-2">
                    <a href="/doctor/reviews" className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center">
                      View all {reviews.length} reviews
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600">You don't have any reviews yet.</p>
                <p className="text-gray-500 text-sm mt-1">Reviews will appear here as patients leave feedback.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <img src={assets.list_icon} alt="Bookings" className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl text-white">Latest Appointments</h2>
          </div>
          
          <div className="overflow-hidden">
            {dashData.latestAppointments?.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {dashData.latestAppointments.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className={`flex items-center px-6 py-4 gap-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-b-0`}
                  >
                    <div className="relative">
                      <img
                        className="rounded-full w-12 h-12 object-cover border-2 border-gray-100"
                        src={item.userData?.image || assets.default_user}
                        alt={item.userData?.name || 'User'}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        item.cancelled ? 'bg-red-500' : item.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <p className="font-semibold text-gray-800">{item.userData?.name || 'Unknown'}</p>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.cancelled ? 'bg-red-100 text-red-700' : 
                          item.isCompleted ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-sm">{slotDateFormat(item.slotDate)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">No appointments yet</p>
                <p className="text-gray-500 text-sm mt-1">Your upcoming appointments will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
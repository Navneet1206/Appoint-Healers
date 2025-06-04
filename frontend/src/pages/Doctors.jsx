import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors, backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  // State for filtered doctors, loading state, and reviews data
  const [filterDoc, setFilterDoc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({});

  // Default to first service if none in URL
  const defaultService = 'Psychiatrist';

  // Services (tabs) as specified
  const filterSpecialities = [
    'Psychiatrist',
    'Therapist',
    'Sexologist',
    'Child Psychologist',
    'Relationship Counselor',
  ];

  // Dynamic slogans for each service
  const slogans = {
    Psychiatrist: 'Your mind deserves expert care and understanding.',
    Therapist: 'A trusted space to talk, heal, and grow.',
    Sexologist: 'Confidential guidance for intimate wellness.',
    'Child Psychologist': 'Nurturing young minds with compassion.',
    'Relationship Counselor': 'Building stronger bonds, one step at a time.',
  };

  // Determine current service (from URL or default)
  const currentService = speciality && filterSpecialities.includes(speciality)
    ? speciality
    : defaultService;

  // Fetch reviews for all doctors
  const fetchReviews = async () => {
    try {
      const doctorIds = doctors.map((doc) => doc._id);
      const promises = doctorIds.map((id) =>
        axios.get(`${backendUrl}/api/user/reviews/${id}`, {
          headers: { token },
        })
      );
      const responses = await Promise.all(promises);
      const reviewsMap = {};
      responses.forEach((response, index) => {
        if (response.data.success) {
          const reviews = response.data.reviews;
          const avgRating =
            reviews.length > 0
              ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : '0.0';
          reviewsMap[doctorIds[index]] = {
            averageRating: avgRating,
            reviewCount: reviews.length,
          };
        }
      });
      setReviewsData(reviewsMap);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  // Filter doctors by current service
  const applyFilter = () => {
    if (!doctors || doctors.length === 0) {
      setFilterDoc([]);
      return;
    }
    const filtered = doctors.filter(
      (doc) => doc.speciality === currentService
    );
    setFilterDoc(filtered);
  };

  // On mount or when doctors/currentService change, fetch reviews & filter
  useEffect(() => {
    setIsLoading(true);
    if (doctors && doctors.length > 0) {
      fetchReviews()
        .then(() => {
          applyFilter();
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setFilterDoc([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, currentService]);

  // Framer-motion variants for cards
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // Render star rating
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm sm:text-base ${
          index < Math.round(numRating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Show loader while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 rounded-full animate-spin"
            style={{ borderColor: '#D20424', borderTopColor: 'transparent' }}
          ></div>
          <p className="mt-4 text-gray-600 text-base sm:text-lg text-center">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Info Bar */}
      <div className="bg-gray-800 text-white text-center py-2 text-xs sm:text-sm px-4">
        we priorities your mental wellbeing
      </div>

      {/* Hero Section */}
      <section className="text-center pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">
          TOGETHER FOR A HEALTHIER MIND
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Our expert therapists support you through every step of your journey. Get help for
          depression, anxiety, and more with compassionate, affordable, and evidence-based care
        </p>
        <div className="bg-gray-300 h-32 sm:h-40 lg:h-48 flex items-center justify-center mx-auto max-w-4xl rounded-lg">
          <span className="text-gray-700 text-lg sm:text-xl">Glimpes</span>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="mt-6 sm:mt-8 bg-[#D20424] mx-2 sm:mx-4 lg:mx-0 rounded-lg lg:rounded-none overflow-hidden">
        <ul className="flex flex-wrap">
          {filterSpecialities.map((tab, idx) => {
            const isActive = currentService === tab;
            return (
              <li key={idx} className="flex-1 min-w-[calc(50%-1px)] sm:min-w-0">
                <button
                  onClick={() => {
                    navigate(`/professional/${tab}`);
                    window.scrollTo(0, 0);
                  }}
                  className={`w-full py-2 sm:py-3 px-1 sm:px-2 text-center font-medium transition-colors duration-300 text-xs sm:text-sm lg:text-base ${
                    isActive
                      ? 'bg-white text-[#D20424]'
                      : 'text-white hover:bg-red-600'
                  }`}
                >
                  {tab}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section Title & Dynamic Slogan */}
      <section className="mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {currentService}
          </h2>
          <p className="italic text-gray-600 text-base sm:text-lg leading-relaxed">
            {slogans[currentService] || ''}
          </p>
        </div>
        <div className="bg-gray-300 w-full h-32 sm:h-40 lg:h-48 rounded-lg"></div>
      </section>

      {/* Connect Section */}
      <section className="mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Connect To Our {currentService}
        </h3>

        {filterDoc && filterDoc.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filterDoc.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Professional Image */}
                <div className="relative w-full h-48 sm:h-52 lg:h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={item.image || 'https://via.placeholder.com/400x300'}
                    alt={item.name || 'professional'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                      {item.name || 'Dr. Placeholder'}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-gray-600 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full inline-block">
                        {item.speciality || 'Specialization'}
                      </p>
                      <p className="text-[#D20424] text-sm sm:text-base font-semibold">
                        Fees: ₹{item.fees || '1'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {renderStars(reviewsData[item._id]?.averageRating)}
                        <span className="ml-2 text-gray-600 text-xs sm:text-sm font-medium">
                          {reviewsData[item._id]?.averageRating || '0.0'}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        ({reviewsData[item._id]?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      className="flex-1 py-2.5 sm:py-3 border-2 border-[#D20424] text-[#D20424] font-semibold rounded-xl hover:bg-[#D20424] hover:text-white transition-all duration-300 text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => {
                        navigate(`/profile/${item._id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className="flex-1 py-2.5 sm:py-3 bg-[#D20424] text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      onClick={() => {
                        navigate(`/appointment/${item._id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-16 sm:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 font-semibold">
                No professionals found!
              </p>
              <p className="text-sm sm:text-base text-gray-500 text-center max-w-md mx-auto px-4">
                We couldn't find any professionals for the selected category. Try
                again later.
              </p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Doctors;
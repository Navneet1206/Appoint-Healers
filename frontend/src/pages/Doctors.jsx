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

  // State for filtered doctors, filter panel, and reviews
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({});
  const [filter, setFilter] = useState({
    speciality: speciality || 'All',
    minRating: 0,
    minReviews: 0,
  });

  // Available specialities for filter
  const filterSpecialities = [
    'All',
    'Counseling professional',
    'Relational therapist',
    'Listeners',
  ];

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
              : 'N/A';
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

  // Apply filters based on speciality, rating, and reviews
  const applyFilter = () => {
    let filtered = [...doctors];

    // Filter by speciality
    if (filter.speciality && filter.speciality !== 'All') {
      filtered = filtered.filter(
        (doc) => doc.speciality === filter.speciality
      );
    }

    // Filter by minimum rating
    if (filter.minRating > 0) {
      filtered = filtered.filter((doc) => {
        const avgRating = reviewsData[doc._id]?.averageRating || 0;
        return parseFloat(avgRating) >= filter.minRating;
      });
    }

    // Filter by minimum number of reviews
    if (filter.minReviews > 0) {
      filtered = filtered.filter((doc) => {
        const reviewCount = reviewsData[doc._id]?.reviewCount || 0;
        return reviewCount >= filter.minReviews;
      });
    }

    setFilterDoc(filtered);
  };

  // Update filters when doctors, speciality, or reviews change
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      fetchReviews().then(() => {
        applyFilter();
        setIsLoading(false);
      });
    } else {
      setFilterDoc([]);
      setIsLoading(false);
    }
  }, [doctors, filter]);

  // Update filter speciality when URL param changes
  useEffect(() => {
    setFilter((prev) => ({ ...prev, speciality: speciality || 'All' }));
  }, [speciality]);

  // Debug logs
  console.log('SPECIALITY from URL param:', speciality);
  console.log('ALL professionalS from context:', doctors);
  console.log('FILTERED professionalS:', filterDoc);
  console.log('Reviews data:', reviewsData);

  // Framer-motion variants
  const filterItemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  // Render star rating
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-${index < Math.round(numRating) ? 'yellow' : 'gray'}-400 text-sm`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-gray-600 text-lg">Loading professionals...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9f5] mt-28 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-gray-600 text-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Browse through our expert professionals by specialty, rating, and reviews.
        </motion.p>

        {/* Filter Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`py-2 px-4 border rounded text-sm sm:hidden transition-all ${
              showFilter ? 'bg-rose-600 text-white' : 'bg-white text-rose-600'
            }`}
          >
            {showFilter ? 'Hide Filters' : 'Show Filters'}
          </button>

          <motion.div
            className={`mt-4 p-4 bg-white rounded-lg shadow-md ${
              showFilter ? 'block' : 'hidden sm:block'
            }`}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Speciality Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speciality
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterSpecialities.map((spec, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setFilter((prev) => ({ ...prev, speciality: spec }));
                        if (spec === 'All') {
                          navigate('/professional');
                        } else {
                          navigate(`/professional/${spec}`);
                        }
                        window.scrollTo(0, 0);
                      }}
                      variants={filterItemVariant}
                      className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                        filter.speciality === spec
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-rose-600 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {spec}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filter.minRating}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      minRating: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+ Stars</option>
                  <option value={2}>2+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              {/* Minimum Reviews Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Reviews
                </label>
                <select
                  value={filter.minReviews}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      minReviews: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+ Reviews</option>
                  <option value={5}>5+ Reviews</option>
                  <option value={10}>10+ Reviews</option>
                  <option value={20}>20+ Reviews</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Doctor Cards or "No Doctors Found" */}
        {filterDoc && filterDoc.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white border border-rose-200 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <img
                  className="w-full h-48 object-cover bg-rose-100"
                  src={item.image}
                  alt={item.name || 'professional'}
                />
                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      item.available ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></span>
                    <span>{item.available ? 'Available' : 'Not Available'}</span>
                  </div>
                  <p className="text-gray-800 text-lg font-bold mt-2">{item.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.speciality}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Fee: ₹{item.fees || 'N/A'} per session
                  </p>
                  <div className="flex items-center mt-2">
                    {renderStars(reviewsData[item._id]?.averageRating)}
                    <span className="ml-2 text-gray-600 text-sm">
                      ({reviewsData[item._id]?.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-2xl text-gray-600 mb-4">No professionals found!</p>
            <p className="text-lg text-gray-500 text-center max-w-md">
              We couldn't find any professionals for the selected filters. Try adjusting your filters or check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
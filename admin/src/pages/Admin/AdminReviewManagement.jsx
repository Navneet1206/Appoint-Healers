import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminReviewManagement = () => {
  const { aToken } = useContext(AdminContext);
  const { backendUrl } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reviews, setReviews] = useState([]);
  const [fakeReview, setFakeReview] = useState({ rating: 5, comment: '', userName: 'Admin' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all doctors for the filter dropdown
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        toast.error(data.message || 'Failed to load doctors');
      }
    } catch (error) {
      toast.error('Error loading doctors');
    }
  };

  // Fetch reviews for the selected doctor
  const fetchReviews = async () => {
    if (!selectedDoctor) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/reviews/${selectedDoctor}`, {
        headers: { aToken },
      });
      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      toast.error('Error loading reviews');
    } finally {
      setIsLoading(false);
    }
  };

  // Post a fake review
  const postFakeReview = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/post-fake-review`,
        {
          doctorId: selectedDoctor,
          rating: fakeReview.rating,
          comment: fakeReview.comment,
          userName: fakeReview.userName,
        },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success('Fake review posted successfully');
        setFakeReview({ rating: 5, comment: '', userName: 'Admin' });
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.message || 'Failed to post review');
      }
    } catch (error) {
      toast.error('Error posting review');
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchReviews();
    }
  }, [selectedDoctor]);

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

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Review Management</h1>

      {/* Doctor Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Doctor:</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Select a Doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Display */}
      <div className="bg-white p-4 rounded-lg shadow-md border mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Reviews</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length > 0 ? (
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
        ) : (
          <p className="text-gray-500">No reviews for this doctor.</p>
        )}
      </div>

      {/* Post Fake Review */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Post Fake Review</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating:</label>
            <select
              value={fakeReview.rating}
              onChange={(e) => setFakeReview({ ...fakeReview, rating: Number(e.target.value) })}
              className="w-full p-2 border rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Comment:</label>
            <textarea
              value={fakeReview.comment}
              onChange={(e) => setFakeReview({ ...fakeReview, comment: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="3"
              placeholder="Write your review here..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">User Name:</label>
            <input
              type="text"
              value={fakeReview.userName}
              onChange={(e) => setFakeReview({ ...fakeReview, userName: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter a fake user name"
            />
          </div>
          <button
            onClick={postFakeReview}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewManagement;
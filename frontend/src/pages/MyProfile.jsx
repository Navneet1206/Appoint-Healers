import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Custom Popup Component
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
              className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 ${getBgColor()}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

const MyProfile = () => {
  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '' });
  const navigate = useNavigate();

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      showPopup('info', 'Login Required', 'Please login to view your profile.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  }, [token, navigate]);

  // Handle file selection; accept only images.
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        showPopup("error", "Invalid File", "Please select a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreviewUrl(reader.result);
        setImageFile(file);
      });
      reader.readAsDataURL(file);
    }
  };

  // Function to update user profile data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        showPopup("success", "Profile Updated", data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setPreviewUrl(null);
        setImageFile(null);
      } else {
        showPopup("error", "Update Failed", data.message);
      }
    } catch (error) {
      console.error(error);
      showPopup("error", "Update Error", error.response?.data?.message || error.message);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setPreviewUrl(null);
    setImageFile(null);
  };

  return userData ? (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      <div className="bg-gradient-to-r from-rose-400 to-rose-600 p-6 text-white">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image & Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-rose-200 shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src={previewUrl || userData.image}
                  alt="Profile"
                />
              </div>
              
              {isEdit && (
                <label htmlFor="image" className="absolute -bottom-2 -right-2 bg-rose-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-rose-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812.63A2 2 0 0018.07 6H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    onChange={onSelectFile}
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {!isEdit && (
              <h2 className="mt-4 text-2xl font-semibold text-red-800">{userData.name}</h2>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-rose-50 p-4 rounded-lg">
                <h3 className="font-medium text-rose-700 border-b border-rose-200 pb-2 mb-3">CONTACT INFORMATION</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-rose-800 w-24">Email:</span>
                    <span className="text-rose-600">{userData.email}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-rose-800 w-24">Phone:</span>
                    {isEdit ? (
                      <input
                        className="bg-white border border-rose-300 rounded-md px-3 py-2 w-full sm:w-auto"
                        type="text"
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        value={userData.phone}
                      />
                    ) : (
                      <span className="text-rose-600">{userData.phone}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-rose-800 w-24 sm:pt-1">Address:</span>
                    {isEdit ? (
                      <div className="space-y-2 flex-1">
                        <input
                          className="bg-white border border-rose-300 rounded-md px-3 py-2 w-full"
                          type="text"
                          placeholder="Address Line 1"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                          value={userData.address.line1}
                        />
                        <input
                          className="bg-white border border-rose-300 rounded-md px-3 py-2 w-full"
                          type="text"
                          placeholder="Address Line 2"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                          value={userData.address.line2}
                        />
                      </div>
                    ) : (
                      <span className="text-rose-600">
                        {userData.address.line1} <br /> {userData.address.line2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-rose-50 p-4 rounded-lg">
                <h3 className="font-medium text-rose-700 border-b border-rose-200 pb-2 mb-3">BASIC INFORMATION</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-rose-800 w-24">Gender:</span>
                    {isEdit ? (
                      <select
                        className="bg-white border border-rose-300 rounded-md px-3 py-2"
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        value={userData.gender}
                      >
                        <option value="Not Selected">Not Selected</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      <span className="text-rose-600">{userData.gender}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-rose-800 w-28">Birthday:</span>
                    {isEdit ? (
                      <input
                        className="bg-white border border-rose-300 rounded-md px-3 py-2"
                        type="date"
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, dob: e.target.value }))
                        }
                        value={userData.dob}
                      />
                    ) : (
                      <span className="text-rose-600">{userData.dob}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {isEdit ? (
            <>
              <button
                onClick={updateUserProfileData}
                className="bg-rose-500 text-white px-6 py-2 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="bg-white text-rose-600 border border-rose-300 px-6 py-2 rounded-full font-medium hover:bg-rose-50 transition-colors shadow-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-rose-500 text-white px-6 py-2 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default MyProfile;
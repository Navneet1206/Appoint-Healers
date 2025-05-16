import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bannerImg, setBannerImg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ensure profileData.address is initialized
    useEffect(() => {
        if (profileData && !profileData.address) {
            setProfileData(prev => ({
                ...prev,
                address: { line1: '', line2: '' }
            }));
        }
    }, [profileData, setProfileData]);

    const updateProfile = async () => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('docId', profileData._id);
            formData.append('fees', profileData.fees);
            formData.append('address', JSON.stringify(profileData.address || { line1: '', line2: '' }));
            formData.append('available', profileData.available);
            formData.append('about', profileData.about);
            if (bannerImg) {
                formData.append('bannerImage', bannerImg);
                console.log('Banner image added to FormData:', bannerImg);
            } else {
                console.log('No banner image in FormData');
            }

            const { data } = await axios.post(
                `${backendUrl}/api/doctor/update-profile`,
                formData,
                { headers: { dToken } }
            );

            console.log('Update profile response:', data);

            if (data.success) {
                toast.success(data.message);
                await getProfileData(); // Force refresh to ensure bannerImage is fetched
                setIsEdit(false);
                setBannerImg(null);
                setIsModalOpen(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            console.error('Update profile error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBannerSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImg(file);
            setIsModalOpen(true);
            console.log('Banner image selected:', file);
        }
    };

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken, getProfileData]);

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-pulse text-primary font-medium">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className="relative">
                            <img 
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-md" 
                                src={profileData.image} 
                                alt={profileData.name} 
                            />
                            <div className={`absolute bottom-3 right-3 w-5 h-5 ${profileData.available ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></div>
                        </div>
                        
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{profileData.name}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                                <p className="text-gray-700">{profileData.degree}</p>
                                <span className="text-gray-400">•</span>
                                <p className="text-gray-700">{profileData.speciality}</p>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-3">
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {profileData.experience}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                    {currency} {profileData.fees} / Consultation
                                </span>
                                <span className={`px-3 py-1 ${profileData.available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'} rounded-full text-sm font-medium`}>
                                    {profileData.available ? 'Available' : 'Not Available'}
                                </span>
                            </div>
                        </div>
                        
                        {!isEdit && (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className="px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium text-sm flex items-center gap-1"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Profile Content */}
                <div className="p-6 sm:p-8">
                    {isEdit ? (
                        <div className="space-y-6">
                            {/* About Section (Edit Mode) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                                <textarea 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    rows={6} 
                                    value={profileData.about || ''}
                                    placeholder="Write about your professional experience and expertise..."
                                />
                            </div>
                            
                            {/* Fee Section (Edit Mode) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ({currency})</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                    value={profileData.fees || ''}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>
                            
                            {/* Address Section (Edit Mode) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                        value={profileData.address?.line1 || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="Address Line 1"
                                    />
                                    <input 
                                        type="text" 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                        value={profileData.address?.line2 || ''}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="Address Line 2"
                                    />
                                </div>
                            </div>
                            
                            {/* Banner Image Upload (Edit Mode) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                                <p className="text-xs text-gray-500 mb-2">Recommended size: 1584 x 396 pixels (LinkedIn banner size)</p>
                                <div className="flex items-center gap-4">
                                    {bannerImg ? (
                                        <img src={URL.createObjectURL(bannerImg)} alt="Banner Preview" className="w-32 h-16 object-cover rounded" />
                                    ) : profileData.bannerImage ? (
                                        <img src={profileData.bannerImage} alt="Current Banner" className="w-32 h-16 object-cover rounded" />
                                    ) : (
                                        <p className="text-gray-500">No banner image</p>
                                    )}
                                    <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg">
                                        {bannerImg || profileData.bannerImage ? 'Change Image' : 'Upload Image'}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleBannerSelect} 
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                               
                            </div>
                            
                            {/* Availability Toggle (Edit Mode) */}
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="availability"
                                    onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                    checked={profileData.available || false}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                                    Available for new appointments
                                </label>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => {
                                        setIsEdit(false);
                                        setBannerImg(null);
                                        setIsModalOpen(false);
                                    }} 
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={updateProfile} 
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Banner Image Display */}
                            {profileData.bannerImage ? (
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800 mb-3">Banner</h2>
                                    <img 
                                        src={profileData.bannerImage} 
                                        alt="Banner" 
                                        className="w-full h-32 object-cover rounded-lg" 
                                    />
                                       </div>
                            ) : (
                                <p className="text-gray-500">No banner image uploaded.</p>
                            )}
                            
                            {/* About Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">About</h2>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                                    {profileData.about || 'No information provided.'}
                                </div>
                            </div>
                            
                            {/* Address Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">Practice Location</h2>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                                    <p>{profileData.address?.line1 || 'Not provided'}</p>
                                    <p>{profileData.address?.line2 || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Banner Preview Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Banner Preview</h2>
                        {bannerImg && (
                            <img 
                                src={URL.createObjectURL(bannerImg)} 
                                alt="Banner Preview" 
                                className="w-full h-32 object-cover rounded-lg mb-4" 
                            />
                        )}
                        <p className="text-gray-600 mb-4">Would you like to use this image as your banner?</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    setBannerImg(null);
                                    setIsModalOpen(false);
                                }} 
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfile;
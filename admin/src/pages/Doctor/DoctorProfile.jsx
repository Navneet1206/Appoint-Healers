import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateProfile = async () => {
        try {
            setIsSubmitting(true)
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(
                `${backendUrl}/api/doctor/update-profile`, 
                updateData, 
                { headers: { dToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile')
            console.error(error)
        } finally {
            setIsSubmitting(false)
            setIsEdit(false)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken, getProfileData])

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-pulse text-primary font-medium">Loading profile...</div>
            </div>
        )
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
                                    value={profileData.about}
                                    placeholder="Write about your professional experience and expertise..."
                                />
                            </div>
                            
                            {/* Fee Section (Edit Mode) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ({currency})</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                    value={profileData.fees}
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
                                        value={profileData.address.line1}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="Address Line 1"
                                    />
                                    <input 
                                        type="text" 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                        value={profileData.address.line2}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="Address Line 2"
                                    />
                                </div>
                            </div>
                            
                            {/* Availability Toggle (Edit Mode) */}
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="availability"
                                    onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                    checked={profileData.available}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                                    Available for new appointments
                                </label>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsEdit(false)} 
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
                            {/* About Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">About</h2>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                                    {profileData.about}
                                </div>
                            </div>
                            
                            {/* Address Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">Practice Location</h2>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                                    <p>{profileData.address.line1}</p>
                                    <p>{profileData.address.line2}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile
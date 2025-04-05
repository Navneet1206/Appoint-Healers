import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddDoctor = () => {
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: 'Counseling professional',
        degree: '',
        experience: '1',
        about: '',
        fees: '',
        mobile: '',
        languages: [],
        specialists: [],
        address: {
            line1: '',
            line2: ''
        }
    })

    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!imageFile) {
                toast.error('Please select a profile image')
                return
            }

            const formDataToSend = new FormData()
            formDataToSend.append('image', imageFile)

            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key === 'address') {
                    formDataToSend.append(key, JSON.stringify(formData[key]))
                } else if (key === 'languages' || key === 'specialists') {
                    formDataToSend.append(key, JSON.stringify(formData[key]))
                } else {
                    formDataToSend.append(key, formData[key])
                }
            })

            const response = await axios.post('/api/admin/add-doctor', formDataToSend)
            if (response.data.success) {
                toast.success('Doctor added successfully')
                navigate('/admin/doctors')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding doctor')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Add New Doctor</h2>
                        <p className="mt-2 text-sm text-gray-600">Fill in the details to add a new healthcare professional</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="profile-image"
                            />
                            <label
                                htmlFor="profile-image"
                                className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Upload Profile Picture
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Speciality</label>
                                    <select
                                        value={formData.speciality}
                                        onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Counseling professional">Counseling Professional</option>
                                        <option value="Relational therapist">Relational Therapist</option>
                                        <option value="Family therapist">Family Therapist</option>
                                        <option value="Listeners">Listeners</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                                    <input
                                        type="text"
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                                    <select
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                                            <option key={year} value={year}>{year} Year{year > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Consultation Fee (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.fees}
                                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Languages and Specialties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                                <select
                                    multiple
                                    value={formData.languages}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        languages: Array.from(e.target.selectedOptions, option => option.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Marathi">Marathi</option>
                                    <option value="Gujarati">Gujarati</option>
                                    <option value="Bengali">Bengali</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Telugu">Telugu</option>
                                </select>
                                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple languages</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                                <select
                                    multiple
                                    value={formData.specialists}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        specialists: Array.from(e.target.selectedOptions, option => option.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                                >
                                    <option value="Depression Counseling">Depression Counseling</option>
                                    <option value="Anxiety Management">Anxiety Management</option>
                                    <option value="Relationship Counseling">Relationship Counseling</option>
                                    <option value="Family Therapy">Family Therapy</option>
                                    <option value="Grief Counseling">Grief Counseling</option>
                                    <option value="Stress Management">Stress Management</option>
                                    <option value="Career Counseling">Career Counseling</option>
                                    <option value="Trauma Therapy">Trauma Therapy</option>
                                    <option value="Addiction Counseling">Addiction Counseling</option>
                                    <option value="Child Psychology">Child Psychology</option>
                                </select>
                                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple specialties</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                placeholder="Address Line 1"
                                value={formData.address.line1}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    address: { ...formData.address, line1: e.target.value }
                                })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address Line 2"
                                value={formData.address.line2}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    address: { ...formData.address, line2: e.target.value }
                                })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* About */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">About</label>
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Write a brief description about the doctor's expertise and experience..."
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Add Doctor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddDoctor 
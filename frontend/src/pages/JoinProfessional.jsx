import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const JoinProfessional = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [degree, setDegree] = useState('');
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');
  const [fees, setFees] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [languages, setLanguages] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreviewUrl(reader.result);
        setImageFile(file);
      });
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!name || !email || !speciality || !degree || !experience || !about || !fees || !addressLine1 || !addressLine2 || !languages || !imageFile) {
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('experience', experience);
      formData.append('about', about);
      formData.append('fees', fees);
      formData.append('address', JSON.stringify({ line1: addressLine1, line2: addressLine2 }));
      formData.append('languages', languages);
      formData.append('image', imageFile);

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/request-professional`, formData);
      if (data.success) {
        toast.success('Request submitted successfully. Check your email for confirmation.');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!name || !email)) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (step === 2 && (!speciality || !degree || !experience || !about || !fees)) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (step === 3 && (!addressLine1 || !addressLine2 || !languages)) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-rose-900">Personal Information</h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. John Doe"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-rose-900">Professional Details</h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Speciality</label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              >
                <option value="" disabled>Select Speciality</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Therapist">Therapist</option>
                <option value="Sexologist">Sexologist</option>
                <option value="Child Psychologist">Child Psychologist</option>
                <option value="Relationship Counselor">Relationship Counselor</option>
                <option value="Active Listener">Active Listener</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g., MBBS, MD"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Experience</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g., 10 years"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Consultation Fees (INR)</label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="e.g., 500"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-rose-900">Contact Information</h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Address Line 1</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Street Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Address Line 2</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="City, State, ZIP"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Languages (comma-separated)</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g., English, Hindi"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-rose-900">Profile Image</h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Upload Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full mx-auto mt-4 border-2 border-rose-200"
                />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-rose-900 mb-6 text-center font-playfair">Join as Professional</h2>
          
          {/* Progress Bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                    step >= s ? 'bg-rose-600' : 'bg-gray-300'
                  }`}
                >
                  {s}
                </div>
                <span className="text-sm mt-2 text-gray-600">
                  {s === 1 ? 'Personal' : s === 2 ? 'Professional' : s === 3 ? 'Contact' : 'Image'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={step === 4 ? onSubmit : (e) => e.preventDefault()}>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-full font-semibold hover:from-rose-700 hover:to-pink-600 transition ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-full font-semibold transition ml-auto ${
                    loading
                      ? 'bg-rose-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinProfessional;
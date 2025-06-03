import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('Psychiatrist');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [languages, setLanguages] = useState('English');
    const [specialityList, setSpecialityList] = useState('Counseling professional');
    
    // New states for loader and popup
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, type: '', message: '' });

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    // Custom popup functions
    const showPopup = (type, message) => {
        setPopup({ show: true, type, message });
        setTimeout(() => {
            setPopup({ show: false, type: '', message: '' });
        }, 4000);
    };

    const closePopup = () => {
        setPopup({ show: false, type: '', message: '' });
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (!docImg) {
                setIsLoading(false);
                return showPopup('error', 'Image Not Selected');
            }

            const formData = new FormData();

            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
            formData.append('languages', languages);
            formData.append('specialityList', specialityList);

            // Log form data for debugging
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } });

            setIsLoading(false);

            if (data.success) {
                showPopup('success', data.message);
                setDocImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAddress1('');
                setAddress2('');
                setDegree('');
                setAbout('');
                setFees('');
                setLanguages('');
                setSpecialityList('');
            } else {
                showPopup('error', data.message);
            }

        } catch (error) {
            setIsLoading(false);
            showPopup('error', error.message);
            console.log(error);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative'>
            
            {/* Loading Overlay */}
            {isLoading && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl'>
                        <div className='relative'>
                            <div className='w-16 h-16 border-4 border-gray-200 rounded-full'></div>
                            <div className='absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin' style={{borderTopColor: '#D20424'}}></div>
                        </div>
                        <div className='text-center'>
                            <h3 className='text-lg font-semibold text-gray-800'>Adding Doctor</h3>
                            <p className='text-gray-600 text-sm mt-1'>Please wait while we process the information...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Popup */}
            {popup.show && (
                <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40'>
                    <div className={`bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${popup.show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                        <div className='flex items-start gap-4'>
                            {popup.type === 'success' ? (
                                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                                    <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
                                    <svg className='w-6 h-6 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd'></path>
                                    </svg>
                                </div>
                            )}
                            <div className='flex-1'>
                                <h3 className={`text-lg font-semibold ${popup.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {popup.type === 'success' ? 'Success!' : 'Error!'}
                                </h3>
                                <p className='text-gray-600 text-sm mt-1'>{popup.message}</p>
                            </div>
                            <button 
                                onClick={closePopup}
                                className='flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200'
                            >
                                <svg className='w-5 h-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'></path>
                                </svg>
                            </button>
                        </div>
                        <div className='mt-4 flex justify-end'>
                            <button 
                                onClick={closePopup}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    popup.type === 'success' 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                {popup.type === 'success' ? 'Great!' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='max-w-6xl mx-auto'>
                {/* Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-red-600 to-red-700' style={{backgroundColor: '#D20424'}}></div>
                        <h1 className='text-3xl font-bold text-gray-800'>Add New Doctor</h1>
                    </div>
                    <p className='text-gray-600 ml-7'>Fill in the details below to add a new healthcare professional to your platform</p>
                </div>

                <form onSubmit={onSubmitHandler} className='w-full'>
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
                        
                        {/* Image Upload Section */}
                        <div className='bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100'>
                            <div className='flex items-center gap-6'>
                                <label htmlFor="doc-img" className='relative group cursor-pointer'>
                                    <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-red-300 transition-all duration-300 shadow-lg group-hover:shadow-xl'>
                                        <img 
                                            className='w-full h-full object-cover bg-gray-100' 
                                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                            alt="Doctor" 
                                        />
                                    </div>
                                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300 flex items-center justify-center'>
                                        <svg className='w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' fill='currentColor' viewBox='0 0 20 20'>
                                            <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                                        </svg>
                                    </div>
                                </label>
                                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-1'>Doctor Profile Picture</h3>
                                    <p className='text-gray-600 text-sm'>Click to upload a professional photo (JPG, PNG)</p>
                                    <p className='text-xs text-gray-500 mt-1'>Recommended: Square image, minimum 300x300px</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className='p-8'>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                
                                {/* Left Column */}
                                <div className='space-y-6'>
                                    
                                    {/* Personal Information Section */}
                                    <div className='bg-gray-50 rounded-xl p-6'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                            <svg className='w-5 h-5' style={{color: '#D20424'}} fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd'></path>
                                            </svg>
                                            Personal Information
                                        </h3>
                                        
                                        <div className='space-y-4'>
                                            <div className='group'>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                                <input 
                                                    onChange={e => setName(e.target.value)} 
                                                    value={name} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    style={{'--tw-ring-color': '#D20424'}}
                                                    type="text" 
                                                    placeholder='Enter doctor full name' 
                                                    required 
                                                />
                                            </div>

                                            <div className='group'>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                                <input 
                                                    onChange={e => setEmail(e.target.value)} 
                                                    value={email} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="email" 
                                                    placeholder='doctor@example.com' 
                                                    required 
                                                />
                                            </div>

                                            <div className='group'>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                                                <input 
                                                    onChange={e => setPassword(e.target.value)} 
                                                    value={password} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="password" 
                                                    placeholder='Create a secure password' 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Details Section */}
                                    <div className='bg-gray-50 rounded-xl p-6'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                            <svg className='w-5 h-5' style={{color: '#D20424'}} fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                            </svg>
                                            Professional Details
                                        </h3>
                                        
                                        <div className='space-y-4'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Experience</label>
                                                    <select 
                                                        onChange={e => setExperience(e.target.value)} 
                                                        value={experience} 
                                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white'
                                                    >
                                                        <option value="1 Year">1 Year</option>
                                                        <option value="2 Year">2 Years</option>
                                                        <option value="3 Year">3 Years</option>
                                                        <option value="4 Year">4 Years</option>
                                                        <option value="5 Year">5 Years</option>
                                                        <option value="6 Year">6 Years</option>
                                                        <option value="8 Year">8 Years</option>
                                                        <option value="9 Year">9 Years</option>
                                                        <option value="10 Year">10 Years</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Consultation Fees</label>
                                                    <input 
                                                        onChange={e => setFees(e.target.value)} 
                                                        value={fees} 
                                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                        type="number" 
                                                        placeholder='₹500' 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Languages</label>
                                                <input 
                                                    onChange={e => setLanguages(e.target.value)} 
                                                    value={languages} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="text" 
                                                    placeholder='English, Hindi, Bengali' 
                                                    required 
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Specialities</label>
                                                <input 
                                                    onChange={e => setSpecialityList(e.target.value)} 
                                                    value={specialityList} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="text" 
                                                    placeholder='Anxiety, Depression, Stress Management' 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className='space-y-6'>
                                    
                                    {/* Medical Credentials Section */}
                                    <div className='bg-gray-50 rounded-xl p-6'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                            <svg className='w-5 h-5' style={{color: '#D20424'}} fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z'></path>
                                            </svg>
                                            Medical Credentials
                                        </h3>
                                        
                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Primary Speciality</label>
                                                <select 
                                                    onChange={e => setSpeciality(e.target.value)} 
                                                    value={speciality} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white'
                                                >
                                                    <option value="Psychiatrist">Psychiatrist</option>
                                                    <option value="Therapist">Therapist</option>
                                                    <option value="Sexologist">Sexologist</option>
                                                    <option value="Child Psychologist">Child Psychologist</option>
                                                    <option value="Relationship Counselor">Relationship Counselor</option>
                                                    <option value="Active Listener">Active Listener</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Degree & Qualifications</label>
                                                <input 
                                                    onChange={e => setDegree(e.target.value)} 
                                                    value={degree} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="text" 
                                                    placeholder='MBBS, MD Psychiatry' 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information Section */}
                                    <div className='bg-gray-50 rounded-xl p-6'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                            <svg className='w-5 h-5' style={{color: '#D20424'}} fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'></path>
                                            </svg>
                                            Contact Information
                                        </h3>
                                        
                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Primary Address</label>
                                                <input 
                                                    onChange={e => setAddress1(e.target.value)} 
                                                    value={address1} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="text" 
                                                    placeholder='Clinic/Hospital Address' 
                                                    required 
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Secondary Address</label>
                                                <input 
                                                    onChange={e => setAddress2(e.target.value)} 
                                                    value={address2} 
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white' 
                                                    type="text" 
                                                    placeholder='Area, City, State' 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className='mt-8 bg-gray-50 rounded-xl p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                    <svg className='w-5 h-5' style={{color: '#D20424'}} fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd'></path>
                                    </svg>
                                    About the Doctor
                                </h3>
                                <textarea 
                                    onChange={e => setAbout(e.target.value)} 
                                    value={about} 
                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-200 bg-white resize-none' 
                                    rows={5} 
                                    placeholder='Write a comprehensive description about the doctor including their expertise, approach to treatment, and any notable achievements...'
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-8 flex justify-center'>
                                <button 
                                    type='submit' 
                                    disabled={isLoading}
                                    className={`group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{backgroundColor: '#D20424', backgroundImage: 'linear-gradient(135deg, #D20424 0%, #B8031F 100%)'}}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd'></path>
                                            </svg>
                                            Add Doctor to Platform
                                        </>
                                    )}
                                    <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300'></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;
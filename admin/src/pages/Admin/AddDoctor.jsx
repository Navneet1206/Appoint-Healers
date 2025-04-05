import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Counseling professional')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [mobile, setMobile] = useState('')
    const [languages, setLanguages] = useState([])
    const [specialists, setSpecialists] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const languageOptions = [
        "English", "Hindi", "Spanish", "French", "German",
        "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu"
    ]

    const specialistOptions = [
        "Depression Counseling", "Anxiety Management", "Relationship Counseling",
        "Family Therapy", "Grief Counseling", "Stress Management",
        "Career Counseling", "Trauma Therapy", "Addiction Counseling",
        "Child Psychology"
    ]

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            if (!docImg) {
                toast.error('Image Not Selected')
                setIsSubmitting(false)
                return
            }

            if (languages.length === 0) {
                toast.error('Please select at least one language')
                setIsSubmitting(false)
                return
            }

            if (specialists.length === 0) {
                toast.error('Please select at least one specialty')
                setIsSubmitting(false)
                return
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            const experienceValue = parseInt(experience.split(' ')[0]);
            formData.append('experience', experienceValue)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('mobile', mobile)
            formData.append('languages', JSON.stringify(languages))
            formData.append('specialists', JSON.stringify(specialists))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                // Reset all form fields
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setMobile('')
                setLanguages([])
                setSpecialists([])
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Error adding doctor')
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleLanguage = (lang) => {
        if (languages.includes(lang)) {
            setLanguages(languages.filter(l => l !== lang))
        } else {
            setLanguages([...languages, lang])
        }
    }

    const toggleSpecialist = (specialty) => {
        if (specialists.includes(specialty)) {
            setSpecialists(specialists.filter(s => s !== specialty))
        } else {
            setSpecialists([...specialists, specialty])
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Mobile Number</p>
                            <input onChange={e => setMobile(e.target.value)} value={mobile} className='border rounded px-3 py-2' type="tel" placeholder='Mobile Number' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10 Years">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Doctor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="Counseling professional">Counseling professional</option>
                                <option value="Relational therapist">Relational therapist</option>
                                <option value="Family therapist">Family therapist</option>
                                <option value="Listeners">Listeners</option>
                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Languages <span className="text-red-500">*</span></p>
                            <div className="border rounded p-3 max-h-40 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {languageOptions.map((lang) => (
                                        <div
                                            key={lang}
                                            onClick={() => toggleLanguage(lang)}
                                            className={`p-2 rounded cursor-pointer text-center ${languages.includes(lang)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Click to select/deselect languages</p>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Specialties <span className="text-red-500">*</span></p>
                            <div className="border rounded p-3 max-h-40 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {specialistOptions.map((specialty) => (
                                        <div
                                            key={specialty}
                                            onClick={() => toggleSpecialist(specialty)}
                                            className={`p-2 rounded cursor-pointer text-center ${specialists.includes(specialty)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {specialty}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Click to select/deselect specialties</p>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about doctor'></textarea>
                </div>

                <button
                    type='submit'
                    className={`px-10 py-3 mt-4 text-white rounded-full ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark'
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add doctor'}
                </button>

            </div>


        </form>
    )
}

export default AddDoctor
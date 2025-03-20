import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Contact = () => {
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Use Vite's environment variable (ensure it's defined in your .env file as VITE_BACKEND_URL)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/contact`, {
        name,
        email,
        message,
      })

      if (data.success) {
        toast.success(data.message || 'Message sent successfully!')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        toast.error(data.message || 'Failed to send message!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-rose-50 p-4 md:p-8 min-h-screen">
      {/* Title */}
      <div className="text-center text-2xl pt-10 text-rose-700 font-semibold">
        <p>
          CONTACT <span className="text-gray-700 font-bold">US</span>
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm max-w-6xl mx-auto">
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-md"
          src={assets.contact_image}
          alt="Contact"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500 leading-relaxed">
            Survey No. 140 - 141/1 <br />
            Indian Institute of Information Technology, Nagpur (IIITN)
          </p>
          <p className="text-gray-500">
            Tel: (91) 8468938745 <br /> Email: vasuparashar18@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">CAREERS AT SAVAYAS HEALS</p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-gray-800 px-8 py-3 text-sm hover:bg-gray-800 hover:text-white transition-all duration-500 rounded-md">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl text-rose-700 font-semibold mb-4 text-center">
          Send Us a Message
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
              type="text"
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
              type="email"
              id="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
              id="message"
              rows="5"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-rose-600 text-white py-2 px-6 rounded hover:bg-rose-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact

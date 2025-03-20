import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="bg-rose-50 p-4 md:p-8 min-h-screen">
      {/* Title */}
      <div className="text-center text-2xl pt-10 text-rose-700 font-semibold">
        <p>
          ABOUT <span className="text-gray-700 font-bold">US</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="my-10 flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-md"
          src={assets.about_image}
          alt="About"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to <strong>SAVAYAS HEALS</strong>, your trusted partner in managing your healthcare
            needs conveniently and efficiently. At SAVAYAS HEALS, we understand the challenges
            individuals face when it comes to scheduling doctor appointments and managing their
            health records.
          </p>
          <p>
            SAVAYAS HEALS is committed to excellence in healthcare technology. We continuously
            strive to enhance our platform, integrating the latest advancements to improve user
            experience and deliver superior service. Whether you're booking your first appointment
            or managing ongoing care, SAVAYAS HEALS is here to support you every step of the way.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at SAVAYAS HEALS is to create a seamless healthcare experience for every
            user. We aim to bridge the gap between patients and healthcare providers, making it
            easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-6xl mx-auto">
        <div className="text-xl my-4 text-rose-700 font-semibold">
          <p>
            WHY <span className="text-gray-700 font-bold">CHOOSE US</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 mb-20">
          <div className="flex-1 border px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-rose-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-l-lg md:rounded-l-none md:rounded-none">
            <b>EFFICIENCY</b>
            <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
          </div>
          <div className="flex-1 border px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-rose-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
            <b>CONVENIENCE</b>
            <p>Access to a network of trusted healthcare professionals in your area.</p>
          </div>
          <div className="flex-1 border px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-rose-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-r-lg md:rounded-r-none md:rounded-none">
            <b>PERSONALIZATION</b>
            <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

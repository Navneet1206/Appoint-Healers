import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-rose-600 rounded-2xl mx-4 md:mx-10 my-16 overflow-hidden">
      <motion.div 
        className="flex flex-col md:flex-row items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Side */}
        <div className="flex-1 p-8 md:p-12">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Book Appointment <br /> With 100+ Trusted Doctors
          </motion.h2>
          <motion.button 
            onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}
            className="mt-6 inline-flex items-center bg-rose-100 text-rose-600 font-semibold px-8 py-3 rounded-full shadow-md transform transition hover:scale-105"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Create Account
          </motion.button>
        </div>
        {/* Right Side */}
        <motion.div 
          className="flex-1 relative hidden md:block"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img className="w-full h-auto object-cover" src={assets.appointment_img} alt="Appointment" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Banner;

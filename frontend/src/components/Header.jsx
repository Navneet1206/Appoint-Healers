import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Header = () => {
  const container = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <header className="bg-rose-600 rounded-b-3xl overflow-hidden">
      <motion.div 
        className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-10 lg:px-20 py-10 md:py-20"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-6 text-white">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Book Appointment <br /> With Trusted Professionals
          </motion.h1>
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img className="w-24" src={assets.group_profiles} alt="Profiles" />
            <p className="text-base sm:text-lg">
              Browse our extensive list of trusted professionals and schedule your appointment hassle-free.
            </p>
          </motion.div>
          <motion.a 
            href="#speciality"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-3 rounded-full shadow-lg transform transition-transform hover:scale-105"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Book Appointment 
            <img className="w-4" src={assets.arrow_icon} alt="Arrow" />
          </motion.a>
        </div>
        {/* Right Side */}
        <motion.div 
          className="flex-1 mt-8 md:mt-0 relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img className="w-full h-auto rounded-lg object-cover" src={assets.header_img} alt="Header" />
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Header;

import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SpecialityMenu = () => {
  const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="speciality" className="py-16 bg-rose-50">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl font-semibold text-rose-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Find by Speciality
        </motion.h2>
        <motion.p 
          className="mt-2 text-gray-600 text-sm sm:w-1/2 mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Browse through our extensive list of trusted professionals and schedule your appointment hassle-free.
        </motion.p>
        <motion.div 
          className="mt-8 flex gap-6 overflow-x-auto pb-4 justify-center"
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {specialityData.map((item, index) => (
            <motion.div key={index} variants={itemVariant}>
              <Link 
                to={`/professional/${item.speciality}`}
                onClick={() => window.scrollTo(0, 0)}
                className="flex flex-col items-center text-xs sm:text-sm cursor-pointer transition transform hover:scale-105"
              >
                <img className="w-16 sm:w-24 mb-2 rounded-full border border-rose-200 p-1" src={item.image} alt={item.speciality} />
                <span className="text-gray-700">{item.speciality}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialityMenu;

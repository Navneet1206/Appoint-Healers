import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-semibold text-rose-600">Top Doctors to Book</h2>
          <p className="mt-2 text-gray-600 text-sm sm:w-1/2 mx-auto">
            Browse through our extensive list of trusted doctors and book an appointment effortlessly.
          </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {doctors.slice(0, 10).map((item, index) => (
            <motion.div 
              key={index}
              variants={cardVariant}
              className="bg-gray-50 border border-rose-200 rounded-xl overflow-hidden cursor-pointer transform transition duration-500 hover:shadow-xl hover:-translate-y-2"
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
            >
              <img className="w-full h-48 object-cover bg-rose-100" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className={`flex items-center gap-2 text-xs mb-2 ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></span>
                  <span>{item.available ? 'Available' : "Not Available"}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <button 
            onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
            className="bg-rose-600 text-white px-8 py-3 rounded-full shadow-lg transform transition hover:scale-105"
          >
            More Doctors
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TopDoctors;

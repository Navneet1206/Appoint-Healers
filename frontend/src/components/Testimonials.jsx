import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "John Doe",
    feedback: "The service was exceptional! Booking an appointment was easy and hassle-free.",
    image: "https://via.placeholder.com/100"
  },
  {
    name: "Jane Smith",
    feedback: "Highly recommended. The doctors are very professional and caring.",
    image: "https://via.placeholder.com/100"
  },
  {
    name: "Michael Brown",
    feedback: "A wonderful experience. The interface is user-friendly and the support is great.",
    image: "https://via.placeholder.com/100"
  }
];

const Testimonials = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl font-semibold text-rose-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          What Our Patients Say
        </motion.h2>
        <motion.div 
          className="mt-8 flex flex-col md:flex-row justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-rose-50 p-6 rounded-lg shadow-md flex flex-col items-center"
              variants={cardVariants}
            >
              <img className="w-20 h-20 rounded-full mb-4" src={testimonial.image} alt={testimonial.name} />
              <p className="text-gray-700 italic mb-4">"{testimonial.feedback}"</p>
              <h3 className="text-rose-600 font-semibold">{testimonial.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

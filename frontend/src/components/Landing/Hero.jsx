import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: 'Your Mind Deserves Care',
    subtitle: 'Explore self-tests, book professionals & take a step toward better mental health.',
    image: 'https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  {
    title: 'Check in with Yourself',
    subtitle: 'Start with a free, private test and understand where you stand.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  {
    title: 'Book a Healing Session',
    subtitle: 'Talk to professionals and begin your healing journey.',
    image: 'https://images.unsplash.com/photo-1587370560942-7a8e427f00a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  // Add more slides here easily by following the same structure
  // Example:
  // {
  //   title: 'New Slide Title',
  //   subtitle: 'New slide description.',
  //   image: 'https://images.unsplash.com/photo-123456789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  //   primaryLink: '/new-link',
  //   secondaryLink: '/another-link',
  // },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const slideVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <section
      className="relative w-full min-h-[500px] md:min-h-[500px] flex items-center justify-center overflow-hidden"
      aria-label="Hero Slider Section"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src={slides[currentSlide].image}
            alt={`Background for ${slides[currentSlide].title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4 tracking-tight leading-tight drop-shadow-md">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg font-sans text-white/90 mb-8 max-w-md mx-auto leading-relaxed drop-shadow-md">
              {slides[currentSlide].subtitle}
            </p>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href={slides[currentSlide].primaryLink}
                className="inline-block bg-[#D20424] text-white text-lg font-sans font-medium py-3 px-6 rounded-2xl hover:bg-[#b5031f] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:ring-offset-2"
                aria-label="Take Mental Health Test"
              >
                Mental Health Test
              </a>
              <a
                href={slides[currentSlide].secondaryLink}
                className="inline-block bg-white text-gray-800 text-lg font-sans font-medium py-3 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Book an Appointment"
              >
                Book Appointment
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:ring-offset-2 ${
              currentSlide === index
                ? 'bg-[#D20424] scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
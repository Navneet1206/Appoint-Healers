import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const slides = [
  {
    title: 'Your Mind Deserves Care',
    subtitle: 'Explore self-tests, book professionals & take a step toward better mental health.',
    image: '/api/placeholder/1920/500', // Using placeholder images
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  {
    title: 'Check in with Yourself',
    subtitle: 'Start with a free, private test and understand where you stand.',
    image: '/api/placeholder/1920/500',
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  {
    title: 'Book a Healing Session',
    subtitle: 'Talk to professionals and begin your healing journey.',
    image: '/api/placeholder/1920/500',
    primaryLink: '/mental-health-test',
    secondaryLink: '/book-appointment',
  },
  // Add more slides here easily by following the same structure
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const timerRef = useRef(null);
  const pauseTimerRef = useRef(null);

  const startAutoplay = () => {
    // Clear any existing interval first
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Only set new interval if slider is in playing mode
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setDirection(1);
      }, 5000); // 5 seconds interval
    }
  };

  // Called on component mount and when play/pause state changes
  useEffect(() => {
    // Clear any existing timers first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only start autoplay if in playing mode and not paused
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setDirection(1);
      }, 5000); // 5 seconds interval
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [isPlaying, isPaused]); // Re-run when these states change

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    resetTimer();
  };

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    resetTimer();
  };

  const resetTimer = () => {
    // User is interacting, set flag
    setIsUserInteracting(true);
    
    // Reset the autoplay timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Set temporary pause for 5 seconds after manual interaction
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      setIsUserInteracting(false);
    }, 5000);
    
    // Restart autoplay (it will only actually start when pause is lifted)
    startAutoplay();
  };

  const togglePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (newPlayingState) {
      // If turning on autoplay, start immediately
      startAutoplay();
    } else {
      // If pausing, clear the interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Reset user interaction pause when toggling play state
    setIsPaused(false);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  // Smooth slide animations based on direction
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
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
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].image}
              alt={`Background for ${slides[currentSlide].title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
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

      {/* Navigation Controls */}
      <div className="absolute z-20 top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between pointer-events-none">
        <button
          onClick={handlePrevSlide}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-3 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={handleNextSlide}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-3 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-10">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 mr-4"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        {/* Dot Indicators */}
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:ring-offset-2 ${
                currentSlide === index
                  ? "bg-[#D20424] scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
        {/* Slide Counter & Status */}
        <div className="ml-4 bg-black/30 px-3 py-1 rounded-full text-white text-sm flex items-center">
          <span>{currentSlide + 1} / {slides.length}</span>
          {isPaused && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Paused</span>}
          {isUserInteracting && <span className="ml-2 text-xs bg-[#D20424]/60 px-2 py-0.5 rounded-full">Extended View</span>}
        </div>
      </div>
    </section>
  );
};

export default Hero;
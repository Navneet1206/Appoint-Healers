import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Hero = () => {
  // Slide data
  const slides = [
    {
      image: 'https://picsum.photos/1920/1080?random=1',
      title: 'Healing Starts with Listening',
      subtitle: 'Empower your mental health journey with compassionate professionals.',
      primaryCta: { label: 'Explore Services', href: '/professional', color: 'rose' },
      secondaryCta: { label: 'Give a Test', href: '/test', color: 'purple' },
    },
    {
      image: 'https://picsum.photos/1920/1080?random=2',
      title: 'You Are Not Alone',
      subtitle: 'Connect with a listener who truly understands.',
      primaryCta: { label: 'Find a Listener', href: '/listeners', color: 'rose' },
      secondaryCta: { label: 'Learn More', href: '/about', color: 'purple' },
    },
    {
      image: 'https://picsum.photos/1920/1080?random=3',
      title: 'Strengthen Relationships',
      subtitle: 'Therapy for families, couples & individuals.',
      primaryCta: { label: 'Book Now', href: '/booking', color: 'rose' },
      secondaryCta: { label: 'View Plans', href: '/plans', color: 'purple' },
    },
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    appendDots: dots => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-30 px-4 py-2 rounded-full">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => <div className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100 transition" />,
  };

  return (
    <section className="relative w-full h-screen overflow-hidden mt-16">
      <Slider {...sliderSettings}>
        {slides.map((slide, idx) => (
          <div key={idx} className="relative w-full h-screen">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-100 max-w-2xl"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 mt-6"
              >
                <a
                  href={slide.primaryCta.href}
                  className={`bg-${slide.primaryCta.color}-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-${slide.primaryCta.color}-700 transition`}
                >
                  {slide.primaryCta.label}
                </a>
                <a
                  href={slide.secondaryCta.href}
                  className={`bg-transparent border-2 border-white text-white px-6 py-3 rounded-full text-base font-medium hover:bg-white hover:text-black transition flex items-center justify-center`}
                >
                  {slide.secondaryCta.label}
                  <ChevronRightIcon size={16} className="ml-2" />
                </a>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
      {/* Decorative Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 text-white"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L40,202.7C80,181,160,139,240,122.7C320,107,400,117,480,122.7C560,128,640,128,720,101.3C800,75,880,21,960,21.3C1040,21,1120,75,1200,117.3C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </svg>
    </section>
  );
};

export default Hero;

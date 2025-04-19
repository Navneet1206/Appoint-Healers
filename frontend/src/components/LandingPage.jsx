import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { Heart, Users, Headphones } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function LandingPage() {
  const slides = [
    {
      image: 'https://picsum.photos/800/600?random=1',
      title: 'Healing Starts with Listening',
      subtitle: 'Empower your mental health journey with compassionate professionals.',
    },
    {
      image: 'https://picsum.photos/800/600?random=2',
      title: 'You Are Not Alone',
      subtitle: 'Connect with a listener who truly understands.',
    },
    {
      image: 'https://picsum.photos/800/600?random=3',
      title: 'Strengthen Relationships',
      subtitle: 'Therapy for families, couples & individuals.',
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '80px',
    appendDots: dots => (
      <div className="absolute bottom-4 w-full flex justify-center">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition" />
    ),
    responsive: [
      { breakpoint: 1024, settings: { centerPadding: '60px' } },
      { breakpoint: 768, settings: { centerMode: false, centerPadding: '0px' } }
    ]
  };

  const cardHover = { scale: 1.03 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-100 to-pink-50 text-gray-800">
      {/* Hero Slider */}
      <section className="mt-24 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg h-[70vh]">
          <Slider {...sliderSettings}>
            {slides.map((slide, i) => (
              <div key={i} className="relative h-[70vh]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm md:text-lg text-gray-200 max-w-2xl drop-shadow"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <motion.a
                      href="#services"
                      whileHover={{ scale: 1.1 }}
                      className="inline-block bg-rose-600 text-white px-6 py-3 rounded-full text-base shadow-lg hover:bg-rose-700 transition"
                    >
                      Explore Services
                    </motion.a>
                    <motion.a
                      href="/test"
                      whileHover={{ scale: 1.1 }}
                      className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-base shadow-lg hover:bg-purple-700 transition"
                    >
                      Give Test
                    </motion.a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-rose-700 mb-12"
          >
            Our Support Areas
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Counseling Professional',
                icon: <Users size={48} />,
                description:
                  'Guidance from licensed experts to navigate mental health challenges with empathy.',
              },
              {
                title: 'Relational Therapist',
                icon: <Heart size={48} />,
                description:
                  'Strengthen relationships with tailored therapy for individuals, couples, and families.',
              },
              {
                title: 'Listener',
                icon: <Headphones size={48} />,
                description:
                  'A compassionate ear when you need to talk — no judgment, just support.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                whileHover={cardHover}
                className="bg-rose-50 p-6 rounded-2xl shadow-lg border border-rose-100 flex flex-col items-center text-center"
              >
                <div className="text-rose-600 mb-3">{item.icon}</div>
                <h4 className="text-xl md:text-2xl font-semibold text-rose-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-purple-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-rose-700 mb-10"
          >
            What Our Users Say
          </motion.h3>
          <div className="space-y-8">
            {[
              {
                name: 'Aanya',
                feedback:
                  'Connecting with MindConnect changed my life. The listener sessions are a blessing!',
              },
              {
                name: 'Rahul',
                feedback:
                  'The counseling professionals are so understanding and effective. Highly recommend.',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 * i }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <p className="italic text-gray-800 mb-4">“{t.feedback}”</p>
                <p className="font-semibold text-rose-700">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h3
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-rose-700 mb-6"
          >
            Ready to Begin?
          </motion.h3>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-gray-600 text-lg"
          >
            Give the first step toward a healthier mind. Book your session now.
          </motion.p>
          <motion.a
            href="/professional"
            whileHover={{ scale: 1.05 }}
            className="bg-purple-600 text-white px-10 py-4 rounded-full shadow-lg hover:bg-purple-700 transition text-lg"
          >
            Book an Appointment
          </motion.a>
        </div>
      </section>

     
    </div>
  );
}

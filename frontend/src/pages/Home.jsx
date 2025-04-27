import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TherapistSection from '../components/Landing/TherapistSection';
import Hero from '../components/Landing/Hero';

export default function Home() {
  const services = [
    {
      title: 'Couples Therapy',
      description:
        'Break free from anxiety, stress, and self-doubt with personalized guidance that helps you rebuild confidence and embrace your best self.',
      imageUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=600&h=400&q=80',
    },
    {
      title: 'Individual Therapy',
      description:
        'Restore trust, deepen communication, and reignite your connection with tailored sessions designed to strengthen your well-being.',
      imageUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?fit=crop&w=600&h=400&q=80',
    },
    {
      title: 'Grief Counselling',
      description:
        'Navigate the pain of loss with compassionate support that guides you toward healing, renewal, and hope at your own pace.',
      imageUrl:
        'https://images.unsplash.com/photo-1488376739371-2873ab4f686d?fit=crop&w=600&h=400&q=80',
    },
    {
      title: 'Work-Life Balance Coaching',
      description:
        'Regain control and harmony in your life with strategies that empower you to thrive at work and at home. Have more energy after work!',
      imageUrl:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fit=crop&w=600&h=400&q=80',
    },
  ];


  return (


    <>
      <Hero />
      <TherapistSection />
      {/* CTA Section */}
      <section id="cta" className="py-32 bg-white px-6">
      <div className="max-w-3xl mx-auto text-center mt-72 md:mt-0 sm:mt-0">
          <h3
            className="text-4xl md:text-5xl font-bold text-rose-600 mb-8"
          >
            Ready to Begin Your Journey?
          </h3>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Take the first step toward a healthier mind. Book your session now and start healing today.
          </motion.p>
          <motion.a
            href="/professional"
            whileHover={{ scale: 1.05 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-rose-600 text-white px-12 py-5 rounded-full shadow-lg hover:bg-rose-700 transition text-lg md:text-xl"
          >
            Book an Appointment
          </motion.a>
        </div>
      </section>




      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <span className="inline-block bg-rose-100 text-rose-600 rounded-full px-3 py-1 text-sm font-semibold mb-4 md:mb-0">
              My Services
            </span>
            <h2 className="text-3xl font-bold text-gray-800 flex-1 md:mx-6">
              How I Can Help You Thrive
            </h2>
            <button className="mt-4 md:mt-0 inline-flex items-center bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg shadow">
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Book A Session
            </button>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
              >
                <img
                  src={svc.imageUrl}
                  alt={svc.title}
                  className="w-full h-48 md:w-40 md:h-auto object-cover"
                />
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-gray-700 flex-1">{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-gray-50 overflow-hidden">
      {/* Side panels */}
      <div
        className="hidden md:block absolute top-0 left-0 h-full w-1/3 bg-[url('https://images.unsplash.com/photo-1593642532973-d31b6557fa68?fit=crop&w=800&q=80')] bg-cover bg-center rounded-tr-[2rem] rounded-br-[2rem] opacity-30"
      />
      <div
        className="hidden md:block absolute top-0 right-0 h-full w-1/3 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?fit=crop&w=800&q=80')] bg-cover bg-center rounded-tl-[2rem] rounded-bl-[2rem] opacity-30"
      />

      <div className="relative max-w-3xl mx-auto px-4 py-20 sm:py-32">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl text-center">
          <span className="inline-block bg-rose-100 text-rose-600 uppercase text-xs font-semibold tracking-wide py-1 px-3 rounded-full mb-4">
            Your New Beginning
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Take the First Step Toward the Life You Deserve
          </h1>

          <p className="text-gray-700 text-base sm:text-lg mb-8">
            Over 300 individuals have reclaimed their confidence, rebuilt
            relationships, and found emotional peace. You can, too.
          </p>

          <button className="inline-flex items-center bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full px-6 py-3 shadow">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Book A Session
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
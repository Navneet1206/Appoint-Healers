import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { Heart, Users, Headphones, Phone, Mail, MapPin, Calendar, Award, Book, Star, Globe } from 'lucide-react';
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

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  const cardHover = {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"
  };

  const testimonials = [
    { name: 'Aanya', feedback: 'Connecting with MindConnect changed my life. The listener sessions are a blessing!' },
    { name: 'Rahul', feedback: 'The counseling professionals are so understanding and effective. Highly recommend.' },
    { name: 'Priya', feedback: 'The relational therapy helped me rebuild my family connections. Amazing service!' },
    { name: 'Vikram', feedback: 'A safe space to talk and heal. I’m grateful for this platform.' },
  ];

  const faqs = [
    { question: 'How do I book an appointment?', answer: 'Click the "Book an Appointment" button and follow the prompts.' },
    { question: 'What professionals are available?', answer: 'We offer Counseling Professionals, Relational Therapists, and Listeners.' },
    { question: 'Is my information confidential?', answer: 'Yes, privacy is our priority, and all information is secure.' },
    { question: 'How long are the sessions?', answer: 'Sessions typically last 45-60 minutes, depending on your needs.' },
    { question: 'Can I cancel my appointment?', answer: 'Yes, cancellations are allowed up to 24 hours before the session.' },
  ];

  const teamMembers = [
    { name: 'Dr. Jane Smith', role: 'Lead Counselor', image: 'https://picsum.photos/200?random=1' },
    { name: 'John Doe', role: 'Relational Therapist', image: 'https://picsum.photos/200?random=2' },
    { name: 'Emily Johnson', role: 'Listener Coordinator', image: 'https://picsum.photos/200?random=3' },
    { name: 'Dr. Michael Lee', role: 'Senior Psychologist', image: 'https://picsum.photos/200?random=4' },
  ];

  const events = [
    { title: 'Mindfulness Workshop', date: 'Nov 15, 2023', description: 'Join us for a day of mindfulness and relaxation techniques.' },
    { title: 'Relationship Seminar', date: 'Dec 5, 2023', description: 'Learn strategies to strengthen your relationships.' },
    { title: 'Stress Management Webinar', date: 'Jan 10, 2024', description: 'Practical tips to manage daily stress effectively.' },
  ];

  const resources = [
    { title: 'Guide to Mental Wellness', description: 'A comprehensive guide to understanding mental health.', link: '#' },
    { title: 'Coping with Anxiety', description: 'Techniques to manage anxiety in daily life.', link: '#' },
    { title: 'Meditation Basics', description: 'Start your meditation journey with this beginner’s guide.', link: '#' },
    { title: 'Healthy Boundaries', description: 'Learn to set boundaries for better relationships.', link: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-100 to-pink-50 text-gray-800">
      {/* Hero Section */}
      <section className="mt-24 px-4 relative h-[80vh]">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg h-full">
          <Slider {...sliderSettings}>
            {slides.map((slide, i) => (
              <div key={i} className="relative h-[80vh]">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <motion.a
                      href="/professional"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-rose-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:bg-rose-700 transition"
                    >
                      Explore Services
                    </motion.a>
                    <motion.a
                      href="/test"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:bg-purple-700 transition"
                    >
                      Give a Test
                    </motion.a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <svg className="absolute bottom-0 left-0 w-full h-32 text-white" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-8"
          >
            About MindConnect
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          >
            At MindConnect, we’re dedicated to fostering mental wellness through empathy, understanding, and professional support. Our platform connects you with licensed experts and compassionate listeners to guide you through life’s challenges. We believe everyone deserves a safe space to heal and grow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-rose-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-rose-800 mb-2">Our Mission</h4>
              <p className="text-gray-700">To empower individuals with accessible mental health resources.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-rose-800 mb-2">Our Vision</h4>
              <p className="text-gray-700">A world where mental wellness is a priority for all.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-rose-800 mb-2">Our Values</h4>
              <p className="text-gray-700">Compassion, integrity, and inclusivity guide everything we do.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Our Support Areas
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Counseling Professional', icon: <Users size={56} />, description: 'Guidance from licensed experts to navigate mental health challenges with empathy and expertise.' },
              { title: 'Relational Therapist', icon: <Heart size={56} />, description: 'Strengthen relationships with tailored therapy for individuals, couples, and families.' },
              { title: 'Listener', icon: <Headphones size={56} />, description: 'A compassionate ear when you need to talk — no judgment, just support.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                whileHover={cardHover}
                className="group bg-white p-8 rounded-2xl shadow-lg border border-rose-100 flex flex-col items-center text-center"
              >
                <div className="text-rose-600 mb-4 group-hover:text-rose-800 transition-colors">{item.icon}</div>
                <h4 className="text-2xl font-semibold text-rose-800 mb-3">{item.title}</h4>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                <a href="#" className="mt-4 text-rose-600 hover:text-rose-800 transition">Learn More</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            How It Works
          </motion.h3>
          <div className="space-y-12">
            {[
              { step: '1. Choose Your Service', description: 'Browse our range of services and select the professional that best fits your needs.' },
              { step: '2. Book an Appointment', description: 'Schedule a session at a time that works for you using our simple booking system.' },
              { step: '3. Connect and Heal', description: 'Meet your chosen professional via video, chat, or call and begin your wellness journey.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-gray-100 p-8 rounded-xl shadow-md flex items-center justify-between"
              >
                <div className="text-left">
                  <h4 className="text-2xl font-semibold text-rose-800 mb-3">{item.step}</h4>
                  <p className="text-gray-700 text-lg">{item.description}</p>
                </div>
                <div className="text-rose-600 text-6xl font-bold opacity-20">{idx + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-purple-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            What Our Users Say
          </motion.h3>
          <Slider {...testimonialSettings}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 * i }}
                className="bg-white p-8 rounded-xl shadow-md mx-4"
              >
                <Star className="text-yellow-400 mb-3 mx-auto" size={32} />
                <p className="italic text-gray-800 mb-4 text-lg">“{t.feedback}”</p>
                <p className="font-semibold text-rose-700">{t.name}</p>
              </motion.div>
            ))}
          </Slider>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Frequently Asked Questions
          </motion.h3>
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-gray-100 p-8 rounded-xl shadow-md"
              >
                <h4 className="text-2xl font-semibold text-rose-800 mb-3">{faq.question}</h4>
                <p className="text-gray-700 text-lg">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Articles Section */}
      <section id="blog" className="py-32 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Recent Articles
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Understanding Anxiety', excerpt: 'Learn about the common signs of anxiety and how to manage it effectively.', image: 'https://picsum.photos/400/300?random=4' },
              { title: 'Building Healthy Relationships', excerpt: 'Tips and strategies for fostering strong and supportive relationships.', image: 'https://picsum.photos/400/300?random=5' },
              { title: 'The Power of Listening', excerpt: 'Discover how active listening can improve your mental health.', image: 'https://picsum.photos/400/300?random=6' },
              { title: 'Mindfulness Matters', excerpt: 'Explore the benefits of mindfulness for mental clarity.', image: 'https://picsum.photos/400/300?random=7' },
            ].map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                whileHover={cardHover}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <img src={article.image} alt={article.title} className="w-full h-56 object-cover rounded-t-2xl" />
                <h4 className="text-2xl font-semibold text-rose-800 mt-4 mb-2">{article.title}</h4>
                <p className="text-gray-700 text-lg">{article.excerpt}</p>
                <a href="#" className="text-rose-600 hover:text-rose-800 mt-4 inline-block">Read More</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Meet Our Team
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-gray-100 p-6 rounded-2xl shadow-lg"
              >
                <img src={member.image} alt={member.name} className="w-40 h-40 rounded-full mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-rose-800">{member.name}</h4>
                <p className="text-gray-700">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-32 bg-purple-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Upcoming Events
          </motion.h3>
          <div className="space-y-10">
            {events.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-white p-8 rounded-xl shadow-md flex items-center justify-between"
              >
                <div className="text-left">
                  <h4 className="text-2xl font-semibold text-rose-800 mb-2">{event.title}</h4>
                  <p className="text-gray-700 text-lg">{event.description}</p>
                  <p className="text-rose-600 mt-2 flex items-center"><Calendar size={20} className="mr-2" /> {event.date}</p>
                </div>
                <a href="#" className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition">Register</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-32 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Free Resources
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {resources.map((resource, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-white p-8 rounded-xl shadow-md flex items-center justify-between"
              >
                <div className="text-left">
                  <h4 className="text-2xl font-semibold text-rose-800 mb-2">{resource.title}</h4>
                  <p className="text-gray-700 text-lg">{resource.description}</p>
                </div>
                <a href={resource.link} className="text-rose-600 hover:text-rose-800 flex items-center"><Book size={24} className="mr-2" /> Download</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-12"
          >
            Our Achievements
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: '10,000+ Sessions', description: 'Helped thousands of users with professional support.', icon: <Users size={56} /> },
              { title: 'Award-Winning Platform', description: 'Recognized for excellence in mental health services.', icon: <Award size={56} /> },
              { title: 'Global Reach', description: 'Supporting users in over 50 countries worldwide.', icon: <Globe size={56} /> },
            ].map((achievement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
                className="bg-rose-50 p-8 rounded-xl shadow-md"
              >
                <div className="text-rose-600 mb-4">{achievement.icon}</div>
                <h4 className="text-2xl font-semibold text-rose-800 mb-2">{achievement.title}</h4>
                <p className="text-gray-700 text-lg">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section id="cta" className="py-32 bg-white px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h3
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-rose-700 mb-8"
          >
            Ready to Begin Your Journey?
          </motion.h3>
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
            className="bg-purple-600 text-white px-12 py-5 rounded-full shadow-lg hover:bg-purple-700 transition text-lg md:text-xl"
          >
            Book an Appointment
          </motion.a>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Shield, Clock, CreditCard, Award, Star, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Health Journey Starts Here
              </h1>
              <p className="text-xl mb-8">
                Book appointments with top healthcare professionals easily and securely.
                SAVAYAS HEALS connects you with the right specialists for your needs.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-teal-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/professionals"
                  className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium text-lg hover:bg-teal-700 transition duration-300 text-center"
                >
                  Browse Professionals
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare professionals"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SAVAYAS HEALS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a seamless experience for booking appointments with healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book appointments with just a few clicks. Our intuitive interface makes scheduling simple and hassle-free.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
              <p className="text-gray-600">
                All healthcare providers on our platform are thoroughly vetted and verified for your safety and peace of mind.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-gray-600">
                Your data and privacy are our top priorities. We use advanced security measures to protect your information.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-gray-600">
                Book appointments anytime, anywhere. Our platform is available 24/7 for your convenience.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Pay for your appointments securely through our integrated payment gateway with multiple payment options.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Care</h3>
              <p className="text-gray-600">
                We partner with top healthcare professionals to ensure you receive the highest quality care for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the range of healthcare and wellness services available through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Therapy Sessions" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Therapy Sessions</h3>
              <p className="text-gray-600 mb-4">
                Connect with licensed therapists for individual, couples, or family therapy sessions to address mental health concerns.
              </p>
              <Link to="/services/therapy" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Counseling" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Counseling</h3>
              <p className="text-gray-600 mb-4">
                Get guidance and support from professional counselors for personal, career, or educational challenges.
              </p>
              <Link to="/services/counseling" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80" 
                alt="Wellness Programs" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Wellness Programs</h3>
              <p className="text-gray-600 mb-4">
                Join structured programs designed to improve your overall well-being, including stress management and healthy lifestyle choices.
              </p>
              <Link to="/services/wellness" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Life Coaching" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Life Coaching</h3>
              <p className="text-gray-600 mb-4">
                Work with certified life coaches to set and achieve personal and professional goals, overcome obstacles, and create positive change.
              </p>
              <Link to="/services/coaching" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Meditation Classes" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Meditation Classes</h3>
              <p className="text-gray-600 mb-4">
                Learn meditation techniques from experienced instructors to reduce stress, improve focus, and enhance mental clarity.
              </p>
              <Link to="/services/meditation" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Yoga Sessions" 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Yoga Sessions</h3>
              <p className="text-gray-600 mb-4">
                Practice yoga with certified instructors to improve flexibility, strength, and mental well-being through guided sessions.
              </p>
              <Link to="/services/yoga" className="text-teal-600 font-medium flex items-center hover:text-teal-700">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Healing Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied users who Join thousands of satisfied users who have found the right healthcare professionals through SAVAYAS HEALS.
          </p>
          <Link
            to="/register"
            className="bg-white text-teal-600 px-8 py-4 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who have transformed their lives with SAVAYAS HEALS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <span className="text-teal-600 font-bold text-xl">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500">Yoga Enthusiast</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-600">
                "SAVAYAS HEALS made it incredibly easy to find and book sessions with a meditation coach. The verification process gave me confidence in my choice, and the booking experience was seamless."
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <span className="text-teal-600 font-bold text-xl">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500">Business Professional</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5" />
              </div>
              <p className="text-gray-600">
                "As someone with a busy schedule, I appreciate how easy it is to book appointments around my availability. The reminders and secure payment system make the whole process stress-free."
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <span className="text-teal-600 font-bold text-xl">A</span>
                </div>
                <div>
                  <h4 className="font-semibold">Aisha Patel</h4>
                  <p className="text-gray-500">Wellness Coach</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-600">
                "As a professional on the platform, I love how SAVAYAS HEALS has streamlined my booking process. It's helped me grow my practice and connect with clients who truly benefit from my services."
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/testimonials" className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700">
              Read More Testimonials <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet some of our highly-rated healthcare professionals ready to support your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Dr. Emily Chen" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">Dr. Emily Chen</h3>
                <p className="text-teal-600 mb-2">Clinical Psychologist</p>
                <div className="flex text-yellow-400 mb-3">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-gray-600 text-sm ml-1">5.0</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Specializing in anxiety, depression, and trauma recovery with 10+ years of experience.
                </p>
                <Link 
                  to="/professionals/emily-chen" 
                  className="block text-center bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
                alt="Mark Johnson" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">Mark Johnson</h3>
                <p className="text-teal-600 mb-2">Life Coach</p>
                <div className="flex text-yellow-400 mb-3">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <span className="text-gray-600 text-sm ml-1">4.8</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Helping clients achieve personal and professional goals through actionable strategies.
                </p>
                <Link 
                  to="/professionals/mark-johnson" 
                  className="block text-center bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Dr. Sarah Patel" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">Dr. Sarah Patel</h3>
                <p className="text-teal-600 mb-2">Meditation Instructor</p>
                <div className="flex text-yellow-400 mb-3">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-gray-600 text-sm ml-1">4.9</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Certified meditation teacher with expertise in mindfulness and stress reduction techniques.
                </p>
                <Link 
                  to="/professionals/sarah-patel" 
                  className="block text-center bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80" 
                alt="David Kim" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">David Kim</h3>
                <p className="text-teal-600 mb-2">Yoga Instructor</p>
                <div className="flex text-yellow-400 mb-3">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 half-filled" />
                  <span className="text-gray-600 text-sm ml-1">4.7</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Experienced yoga teacher specializing in Hatha and Vinyasa styles for all experience levels.
                </p>
                <Link 
                  to="/professionals/david-kim" 
                  className="block text-center bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/professionals" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              Browse All Professionals
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-600 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto">
                Subscribe to our newsletter for wellness tips, new professional introductions, and exclusive offers.
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-teal-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-teal-100 text-sm mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
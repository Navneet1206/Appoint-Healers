import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setNewsletterSent(true);
      setEmail('');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-screen-xl mx-auto py-16 px-4 sm:px-6 md:px-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="bg-rose-600 inline-block px-3 py-1 rounded-md transform -rotate-2">
              <h2 className="text-2xl font-bold tracking-tight">SAVAYS HEALS</h2>
            </div>
            <p className="text-sm text-gray-300 font-medium">
              Find Your Perfect Mental Health Professional
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connect with psychiatrists, relationship counselors, and active listeners who can help you navigate life's challenges.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold relative">
              <span className="bg-rose-600 h-1 w-6 absolute -bottom-2 left-0"></span>
              Navigation
            </h3>
            <div className="flex flex-col space-y-4">
              <button 
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                onClick={() => navigateTo('/')}
              >
                <span className="bg-rose-600 h-1 w-0 group-hover:w-4 transition-all duration-300 mr-2"></span>
                HOME
              </button>
              <button 
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                onClick={() => navigateTo('/professionals')}
              >
                <span className="bg-rose-600 h-1 w-0 group-hover:w-4 transition-all duration-300 mr-2"></span>
                ALL PROFESSIONALS
              </button>
              <button 
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                onClick={() => navigateTo('/about')}
              >
                <span className="bg-rose-600 h-1 w-0 group-hover:w-4 transition-all duration-300 mr-2"></span>
                ABOUT
              </button>
              <button 
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                onClick={() => navigateTo('/contact')}
              >
                <span className="bg-rose-600 h-1 w-0 group-hover:w-4 transition-all duration-300 mr-2"></span>
                CONTACT
              </button>
            
            </div>
          </div>

          

          {/* Support Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold relative">
                <span className="bg-rose-600 h-1 w-6 absolute -bottom-2 left-0"></span>
                Mental Health Support
              </h3>
              <div className="mt-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg border-l-4 border-rose-500">
                <p className="text-sm text-gray-300">
                  <span className="text-rose-400 font-bold">1,000+</span> people found their match this month
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold relative">
                <span className="bg-rose-600 h-1 w-6 absolute -bottom-2 left-0"></span>
                Stay Updated
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Subscribe to receive our newsletter and updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mt-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full p-3 pl-4 pr-12 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bg-rose-600 hover:bg-rose-700 p-2 rounded-md text-white text-sm transition-colors duration-300"
                    aria-label="Subscribe"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
                {newsletterSent && (
                  <p className="mt-2 text-green-400 text-xs flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Thanks for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p className="flex items-center">
              <span>Copyright {new Date().getFullYear()} © </span>
              <span className="text-rose-400 mx-1">savayasheal.com</span>
              <span>- All Rights Reserved.</span>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <button
                className="hover:text-rose-400 transition-colors duration-200"
                onClick={() => navigateTo('/terms')}
              >
                Terms of Service
              </button>
              <span className="text-gray-700">|</span>
              <button
                className="hover:text-rose-400 transition-colors duration-200"
                onClick={() => navigateTo('/sitemap')}
              >
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
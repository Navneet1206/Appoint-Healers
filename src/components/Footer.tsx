import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 mr-2 text-teal-400" />
              <span className="font-bold text-xl">SAVAYAS HEALS</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted platform for booking appointments with healthcare professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-teal-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/professionals" className="text-gray-300 hover:text-teal-400 transition-colors">Our Professionals</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-teal-400 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-teal-400 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/therapy" className="text-gray-300 hover:text-teal-400 transition-colors">Therapy Sessions</Link>
              </li>
              <li>
                <Link to="/services/counseling" className="text-gray-300 hover:text-teal-400 transition-colors">Counseling</Link>
              </li>
              <li>
                <Link to="/services/wellness" className="text-gray-300 hover:text-teal-400 transition-colors">Wellness Programs</Link>
              </li>
              <li>
                <Link to="/services/coaching" className="text-gray-300 hover:text-teal-400 transition-colors">Life Coaching</Link>
              </li>
              <li>
                <Link to="/services/meditation" className="text-gray-300 hover:text-teal-400 transition-colors">Meditation Classes</Link>
              </li>
              <li>
                <Link to="/services/yoga" className="text-gray-300 hover:text-teal-400 transition-colors">Yoga Sessions</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-teal-400" />
                <span>123 Healing Street, Wellness City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-teal-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-teal-400" />
                <span>contact@savayasheals.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-400 w-full"
                />
                <button className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-teal-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Popup Component (Copied from Login)
const CustomPopup = ({ isOpen, onClose, type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-12 h-12 text-blue-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 ${getBgColor()}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openNested, setOpenNested] = useState({});
  const [popup, setPopup] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: ''
  });
  const { token, logout } = useContext(AppContext);

  const toggleNested = (key) =>
    setOpenNested((prev) => ({ ...prev, [key]: !prev[key] }));

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: '', title: '', message: '' });
  };

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    showPopup('success', 'Logged Out', 'You have been successfully logged out.');
  };

  return (
    <>
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />

      {/* top bar */}
      <nav className="fixed top-0 left-0 w-full z-30 bg-white shadow-md font-sans">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl font-bold text-rose-600 ${isActive ? '' : ''}`
            }
          >
            SavayasHeal
          </NavLink>

          {/* desktop menu (visible on lg and up) */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* About Us */}
            <div className="relative group">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                About Us{' '}
                <ChevronDownIcon
                  size={12}
                  className="ml-1 transition-transform duration-200 group-hover:rotate-180"
                />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 scale-95 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                <NavLink
                  to="/about#about-savayas"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  About Savayas
                </NavLink>
                <NavLink
                  to="/about#media"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Media
                </NavLink>
                <NavLink
                  to="/about#contact"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/about#work-with-us"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Work With Us
                </NavLink>
                <NavLink
                  to="/about#team"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Team
                </NavLink>
              </div>
            </div>

            {/* Services */}
            <div className="relative group">
              <NavLink
                to="/professional"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Services{' '}
                <ChevronDownIcon
                  size={12}
                  className="ml-1 transition-transform duration-200 group-hover:rotate-180"
                />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 scale-95 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                <NavLink
                  to="/professional/Psychiatrist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Psychiatrist
                </NavLink>
                <NavLink
                  to="/professional/Therapist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Therapy
                </NavLink>
                <NavLink
                  to="/professional/Sexologist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Sexologist
                </NavLink>
                <NavLink
                  to="/professional/Child Psychologist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Child Psychology
                </NavLink>
                <NavLink
                  to="/professional/Relationship Counselor"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Relationship Counselor
                </NavLink>
                <NavLink
                  to="/professional/Active Listener"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Active Listener
                </NavLink>
              </div>
            </div>

            {/* Events */}
            <div className="relative group">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Events{' '}
                <ChevronDownIcon
                  size={12}
                  className="ml-1 transition-transform duration-200 group-hover:rotate-180"
                />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 scale-95 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                <NavLink
                  to="/events#ongoing-upcoming"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Ongoing/Upcoming
                </NavLink>
                <NavLink
                  to="/events#glimps"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Glimps
                </NavLink>
                <NavLink
                  to="/events#details"
                  className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                >
                  Details
                </NavLink>
              </div>
            </div>

            {/* Contact Us */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-medium hover:text-rose-600 font-sans ${
                  isActive ? 'text-rose-600' : 'text-black'
                }`
              }
            >
              Contact Us
            </NavLink>

            {/* Profile/Login */}
            <div className="flex items-center">
              {token ? (
                <div className="relative group">
                  <button
                    className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
                  >
                    <UserIcon size={16} />
                  </button>
                  <div className="absolute top-full right-0 w-48 bg-white shadow-md opacity-0 scale-95 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                    <NavLink
                      to="/my-profile"
                      className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-appointments"
                      className="block px-4 py-2 text-sm hover:bg-rose-50 font-sans"
                    >
                      My Appointments
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-rose-50 text-rose-600 font-sans"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700 font-sans"
                >
                  Log In
                </NavLink>
              )}
            </div>
          </div>

          {/* hamburger for mobile (visible below lg) */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileOpen(true)}
          >
            <MenuIcon className="w-6 h-6 text-rose-600 transition-transform duration-200 hover:scale-110" />
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
        {/* panel */}
        <div
          className={`relative ml-auto w-64 h-full bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out transform ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-end">
            <button onClick={() => setIsMobileOpen(false)}>
              <XIcon className="w-6 h-6 text-rose-600 transition-transform duration-200 hover:scale-110" />
            </button>
          </div>
          <div className="px-4 py-2 space-y-4">
            {/* About Us */}
            <button
              onClick={() => toggleNested('about')}
              className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600 font-sans"
            >
              About Us{' '}
              <ChevronDownIcon
                size={20}
                className={`transition-transform duration-200 ${openNested.about ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openNested.about ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pl-4 space-y-2">
                <NavLink
                  to="/about#about-savayas"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  About Savayas
                </NavLink>
                <NavLink
                  to="/about#media"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Media
                </NavLink>
                <NavLink
                  to="/about#contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/about#work-with-us"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Work With Us
                </NavLink>
                <NavLink
                  to="/about#team"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Team
                </NavLink>
              </div>
            </div>

            {/* Services */}
            <button
              onClick={() => toggleNested('services')}
              className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600 font-sans"
            >
              Services{' '}
              <ChevronDownIcon
                size={20}
                className={`transition-transform duration-200 ${openNested.services ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openNested.services ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pl-4 space-y-2">
                <NavLink
                  to="/professional/Psychiatrist"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Psychiatrist
                </NavLink>
                <NavLink
                  to="/professional/Therapist"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Therapy
                </NavLink>
                <NavLink
                  to="/professional/Sexologist"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Sexologist
                </NavLink>
                <NavLink
                  to="/professional/Child Psychologist"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Child Psychology
                </NavLink>
                <NavLink
                  to="/professional/Relationship Counselor"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Relationship Counselor
                </NavLink>
                <NavLink
                  to="/professional/Active Listener"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Active Listener
                </NavLink>
              </div>
            </div>

            {/* Events */}
            <button
              onClick={() => toggleNested('events')}
              className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600 font-sans"
            >
              Events{' '}
              <ChevronDownIcon
                size={20}
                className={`transition-transform duration-200 ${openNested.events ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openNested.events ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pl-4 space-y-2">
                <NavLink
                  to="/events#ongoing-upcoming"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Ongoing/Upcoming
                </NavLink>
                <NavLink
                  to="/events#glimps"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Glimps
                </NavLink>
                <NavLink
                  to="/events#details"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm hover:text-rose-600 font-sans"
                >
                  Details
                </NavLink>
              </div>
            </div>

            {/* Contact Us */}
            <NavLink
              to="/contact"
              className="block font-medium text-black hover:text-rose-600 font-sans"
              onClick={() => setIsMobileOpen(false)}
            >
              Contact Us
            </NavLink>

            {/* Profile/Login */}
            {token ? (
              <>
                <button
                  onClick={() => toggleNested('profile')}
                  className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600 font-sans"
                >
                  Profile{' '}
                  <ChevronDownIcon
                    size={20}
                    className={`transition-transform duration-200 ${openNested.profile ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openNested.profile ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="pl-4 space-y-2">
                    <NavLink
                      to="/my-profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="block text-sm hover:text-rose-600 font-sans"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-appointments"
                      onClick={() => setIsMobileOpen(false)}
                      className="block text-sm hover:text-rose-600 font-sans"
                    >
                      My Appointments
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block text-sm hover:text-rose-600 text-rose-600 font-sans"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <NavLink
                to="/login"
                className="block font-medium text-black hover:text-rose-600 font-sans"
                onClick={() => setIsMobileOpen(false)}
              >
                Log In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PhoneIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// WhatsApp SVG icon (simplified, using official brand color)
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-6 h-6 fill-[#25D366]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.26 4.87L2 22l5.13-1.26A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.79 15.21c-.45.67-1.32 1.05-2.18 1.05-.86 0-1.73-.35-2.36-.95-.86-.82-1.58-1.83-2.1-2.96-.52-1.13-.8-2.34-.8-3.54 0-1.22.29-2.39.81-3.44.45-.89 1.14-1.45 2.05-1.45.39 0 .77.09 1.12.26.35.17.65.42.88.74l.55 1.09c.18.36.22.78.1 1.17-.12.39-.39.69-.74.85l-.36.18c-.32.16-.58.44-.69.78.11.62.37 1.24.77 1.83.39.59.91 1.11 1.51 1.51.34.23.73.29 1.09.17l.37-.14c.39-.15.71-.44.85-.82.14-.38.09-.79-.13-1.13l-.55-1.09c-.23-.46-.59-.82-1.04-.99-.45-.17-.92-.22-1.38-.13l-.77.18c-.34.08-.69-.02-.95-.27-.26-.25-.37-.6-.29-.95l.14-.73c.08-.42.31-.79.65-.99.34-.2.73-.26 1.1-.17l.73.18c.74.18 1.36.63 1.75 1.27.39.64.56 1.39.48 2.14-.08.75-.34 1.47-.79 2.09z" />
  </svg>
);

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openNested, setOpenNested] = useState({});
  const { token, logout } = useContext(AppContext);

  const toggleNested = (key) =>
    setOpenNested((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* top bar */}
      <nav className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl font-bold text-rose-600 ${isActive ? '' : ''}`
            }
          >
            SAVAYAS
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
                ABOUT US <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/about#about-savayas"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  About Savayas
                </NavLink>
                <NavLink
                  to="/about#media"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Media
                </NavLink>
                <NavLink
                  to="/about#contact"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/about#work-with-us"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Work With Us
                </NavLink>
                <NavLink
                  to="/about#team"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
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
                Services <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/professional/Psychiatrist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Psychiatrist
                </NavLink>
                <NavLink
                  to="/professional/Therapist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Therapy
                </NavLink>
                <NavLink
                  to="/professional/Sexologist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Sexologist
                </NavLink>
                <NavLink
                  to="/professional/Child Psychologist"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Child Psychology
                </NavLink>
                <NavLink
                  to="/professional/Relationship Counselor"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Relationship Counselor
                </NavLink>
                <NavLink
                  to="/professional/Active Listener"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
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
                Events <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/events#ongoing-upcoming"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Ongoing/Upcoming
                </NavLink>
                <NavLink
                  to="/events#glimps"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Glimps
                </NavLink>
                <NavLink
                  to="/events#details"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Details
                </NavLink>
              </div>
            </div>

            {/* Contact Us */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-medium hover:text-rose-600 ${
                  isActive ? 'text-rose-600' : 'text-black'
                }`
              }
            >
              Contact Us
            </NavLink>

            {/* Icons and Login/Logout */}
            <div className="flex items-center space-x-4">
              <a
                href="tel:+1234567890"
                className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
              >
                <PhoneIcon size={16} />
              </a>
              <a
                href="https://wa.me/1234567890?text=Hello,%20I'm%20interested%20in%20Savayas%20services!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20b858]"
              >
                <WhatsAppIcon />
              </a>
              {token ? (
                <button
                  onClick={logout}
                  className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
                >
                  Log Out
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
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
            <MenuIcon className="w-6 h-6 text-rose-600" />
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* panel */}
          <div className="relative ml-auto w-64 h-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileOpen(false)}>
                <XIcon className="w-6 h-6 text-rose-600" />
              </button>
            </div>
            <div className="px-4 py-2 space-y-4">
              {/* About Us */}
              <button
                onClick={() => toggleNested('about')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                ABOUT US <ChevronDownIcon size={20} />
              </button>
              {openNested.about && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/about#about-savayas"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    About Savayas
                  </NavLink>
                  <NavLink
                    to="/about#media"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Media
                  </NavLink>
                  <NavLink
                    to="/about#contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/about#work-with-us"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Work With Us
                  </NavLink>
                  <NavLink
                    to="/about#team"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Team
                  </NavLink>
                </div>
              )}

              {/* Services */}
              <button
                onClick={() => toggleNested('services')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Services <ChevronDownIcon size={20} />
              </button>
              {openNested.services && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/professional/Psychiatrist"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Psychiatrist
                  </NavLink>
                  <NavLink
                    to="/professional/Therapist"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Therapy
                  </NavLink>
                  <NavLink
                    to="/professional/Sexologist"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Sexologist
                  </NavLink>
                  <NavLink
                    to="/professional/Child Psychologist"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Child Psychology
                  </NavLink>
                  <NavLink
                    to="/professional/Relationship Counselor"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Relationship Counselor
                  </NavLink>
                  <NavLink
                    to="/professional/Active Listener"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Active Listener
                  </NavLink>
                </div>
              )}

              {/* Events */}
              <button
                onClick={() => toggleNested('events')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Events <ChevronDownIcon size={20} />
              </button>
              {openNested.events && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/events#ongoing-upcoming"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Ongoing/Upcoming
                  </NavLink>
                  <NavLink
                    to="/events#glimps"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Glimps
                  </NavLink>
                  <NavLink
                    to="/events#details"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Details
                  </NavLink>
                </div>
              )}

              {/* Contact Us */}
              <NavLink
                to="/contact"
                className="block font-medium text-black hover:text-rose-600"
                onClick={() => setIsMobileOpen(false)}
              >
                Contact Us
              </NavLink>

              {/* Icons and Login/Logout */}
              <div className="mt-4 flex items-center space-x-4">
                <a
                  href="tel:+1234567890"
                  className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <PhoneIcon size={16} />
                </a>
                <a
                  href="https://wa.me/1234567890?text=Hello,%20I'm%20interested%20in%20Savayas%20services!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20b858]"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <WhatsAppIcon />
                </a>
                {token ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileOpen(false);
                    }}
                    className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
                  >
                    Log Out
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Log In
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
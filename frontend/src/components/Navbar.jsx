import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  PhoneIcon,
  MenuIcon,
  XIcon,
  UserIcon
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// WhatsApp SVG icon (official logo, using brand color)
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-6 h-6 fill-[#25D366]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.174.297-.298.397-.447.099-.149.099-.347-.002-.496-.099-.149-.445-.566-.682-.634-.237-.087-.512-.056-.69-.01-.177.044-.396.135-.574.356-.178.222-.623.652-.989.896-.367.243-.669.406-.669.548 0 .142.099.397.347.694.247.297.986 1.006 1.382 1.553.396.547.892 1.52 1.288 2.067.396.547.641.743.892.892.251.149.471.222.669.123.198-.099.842-.467 1.414-.694.572-.227 1.08-.148 1.255.099.173.247.494.742.692 1.038.198.297.198.645-.099.794-.297.149-.644.298-1.185.447zm-5.466 5.466c-2.468 0-4.916-.664-7.07-1.973l-.507 1.503-1.975-.698c-.686-2.154-1.05-4.602-1.05-7.07 0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12zm0-22C5.373 2 0 7.373 0 14c0 2.468.664 4.916 1.973 7.07L3 24l-2.973-.973C.664 18.916 0 16.468 0 14c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
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

            {/* Icons and Profile/Login */}
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
                <div className="relative group">
                  <button
                    className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
                  >
                    <UserIcon size={16} />
                  </button>
                  <div className="absolute top-full right-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <NavLink
                      to="/my-profile"
                      className="block px-4 py-2 text-sm hover:bg-rose-50"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-appointments"
                      className="block px-4 py-2 text-sm hover:bg-rose-50"
                    >
                      My Appointments
                    </NavLink>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-rose-50 text-rose-600"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
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

              {/* Profile/Login */}
              {token ? (
                <>
                  <button
                    onClick={() => toggleNested('profile')}
                    className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
                  >
                    Profile <ChevronDownIcon size={20} />
                  </button>
                  {openNested.profile && (
                    <div className="pl-4 space-y-2">
                      <NavLink
                        to="/my-profile"
                        onClick={() => setIsMobileOpen(false)}
                        className="block text-sm hover:text-rose-600"
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/my-appointments"
                        onClick={() => setIsMobileOpen(false)}
                        className="block text-sm hover:text-rose-600"
                      >
                        My Appointments
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileOpen(false);
                        }}
                        className="block text-sm hover:text-rose-600 text-rose-600"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="block font-medium text-black hover:text-rose-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Log In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
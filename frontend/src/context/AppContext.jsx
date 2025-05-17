import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PhoneIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

// Placeholder for auth state (replace with actual auth context/logic)
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Demo state
  const logout = () => {
    setIsAuthenticated(false); // Replace with actual logout logic (e.g., clear token)
    // Optionally redirect to home
    window.location.href = '/';
  };
  return { isAuthenticated, logout };
};

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openNested, setOpenNested] = useState({});
  const { isAuthenticated, logout } = useAuth(); // Use auth hook

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
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-quarters-auto transition-opacity duration-200">
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

            {/* Login/Logout */}
            <div className="flex items-center space-x-4">
              <NavLink
                to="/contact"
                className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
              >
                <PhoneIcon size={16} />
              </NavLink>
              {isAuthenticated ? (
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

              {/* Login/Logout */}
              <div className="mt-4 flex items-center space-x-4">
                <NavLink
                  to="/contact"
                  className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <PhoneIcon size={16} />
                </NavLink>
                {isAuthenticated ? (
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
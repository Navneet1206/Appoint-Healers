import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PhoneIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openNested, setOpenNested] = useState({});

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
            {/* About */}
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
                  to="/about"
                  end
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  About SAVAYAS
                </NavLink>
                <NavLink
                  to="/about"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Team
                </NavLink>
                <NavLink
                  to="/about/careers"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Careers
                </NavLink>
              </div>
            </div>

            {/* Services */}
            <div className="relative group">
              <NavLink
                to="/services"
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
                  to="/services/1"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Service 1
                </NavLink>
                <NavLink
                  to="/services/2"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Service 2
                </NavLink>
                <div className="relative group/nested">
                  <NavLink
                    to="/services/nested"
                    className="flex justify-between items-center block px-4 py-2 text-sm hover:bg-rose-50"
                  >
                    Nested Services <ChevronRightIcon size={12} />
                  </NavLink>
                  <div className="absolute left-full top-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover/nested:opacity-100 group-hover/nested:pointer-events-auto transition-opacity duration-200">
                    <NavLink
                      to="/services/nested/1"
                      className="block px-4 py-2 text-sm hover:bg-rose-50"
                    >
                      Nested 1
                    </NavLink>
                    <NavLink
                      to="/services/nested/2"
                      className="block px-4 py-2 text-sm hover:bg-rose-50"
                    >
                      Nested 2
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Experts */}
            <div className="relative group">
              <NavLink
                to="/experts"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Experts <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/experts/1"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Expert 1
                </NavLink>
                <NavLink
                  to="/experts/2"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Expert 2
                </NavLink>
              </div>
            </div>

            {/* Centres */}
            <div className="relative group">
              <NavLink
                to="/centres"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Centres <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/centres/c1"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Centre 1
                </NavLink>
                <NavLink
                  to="/centres/c2"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Centre 2
                </NavLink>
              </div>
            </div>

            {/* Partners */}
            <div className="relative group">
              <NavLink
                to="/partners"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Partners <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/partners/p1"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Partner 1
                </NavLink>
                <NavLink
                  to="/partners/p2"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Partner 2
                </NavLink>
              </div>
            </div>

            {/* Resources */}
            <div className="relative group">
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `flex items-center font-medium hover:text-rose-600 ${
                    isActive ? 'text-rose-600' : 'text-black'
                  }`
                }
              >
                Resources <ChevronDownIcon size={12} className="ml-1" />
              </NavLink>
              <div className="absolute top-full left-0 w-48 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <NavLink
                  to="/resources/r1"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Resource 1
                </NavLink>
                <NavLink
                  to="/resources/r2"
                  className="block px-4 py-2 text-sm hover:bg-rose-50"
                >
                  Resource 2
                </NavLink>
              </div>
            </div>

            {/* Contact & Login */}
            <div className="flex items-center space-x-4">
              <NavLink
                to="/contact"
                className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
              >
                <PhoneIcon size={16} />
              </NavLink>
              <NavLink
                to="/login"
                className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
              >
                Log In
              </NavLink>
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
              {/* About */}
              <button
                onClick={() => toggleNested('about')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                ABOUT US <ChevronDownIcon size={20} />
              </button>
              {openNested.about && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/about"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    About SAVAYAS
                  </NavLink>
                  <NavLink
                    to="/about"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Team
                  </NavLink>
                  <NavLink
                    to="/about/careers"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Careers
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
                    to="/services/1"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Service 1
                  </NavLink>
                  <NavLink
                    to="/services/2"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Service 2
                  </NavLink>
                  <button
                    onClick={() => toggleNested('servicesNested')}
                    className="w-full flex justify-between items-center text-sm text-black hover:text-rose-600"
                  >
                    Nested Services <ChevronRightIcon size={20} />
                  </button>
                  {openNested.servicesNested && (
                    <div className="pl-4 space-y-2">
                      <NavLink
                        to="/services/nested/1"
                        onClick={() => setIsMobileOpen(false)}
                        className="block text-sm hover:text-rose-600"
                      >
                        Nested 1
                      </NavLink>
                      <NavLink
                        to="/services/nested/2"
                        onClick={() => setIsMobileOpen(false)}
                        className="block text-sm hover:text-rose-600"
                      >
                        Nested 2
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {/* Experts */}
              <button
                onClick={() => toggleNested('experts')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Experts <ChevronDownIcon size={20} />
              </button>
              {openNested.experts && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/experts/1"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Expert 1
                  </NavLink>
                  <NavLink
                    to="/experts/2"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Expert 2
                  </NavLink>
                </div>
              )}

              {/* Centres */}
              <button
                onClick={() => toggleNested('centres')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Centres <ChevronDownIcon size={20} />
              </button>
              {openNested.centres && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/centres/c1"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Centre 1
                  </NavLink>
                  <NavLink
                    to="/centres/c2"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Centre 2
                  </NavLink>
                </div>
              )}

              {/* Partners */}
              <button
                onClick={() => toggleNested('partners')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Partners <ChevronDownIcon size={20} />
              </button>
              {openNested.partners && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/partners/p1"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Partner 1
                  </NavLink>
                  <NavLink
                    to="/partners/p2"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Partner 2
                  </NavLink>
                </div>
              )}

              {/* Resources */}
              <button
                onClick={() => toggleNested('resources')}
                className="w-full flex justify-between items-center font-medium text-black hover:text-rose-600"
              >
                Resources <ChevronDownIcon size={20} />
              </button>
              {openNested.resources && (
                <div className="pl-4 space-y-2">
                  <NavLink
                    to="/resources/r1"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Resource 1
                  </NavLink>
                  <NavLink
                    to="/resources/r2"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-sm hover:text-rose-600"
                  >
                    Resource 2
                  </NavLink>
                </div>
              )}

              {/* Contact & Login */}
              <div className="mt-4 flex items-center space-x-4">
                <NavLink
                  to="/contact"
                  className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <PhoneIcon size={16} />
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Log In
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
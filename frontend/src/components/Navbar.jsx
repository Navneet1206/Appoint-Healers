import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { User, LogIn, LogOut, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1284);

  const { token, setToken, userData } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1284);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/professional', label: 'BOOK NOW' },
    { path: '/join-professional', label: 'JOIN US' }, // Changed to JOIN US, removed icon
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      {/* Desktop Floating Navigation */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 
        ${scrolled ? 'w-11/12 xl:w-4/5 bg-white shadow-lg' : 'w-11/12 xl:w-10/12 bg-[#FEEFF4]'} 
        rounded-full py-3 px-6 flex items-center justify-between border border-[#FAD1E2] z-50`}
      >
        <h1
          onClick={() => navigate('/')}
          className="cursor-pointer text-xl xl:text-2xl font-bold text-[#9E1B5B] transition-all duration-300 hover:text-[#E64794]"
        >
          SAVAYS HEALS
        </h1>

        {/* Desktop Navigation Links */}
        <ul className="hidden xl:flex items-center gap-4 lg:gap-6 font-medium text-[#9E1B5B]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#FAD1E2] bg-opacity-50' : 'hover:bg-[#FAD1E2] hover:bg-opacity-30'
                }`
              }
            >
              <li>{item.label}</li>
            </NavLink>
          ))}
        </ul>

        {/* Desktop Auth/Profile Buttons */}
        <div className="hidden xl:flex items-center gap-4">
          {token && userData ? (
            <div
              className="relative group"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setTimeout(() => setDropdownVisible(false), 300)}
            >
              <div
                className="flex items-center gap-2 cursor-pointer bg-[#FAD1E2] bg-opacity-40 hover:bg-opacity-70 transition-all duration-200 px-3 py-1 rounded-full"
              >
                {userData.image ? (
                  <img className="w-7 h-7 rounded-full object-cover" src={userData.image} alt="user" />
                ) : (
                  <User size={20} />
                )}
                <span>{userData.name || 'User'}</span>
                <ChevronDown size={16} />
              </div>
              {dropdownVisible && (
                <div className="absolute right-0 mt-3 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 flex flex-col gap-1 text-gray-600">
                  <p
                    onClick={() => navigate('/my-profile')}
                    className="flex items-center gap-2 hover:bg-[#FAD1E2] hover:bg-opacity-30 cursor-pointer px-3 py-2 rounded-md"
                  >
                    <User size={16} /> My Profile
                  </p>
                  <p
                    onClick={() => navigate('/my-appointments')}
                    className="flex items-center gap-2 hover:bg-[#FAD1E2] hover:bg-opacity-30 cursor-pointer px-3 py-2 rounded-md"
                  >
                    <User size={16} /> My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="flex items-center gap-2 hover:bg-[#E64794] hover:bg-opacity-10 cursor-pointer px-3 py-2 rounded-md text-[#E64794]"
                  >
                    <LogOut size={16} /> Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-[#E64794] to-[#9E1B5B] text-white px-5 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-md"
            >
              <LogIn size={18} /> Login / Signup
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setShowMenu(true)}
          className="xl:hidden flex bg-gradient-to-r from-[#9E1B5B] to-[#E64794] text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      <div
        className={`xl:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`fixed top-0 right-0 bottom-0 bg-white shadow-lg w-3/4 max-w-sm z-50 transition-transform duration-300 ease-in-out rounded-l-xl ${
            showMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-6 border-b border-[#FAD1E2]">
            <h1
              onClick={() => navigate('/')}
              className="cursor-pointer text-2xl font-bold text-[#9E1B5B] hover:text-[#E64794] transition-all duration-200"
            >
              SAVAYS HEALS
            </h1>
            <button
              onClick={() => setShowMenu(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <X size={24} color="#9E1B5B" />
            </button>
          </div>

          <div className="p-5">
            {token && userData && (
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#FAD1E2]">
                <div className="w-12 h-12 rounded-full bg-[#FAD1E2] flex items-center justify-center overflow-hidden">
                  {userData.image ? (
                    <img className="w-full h-full object-cover" src={userData.image} alt="user" />
                  ) : (
                    <User size={24} color="#9E1B5B" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#9E1B5B]">{userData.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{userData.email || ''}</p>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-4 font-medium text-[#9E1B5B]">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  onClick={() => setShowMenu(false)}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-[#FAD1E2] bg-opacity-30' : 'hover:bg-[#FAD1E2] hover:bg-opacity-10'
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-[#FAD1E2]">
              {token && userData ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      navigate('/my-profile');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAD1E2] hover:bg-opacity-10 w-full text-left text-[#9E1B5B] transition-all duration-200"
                  >
                    <User size={20} /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/my-appointments');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAD1E2] hover:bg-opacity-10 w-full text-left text-[#9E1B5B] transition-all duration-200"
                  >
                    <User size={20} /> My Appointments
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-[#E64794] bg-opacity-10 rounded-lg hover:bg-opacity-20 w-full text-left text-[#E64794] transition-all duration-200"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setShowMenu(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#E64794] to-[#9E1B5B] text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <LogIn size={20} /> Login / Signup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
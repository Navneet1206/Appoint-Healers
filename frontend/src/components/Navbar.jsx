import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const navItemClass =
    'relative py-2 px-3 text-rose-600 hover:text-black transition-colors duration-300';

  return (
    <div className="fixed top-0 left-0 right-0 bg-rose-50 flex items-center justify-between px-6 py-4 border-b border-gray-300 z-50 shadow-sm">
      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        className="cursor-pointer text-2xl font-bold text-rose-600"
      >
        SAVAYS HEALS
      </h1>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
        <NavLink to="/" className={navItemClass}>
          HOME
        </NavLink>
        <NavLink to="/professional" className={navItemClass}>
          ALL PROFESSIONALS
        </NavLink>
        <NavLink to="/about" className={navItemClass}>
          ABOUT
        </NavLink>
        <NavLink to="/contact" className={navItemClass}>
          CONTACT
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative group flex items-center gap-2 cursor-pointer">
            <img className="w-8 rounded-full" src={userData.image} alt="User" />
            <img className="w-3" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded shadow-md p-4 z-30 hidden group-hover:block">
              <p onClick={() => navigate('/my-profile')} className="hover:text-rose-600 cursor-pointer">
                My Profile
              </p>
              <p onClick={() => navigate('/my-appointments')} className="hover:text-rose-600 cursor-pointer">
                My Appointments
              </p>
              <p onClick={logout} className="hover:text-rose-600 cursor-pointer">
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="hidden md:block bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition"
          >
            Log In / Sign Up
          </button>
        )}
        {/* Mobile Hamburger */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-40 bg-rose-50 w-full transition-transform duration-300 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6">
          <h1
            onClick={() => {
              navigate('/');
              setShowMenu(false);
            }}
            className="text-2xl font-bold text-rose-600 cursor-pointer"
          >
            SAVAYS HEALS
          </h1>
          <img
            src={assets.cross_icon}
            className="w-6 cursor-pointer"
            alt="Close"
            onClick={() => setShowMenu(false)}
          />
        </div>
        <ul className="flex flex-col items-center gap-5 mt-8 text-lg font-medium">
          <NavLink to="/" onClick={() => setShowMenu(false)} className={navItemClass}>
            HOME
          </NavLink>
          <NavLink to="/professional" onClick={() => setShowMenu(false)} className={navItemClass}>
            ALL PROFESSIONALS
          </NavLink>
          <NavLink to="/about" onClick={() => setShowMenu(false)} className={navItemClass}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" onClick={() => setShowMenu(false)} className={navItemClass}>
            CONTACT
          </NavLink>
          {!token && (
            <button
              onClick={() => {
                setShowMenu(false);
                navigate('/login');
              }}
              className="bg-rose-600 text-white px-8 py-3 rounded-full font-light mt-4"
            >
              Create Account
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

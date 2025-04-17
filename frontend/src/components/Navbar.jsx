import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  return (
    <div className='fixed top-0 left-0 right-0 bg-[#FEEFF4] flex items-center justify-between px-6 py-4 border-b border-[#FAD1E2] z-50 shadow-sm'>
      <h1
        onClick={() => navigate('/')}
        className='cursor-pointer text-2xl font-bold text-[#9E1B5B]'
      >
        SAVAYS HEALS
      </h1>

      <ul className='md:flex items-center gap-6 font-medium hidden text-[#9E1B5B]'>
        <NavLink to='/'><li className='py-1'>HOME</li></NavLink>
        <NavLink to='/professional'><li className='py-1'>ALL PROFESSIONALS</li></NavLink>
        <NavLink to='/about'><li className='py-1'>ABOUT</li></NavLink>
        <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {token && userData ? (
          <div
            className='relative group'
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setTimeout(() => setDropdownVisible(false), 3000)} // Delay to prevent immediate hide
          >
            <div
              className='flex items-center gap-2 cursor-pointer'
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setTimeout(() => setDropdownVisible(false), 3000)}
            >
              <img className='w-8 rounded-full' src={userData.image} alt="user" />
              <img className='w-3' src={assets.dropdown_icon} alt="dropdown" />
            </div>
            {dropdownVisible && (
              <div
                className='absolute right-0 mt-2 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 flex flex-col gap-3 text-gray-600'
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setTimeout(() => setDropdownVisible(false), 200)}
              >
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#E64794] hover:bg-[#d43f86] text-white px-6 py-2 rounded-full font-light hidden md:block transition-colors duration-200'
          >
            LogIn / SignUp
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='menu'
        />
      </div>

      {/* Mobile Slide-out Menu */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 bg-[#FEEFF4] z-40 transition-all duration-300 ease-in-out ${showMenu ? 'w-full' : 'w-0 overflow-hidden'}`}>
        <div className='flex items-center justify-between px-5 py-6'>
          <h1 onClick={() => navigate('/')} className='cursor-pointer text-2xl font-bold text-[#9E1B5B]'>SAVAYS HEALS</h1>
          <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="close" />
        </div>
        <ul className='flex flex-col items-center gap-4 mt-6 text-lg font-medium text-[#9E1B5B]'>
          <NavLink onClick={() => setShowMenu(false)} to='/'>HOME</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/professional'>ALL  PROFESSIONALS</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'>CONTACT</NavLink>
          {!token && (
            <button
              onClick={() => { setShowMenu(false); navigate('/login'); }}
              className='bg-[#E64794] hover:bg-[#d43f86] text-white px-6 py-2 rounded-full mt-4 transition-colors duration-200'
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
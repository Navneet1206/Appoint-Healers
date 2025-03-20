import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      {/* <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src="#" alt="" /> */}
      <h1 onClick={() => navigate('/')} className='w-44 cursor-pointer text-2xl text-rose-600 font-bold'>SAVAYS HEALS</h1>
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-rose-600 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/professional' > 
          <li className='py-1'>ALL PROFESSIONALS</li>
          <hr className='border-none outline-none h-0.5 bg-rose-600 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-rose-600 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-rose-600 w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-rose-600 text-black px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-rose-50 transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            {/* <img src="#" className='w-36' alt="" /> */}
            <h1 onClick={() => navigate('/')} className='w-44 cursor-pointer text-2xl text-rose-600 font-bold'>SAVAYS HEALS</h1>
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink 
              onClick={() => setShowMenu(false)} 
              to='/' 
              className={({ isActive }) => 
                isActive 
                  ? 'bg-rose-600 text-white px-4 py-2 rounded inline-block'
                  : 'text-rose-600 px-4 py-2 rounded inline-block'
              }
            >
              HOME
            </NavLink>
            <NavLink 
              onClick={() => setShowMenu(false)} 
              to='/professional' 
              className={({ isActive }) => 
                isActive 
                  ? 'bg-rose-600 text-white px-4 py-2 rounded inline-block'
                  : 'text-rose-600 px-4 py-2 rounded inline-block'
              }
            >
              ALL PROFESSIONALS
            </NavLink>
            <NavLink 
              onClick={() => setShowMenu(false)} 
              to='/about' 
              className={({ isActive }) => 
                isActive 
                  ? 'bg-rose-600 text-white px-4 py-2 rounded inline-block'
                  : 'text-rose-600 px-4 py-2 rounded inline-block'
              }
            >
              ABOUT
            </NavLink>
            <NavLink 
              onClick={() => setShowMenu(false)} 
              to='/contact' 
              className={({ isActive }) => 
                isActive 
                  ? 'bg-rose-600 text-white px-4 py-2 rounded inline-block'
                  : 'text-rose-600 px-4 py-2 rounded inline-block'
              }
            >
              CONTACT
            </NavLink>
            {/* Add "Create account" button if no token */}
            {!(token && userData) && (
              <button 
                onClick={() => { setShowMenu(false); navigate('/login'); }} 
                className='bg-rose-600 text-white px-8 py-3 rounded-full font-light mt-4'
              >
                Create account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;

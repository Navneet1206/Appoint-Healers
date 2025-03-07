import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Calendar, Home, Info, Phone, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Calendar className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SAVAYAS HEALS</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md hover:bg-teal-700 flex items-center ${
                isActive('/') ? 'bg-teal-700' : ''
              }`}
            >
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md hover:bg-teal-700 flex items-center ${
                isActive('/about') ? 'bg-teal-700' : ''
              }`}
            >
              <Info className="h-5 w-5 mr-1" />
              <span>About</span>
            </Link>
            
            <Link 
              to="/services" 
              className={`px-3 py-2 rounded-md hover:bg-teal-700 flex items-center ${
                isActive('/services') ? 'bg-teal-700' : ''
              }`}
            >
              <BookOpen className="h-5 w-5 mr-1" />
              <span>Services</span>
            </Link>
            
            <Link 
              to="/professionals" 
              className={`px-3 py-2 rounded-md hover:bg-teal-700 flex items-center ${
                isActive('/professionals') ? 'bg-teal-700' : ''
              }`}
            >
              <User className="h-5 w-5 mr-1" />
              <span>Professionals</span>
            </Link>
            
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-md hover:bg-teal-700 flex items-center ${
                isActive('/contact') ? 'bg-teal-700' : ''
              }`}
            >
              <Phone className="h-5 w-5 mr-1" />
              <span>Contact</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-1 ml-2">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md hover:bg-teal-700 ${
                    isActive('/dashboard') ? 'bg-teal-700' : ''
                  }`}
                >
                  Dashboard
                </Link>
                
                {user.role === 'professional' && (
                  <Link 
                    to="/professional/dashboard" 
                    className={`px-3 py-2 rounded-md hover:bg-teal-700 ${
                      isActive('/professional/dashboard') ? 'bg-teal-700' : ''
                    }`}
                  >
                    Professional Portal
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className={`px-3 py-2 rounded-md hover:bg-teal-700 ${
                      isActive('/admin/dashboard') ? 'bg-teal-700' : ''
                    }`}
                  >
                    Admin Portal
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-teal-700 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link 
                  to="/user/login" 
                  className={`px-3 py-2 rounded-md hover:bg-teal-700 ${
                    isActive('/login') ? 'bg-teal-700' : ''
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/user/register" 
                  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-teal-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                isActive('/') ? 'bg-teal-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                isActive('/about') ? 'bg-teal-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <Link 
              to="/services" 
              className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                isActive('/services') ? 'bg-teal-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            
            <Link 
              to="/professionals" 
              className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                isActive('/professionals') ? 'bg-teal-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Professionals
            </Link>
            
            <Link 
              to="/contact" 
              className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                isActive('/contact') ? 'bg-teal-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                    isActive('/dashboard') ? 'bg-teal-700' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {user.role === 'professional' && (
                  <Link 
                    to="/professional/dashboard" 
                    className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                      isActive('/professional/dashboard') ? 'bg-teal-700' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Professional Portal
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                      isActive('/admin/dashboard') ? 'bg-teal-700' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md hover:bg-teal-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md hover:bg-teal-700 ${
                    isActive('/login') ? 'bg-teal-700' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md hover:bg-teal-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

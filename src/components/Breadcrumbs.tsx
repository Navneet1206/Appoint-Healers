import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customLabels?: Record<string, string>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customLabels = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Skip rendering breadcrumbs on the home page
  if (pathnames.length === 0) {
    return null;
  }

  // Default page labels
  const defaultLabels: Record<string, string> = {
    'login': 'Login',
    'register': 'Register',
    'verify': 'Verify Account',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'professionals': 'Healthcare Professionals',
    'book-appointment': 'Book Appointment',
    'appointments': 'Appointments',
    'professional': 'Professional Dashboard',
    'admin': 'Admin Dashboard',
    '404': 'Page Not Found'
  };

  // Combine default and custom labels
  const labels = { ...defaultLabels, ...customLabels };

  return (
    <nav className="flex py-3 px-5 text-gray-700 bg-gray-50 rounded-md my-4 max-w-7xl mx-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-teal-600">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Handle dynamic routes with IDs
          const isIdSegment = name.match(/^[0-9a-fA-F-]+$/);
          let label = labels[name] || name;
          
          if (isIdSegment) {
            // For appointment details pages
            if (pathnames[index - 1] === 'appointments') {
              label = 'Appointment Details';
            } else {
              label = 'Details';
            }
          }
          
          return (
            <li key={name}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-teal-600 md:ml-2">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-teal-600 md:ml-2"
                  >
                    {label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
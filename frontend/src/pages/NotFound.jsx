import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-9xl font-bold text-[#D20424] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! It looks like the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#D20424] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#b5031f] transition-colors duration-300"
        >
          Back to Home
        </Link>
        <p className="mt-6 text-gray-500">
          Need help? Contact <span className="text-[#D20424] font-medium">Savayas Heal</span> support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Wrapper for consistent layout */}
      <div className="max-w-screen-xl mx-auto py-12 px-4 md:px-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm">
          
          {/* Logo and description */}
          <div>
            <img className="mb-5 w-40" src="#" alt="Logo" />
            <p className="w-full md:w-2/3 text-gray-400 leading-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-lg font-semibold mb-5 text-white">SAVAYAS HEALS</p>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>Home</li>
              <li>About us</li>
              <li>Delivery</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-lg font-semibold mb-5 text-white">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>+91-8468938745</li>
              <li>support.savayas@savayasheals.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <hr className="border-gray-700" />
        <p className="py-5 text-sm text-center text-gray-500">
          Copyright 2025 © savayasheals.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

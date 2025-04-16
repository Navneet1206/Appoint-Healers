import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-12 px-4 md:px-10'>
      {/* Main footer content */}
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm'>
        {/* Logo and description section */}
        <div>
          <img
            className='mb-5 w-40'
            src="#"
            alt="Logo"
          />
          <p className='w-full md:w-2/3 text-gray-400 leading-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Links section */}
        <div>
          <p className='text-lg font-medium mb-5 text-gray-200'>SAVAYAS HEALS</p>
          <ul className='flex flex-col gap-2 text-gray-400'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Contact section */}
        <div>
          <p className='text-lg font-medium mb-5 text-gray-200'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-400'>
            <li>+91-8468938745</li>
            <li>support.savayas@savayasheals.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright section */}
      <div>
        <hr className='border-gray-700' />
        <p className='py-5 text-sm text-center text-gray-400'>
          Copyright 2025 @ savayasheals.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
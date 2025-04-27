import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Savayas Heal</h3>
            <p className="text-gray-400">
              Empowering minds, healing hearts, one session at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Psychiatrist</li>
              <li>Therapist</li>
              <li>Sexologist</li>
              <li>Child Psychology</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Mental Health Tips</li>
              <li>FAQ</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@savayasheal.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Healing Street</li>
              <li>New York, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Savayas Heal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
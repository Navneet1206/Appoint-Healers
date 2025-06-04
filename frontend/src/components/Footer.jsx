import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

const Footer = () => {
  return (
    <div className="min-h-[100vh] flex flex-col">
      <main className="flex-grow"></main>
      <footer className="bg-[#1e1e1e] text-white py-10 px-4 md:px-16 lg:px-24 text-sm">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & Tagline */}
          <div>
            <h3 className="text-xl font-bold text-[#D20424]">SavayasHeal</h3>
            <p className="text-gray-300 mt-1">We Don’t Judge. We Just Empathize.</p>
            <p className="text-gray-400 mt-3">
              Empowering mental wellness through compassionate care and evidence-based treatment.
            </p>
            <div className="flex gap-4 mt-4 text-lg">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="hover:text-[#D20424] cursor-pointer" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-[#D20424] cursor-pointer" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="hover:text-[#D20424] cursor-pointer" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn className="hover:text-[#D20424] cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/services" className="hover:text-[#D20424]">Our Services</a></li>
              <li><a href="/conditions" className="hover:text-[#D20424]">Conditions We Treat</a></li>
              <li><a href="/about" className="hover:text-[#D20424]">About Us</a></li>
              <li><a href="/book" className="hover:text-[#D20424]">Book a Session</a></li>
              <li><a href="/professionals" className="hover:text-[#D20424]">For Professionals</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <HiLocationMarker />
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">123 Wellness St, Mental Health City</a>
              </li>
              <li className="flex items-center gap-2">
                <HiPhone />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-2">
                <HiMail />
                <a href="mailto:info@savayasheal.com">info@savayasheal.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-gray-300 mb-2">Stay updated with our latest mental health resources & news.</p>
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full p-2 rounded text-black mb-2"
            />
            <button className="bg-[#D20424] hover:bg-red-700 text-white px-4 py-2 rounded w-full">
              Subscribe
            </button>
          </div>
        </div>

        {/* Disclaimer & Bottom Links */}
        <div className="text-gray-400 mt-10 text-xs">
          <p className="mb-4">
            <strong>Disclaimer:</strong> SAVAYAS HEAL provides support and guidance for mental and emotional well-being but is not designed to handle urgent medical or psychiatric emergencies. If you or someone you know is experiencing a crisis, including thoughts of self-harm, suicide, or severe mental health symptoms, please seek immediate help by contacting emergency services or going to the nearest hospital. Having someone you trust with you during such times can be severely helpful.
          </p>
          <div className="flex flex-wrap gap-4 justify-between items-center border-t border-gray-600 pt-4">
            <span>© 2025 Savayas Heal. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <a href="/privacy" className="hover:text-[#D20424]">Privacy Policy</a>
              <a href="/terms-and-conditions" className="hover:text-[#D20424]">Terms & Conditions</a>
              <a href="/cancellation" className="hover:text-[#D20424]">Cancellation & Refund Policy</a>
              <a href="/sitemap" className="hover:text-[#D20424]">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
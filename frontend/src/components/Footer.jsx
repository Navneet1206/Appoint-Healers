import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Heart, Users, Headphones } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setNewsletterSent(true);
      setEmail('');
      setTimeout(() => setNewsletterSent(false), 3000); // Hide success message after 3s
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const linkHover = {
    scale: 1.05,
    color: '#e11d48', // rose-600
  };

  return (
    <footer className="bg-gradient-to-t from-rose-900 to-purple-900 text-gray-200">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Wave Divider */}
        <svg className="absolute top-0 left-0 w-full h-24 text-rose-900" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center">
              <Heart className="text-rose-400 w-8 h-8 mr-2" />
              <h2 className="text-3xl font-bold text-white">Savayas Heal</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Savayas Heal is your sanctuary for mental wellness, connecting you with expert counselors, relational therapists, and compassionate listeners to support your journey to a healthier mind.
            </p>
            <div className="flex space-x-4">
              {[
                { href: 'https://twitter.com', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.186-7.186a2.25 2.25 0 00-3.182 0L5.956 2.25H9.264a2.25 2.25 0 013.182 0l7.186 7.186v3.308a2.25 2.25 0 010 3.182l-7.186 7.186h-3.308a2.25 2.25 0 01-3.182 0l-7.186-7.186v-3.308a2.25 2.25 0 010-3.182l7.186-7.186a2.25 2.25 0 013.182 0z" /></svg>, label: 'Twitter' },
                { href: 'https://instagram.com', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" /></svg>, label: 'Instagram' },
                { href: 'https://linkedin.com', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, label: 'LinkedIn' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.3, rotate: 5 }}
                  className="text-gray-300 hover:text-rose-400 transition"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white relative">
              Explore
              <span className="bg-purple-500 h-1 w-10 absolute -bottom-1 left-0 rounded"></span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Professionals', path: '/professionals' },
                { name: 'About Us', path: '/about' },
                { name: 'Blog', path: '/blog' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact', path: '/contact' },
              ].map((link, idx) => (
                <motion.button
                  key={idx}
                  whileHover={linkHover}
                  onClick={() => navigateTo(link.path)}
                  className="text-sm text-gray-300 hover:text-rose-400 text-left transition"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Our Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white relative">
              Our Services
              <span className="bg-purple-500 h-1 w-10 absolute -bottom-1 left-0 rounded"></span>
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Counseling Professionals', icon: <Users size={18} className="mr-2" /> },
                { name: 'Relational Therapists', icon: <Heart size={18} className="mr-2" /> },
                { name: 'Listeners', icon: <Headphones size={18} className="mr-2" /> },
              ].map((service, idx) => (
                <motion.a
                  key={idx}
                  href="/services"
                  whileHover={linkHover}
                  className="flex items-center text-sm text-gray-300 hover:text-rose-400 transition"
                >
                  {service.icon}
                  {service.name}
                </motion.a>
              ))}
            </div>
            <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-200">
                <span className="text-rose-400 font-semibold">12,000+</span> lives touched this year
              </p>
            </div>
          </motion.div>

          {/* Newsletter & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white relative">
              Stay Connected
              <span className="bg-purple-500 h-1 w-10 absolute -bottom-1 left-0 rounded"></span>
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-rose-500 hover:bg-rose-600 p-2 rounded-md text-white transition"
                  aria-label="Subscribe to newsletter"
                >
                  <Send size={16} />
                </motion.button>
              </div>
              {newsletterSent && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Subscribed successfully!
                </motion.p>
              )}
            </form>
            <div className="space-y-3 text-sm">
              <p className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-rose-400" />
                +1 (800) 987-6543
              </p>
              <p className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-rose-400" />
                hello@savayasheal.com
              </p>
              <p className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2 text-rose-400" />
                456 Serenity Ave, Wellness City, USA
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Savayas Heal. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { name: 'Terms of Service', path: '/terms' },
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Sitemap', path: '/sitemap' },
            ].map((link, idx) => (
              <motion.button
                key={idx}
                whileHover={linkHover}
                onClick={() => navigateTo(link.path)}
                className="hover:text-rose-400 transition"
              >
                {link.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
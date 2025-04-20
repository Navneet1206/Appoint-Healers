import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin/doctor stats for the home page
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
        headers: { dToken },
      });
      if (data.success) {
        setStats({
          totalDoctors: data.totalDoctors || 0,
          totalAppointments: data.totalAppointments || 0,
          totalPatients: data.totalPatients || 0,
          totalEarnings: data.totalEarnings || 0,
        });
      } else {
        toast.error(data.message || 'Failed to load stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchStats();
    }
  }, [dToken]);

  // Framer Motion variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const heroVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={heroVariant}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4">
            Welcome to Your Doctor Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your appointments, track earnings, and view patient reviews with ease. Explore your dashboard to get started.
          </p>
          <motion.button
            onClick={() => navigate('/doctor/dashboard')}
            className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️' },
            { label: 'Total Appointments', value: stats.totalAppointments, icon: '📅' },
            { label: 'Total Patients', value: stats.totalPatients, icon: '👥' },
            {
              label: 'Total Earnings',
              value: `${currency} ${stats.totalEarnings}`,
              icon: '💰',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center gap-4 hover:scale-105 transition-all"
            >
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-semibold text-gray-600">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          animate="visible"
          variants={cardVariant}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'View Appointments', path: '/doctor/appointments' },
              { label: 'Manage Profile', path: '/doctor/profile' },
              { label: 'Check Reviews', path: '/doctor/dashboard' },
            ].map((link, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(link.path)}
                className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
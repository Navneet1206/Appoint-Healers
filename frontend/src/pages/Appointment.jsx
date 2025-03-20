import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Helper to convert 24-hour time (e.g., "14:00") to 12-hour AM/PM format
const convertToAmPm = (timeStr) => {
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
};

// Helper to convert "dd_mm_yyyy" to "Month Day, Year" format
const formatDate = (dateStr) => {
  const [d, m, y] = dateStr.split("_").map(Number);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[m - 1]} ${d}, ${y}`;
};

// Helper to get day of week from "dd_mm_yyyy"
const getDayOfWeek = (dateStr) => {
  const [d, m, y] = dateStr.split("_").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return daysOfWeek[dateObj.getDay()];
};

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  // Grouped slots: each entry is [dateString, array of slot objects]
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  // Group active slots by slotDate
  const processSlots = () => {
    if (!docInfo || !docInfo.slots) return;
    const activeSlots = docInfo.slots.filter(slot => slot.status === "Active");
    const groups = {};
    activeSlots.forEach(slot => {
      if (!groups[slot.slotDate]) groups[slot.slotDate] = [];
      groups[slot.slotDate].push(slot);
    });
    const sorted = Object.entries(groups).sort((a, b) => {
      const [d1, m1, y1] = a[0].split("_").map(Number);
      const [d2, m2, y2] = b[0].split("_").map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });
    setGroupedSlots(sorted);
    setSelectedGroupIndex(0);
    setSelectedSlotId("");
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }
    if (!selectedSlotId) {
      toast.warning('Please select a slot');
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotId: selectedSlotId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      processSlots();
    }
  }, [docInfo]);

  // Framer-motion variants for slot cards
  const slotCardVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Framer-motion variant for date cards
  const dateCardVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return docInfo ? (
    <div className="min-h-screen bg-rose-50 p-4 md:p-8">
      <motion.div 
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Doctor Details */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-rose-100 p-6 flex items-center justify-center">
            <motion.img 
              className="w-full max-w-xs rounded-lg object-cover"
              src={docInfo.image}
              alt={docInfo.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="md:w-2/3 p-6 space-y-4">
            <motion.p className="flex items-center gap-2 text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {docInfo.name} 
              <img className="w-5" src={assets.verified_icon} alt="verified" />
            </motion.p>
            <motion.div className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className="py-1 px-3 border border-rose-600 text-xs rounded-full">{docInfo.experience}</button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-lg font-medium text-gray-700 flex items-center gap-1">
                About 
                <img className="w-4" src={assets.info_icon} alt="info" />
              </p>
              <p className="text-sm text-gray-600">{docInfo.about}</p>
            </motion.div>
            <motion.p 
              className="text-gray-700 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Appointment fee: <span className="text-gray-900">{currencySymbol}{docInfo.fees}</span>
            </motion.p>
          </div>
        </div>
        {/* Booking Slots */}
        <div className="p-6 border-t border-gray-200">
          <motion.p 
            className="font-semibold text-gray-700 text-xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Available Slots
          </motion.p>
          {groupedSlots.length > 0 ? (
            <>
              {/* Date Selector as Cards */}
              <motion.div 
                className="flex gap-4 overflow-x-auto pb-4 mb-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
              >
                {groupedSlots.map(([dateStr, slots], index) => (
                  <motion.div 
                    key={index}
                    variants={dateCardVariant}
                    onClick={() => { setSelectedGroupIndex(index); setSelectedSlotId(""); }}
                    className={`flex flex-col items-center justify-center min-w-[120px] py-4 px-3 rounded-lg cursor-pointer transition-transform duration-300 shadow-md 
                      ${selectedGroupIndex === index ? 'bg-rose-600 text-white' : 'bg-white border border-gray-300 text-gray-800'}`}
                  >
                    <p className="text-sm font-semibold">{getDayOfWeek(dateStr)}</p>
                    <p className="text-base">{formatDate(dateStr)}</p>
                  </motion.div>
                ))}
              </motion.div>
              {/* Slots for Selected Date as Cards */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {groupedSlots[selectedGroupIndex] && groupedSlots[selectedGroupIndex][1].map(slot => (
                  <motion.div 
                    key={slot._id}
                    variants={slotCardVariant}
                    onClick={() => setSelectedSlotId(slot._id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-transform duration-300 shadow-sm hover:shadow-lg 
                      ${selectedSlotId === slot._id ? 'bg-rose-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                  >
                    <p className="text-lg font-bold">
                      {convertToAmPm(slot.slotTime)}
                    </p>
                    {slot.description && <p className="text-xs mt-1">{slot.description}</p>}
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.p className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              No available slots
            </motion.p>
          )}
          <motion.button 
            onClick={bookAppointment}
            className="mt-6 w-full bg-rose-600 text-white text-xl font-semibold py-3 rounded-full transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Book an Appointment
          </motion.button>
        </div>
      </motion.div>
      {/* Related Doctors Section */}
      <div className="mt-8">
        <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    </div>
  ) : null;
};

export default Appointment;

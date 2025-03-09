import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  // docSlots is now an array of groups; each group is [dateString, array of slot objects]
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    // Get doctor info from the list in context (or from API if needed)
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  // Process doctor slots (pre-created by doctor) – group by slotDate
  const processSlots = () => {
    if (!docInfo || !docInfo.slots) return;
    // Filter to only active slots
    const activeSlots = docInfo.slots.filter(slot => slot.status === "Active");
    const groups = {};
    activeSlots.forEach(slot => {
      if (!groups[slot.slotDate]) groups[slot.slotDate] = [];
      groups[slot.slotDate].push(slot);
    });
    // Sort the dates (assumed format "dd_mm_yyyy")
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

  return docInfo ? (
    <div className="p-4">
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>
        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8">
        <p className="font-medium text-[#565656]">Available Slots</p>
        {groupedSlots.length > 0 ? (
          <>
            {/* Date selector */}
            <div className="flex gap-3 items-center overflow-x-scroll mt-4">
              {groupedSlots.map(([dateStr, slots], index) => {
                const [d, m, y] = dateStr.split("_");
                const dateObj = new Date(y, m - 1, d);
                const day = daysOfWeek[dateObj.getDay()];
                return (
                  <div
                    key={index}
                    onClick={() => { setSelectedGroupIndex(index); setSelectedSlotId(""); }}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${selectedGroupIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}
                  >
                    <p>{day}</p>
                    <p>{d}</p>
                  </div>
                );
              })}
            </div>
            {/* Slots for selected date */}
            <div className="flex items-center gap-3 overflow-x-scroll mt-4">
              {groupedSlots[selectedGroupIndex] && groupedSlots[selectedGroupIndex][1].map(slot => (
                <div
                  key={slot._id}
                  onClick={() => setSelectedSlotId(slot._id)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${selectedSlotId === slot._id ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}
                >
                  {slot.slotTime.toLowerCase()}
                  {slot.description && <div className="text-xs mt-1">{slot.description}</div>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 text-gray-500">No available slots</p>
        )}
        <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6">
          Book an Appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;

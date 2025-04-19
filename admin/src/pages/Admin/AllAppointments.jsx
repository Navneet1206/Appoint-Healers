import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments, sendMeetingLink, acceptAppointment, completeAppointment } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  // Debug context values
  useEffect(() => {
    console.log('AdminContext values:', { aToken, appointments, cancelAppointment, getAllAppointments, sendMeetingLink, acceptAppointment, completeAppointment });
  }, [aToken, appointments, cancelAppointment, getAllAppointments, sendMeetingLink, acceptAppointment, completeAppointment]);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const handleSendMeetingLink = async (e) => {
    e.preventDefault();
    if (!sendMeetingLink) {
      toast.error('sendMeetingLink function is not available');
      return;
    }
    const success = await sendMeetingLink(selectedAppointmentId, meetingLink);
    if (success) {
      setShowModal(false);
      setMeetingLink('');
      setSelectedAppointmentId('');
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    if (!acceptAppointment) {
      toast.error('acceptAppointment function is not available');
      return;
    }
    await acceptAppointment(appointmentId);
  };

  const handleCompleteAppointment = async (appointmentId) => {
    if (!completeAppointment) {
      toast.error('completeAppointment function is not available');
      return;
    }
    await completeAppointment(appointmentId);
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_3fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Professional</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_3fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            key={index}
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt='' />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt='' />
              <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <div className='flex gap-2'>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedAppointmentId(item._id);
                      setShowModal(true);
                    }}
                    className='text-blue-500 text-xs font-medium hover:underline'
                  >
                    Send Link
                  </button>
                  <button
                    onClick={() => handleAcceptAppointment(item._id)}
                    className='text-green-500 text-xs font-medium hover:underline'
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleCompleteAppointment(item._id)}
                    className='text-purple-500 text-xs font-medium hover:underline'
                  >
                    Complete
                  </button>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-6 cursor-pointer'
                    src={assets.cancel_icon}
                    alt='Cancel'
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Sending Meeting Link */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-lg font-medium mb-4'>Send Meeting Link</h2>
            <form onSubmit={handleSendMeetingLink} className='space-y-4'>
              <div>
                <label htmlFor='meetingLink' className='block text-sm font-medium text-gray-600'>
                  Meeting Link
                </label>
                <input
                  type='url'
                  id='meetingLink'
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className='mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter Meeting Link'
                  required
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition'
                >
                  Send
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false);
                    setMeetingLink('');
                    setSelectedAppointmentId('');
                  }}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
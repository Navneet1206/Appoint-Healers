import React, { useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments, completeAppointment } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

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
            <p>{currency}{item.discountedAmount ? item.discountedAmount : item.originalAmount}</p>
            <div className='flex gap-2'>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <>
                  <button
                    onClick={() => completeAppointment(item._id)}
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
    </div>
  );
};

export default AllAppointments;
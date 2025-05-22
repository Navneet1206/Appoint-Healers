import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat, currency, calculateAge } = useContext(AppContext);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken, getAppointments]);

    return (
        <div className="w-full max-w-6xl mx-auto my-5 px-4">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">Appointments Dashboard</h2>
            
            {appointments.length === 0 ? (
                <div className="bg-white border rounded-lg p-8 text-center">
                    <p className="text-gray-500">No appointments found</p>
                </div>
            ) : (
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 items-center font-medium text-gray-700 py-3 px-6 bg-gray-50 border-b">
                        <p>#</p>
                        <p>Patient</p>
                        <p>Type</p>
                        <p>Age</p>
                        <p>Schedule</p>
                        <p>Fee</p>
                        <p>Actions</p>
                    </div>
                    
                    <div className="max-h-[70vh] overflow-y-auto">
                        {appointments.map((item, index) => (
                            <div key={index} className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50 transition-colors">
                                <p className="max-sm:hidden font-medium">{index + 1}</p>
                                <div className="flex items-center gap-3">
                                    <img src={item.userData.image} className="w-10 h-10 rounded-full object-cover border" alt={item.userData.name} />
                                    <div>
                                        <p className="font-medium text-gray-800">{item.userData.name}</p>
                                        <p className="text-xs text-gray-500 sm:hidden">{calculateAge(item.userData.dob)} years</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <span className={`text-xs px-3 py-1 rounded-full ${item.payment ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                        {item.payment ? 'Online' : 'Cash'}
                                    </span>
                                </div>
                                
                                <p className="max-sm:hidden">{calculateAge(item.userData.dob)} years</p>
                                
                                <div>
                                    <p className="font-medium">{slotDateFormat(item.slotDate)}</p>
                                    <p className="text-sm text-gray-500">{item.slotTime}</p>
                                </div>
                                
                                <p className="font-medium text-gray-800">{currency}{item.discountedAmount ? item.discountedAmount : item.originalAmount}</p>
                                
                                <div className="flex flex-wrap gap-2 items-center">
                                    {item.cancelled ? (
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-medium">Cancelled</span>
                                    ) : item.isCompleted ? (
                                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-medium">Completed</span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => cancelAppointment(item._id)}
                                                className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                title="Cancel Appointment"
                                            >
                                                <img className="w-6 h-6" src={assets.cancel_icon} alt="Cancel" />
                                            </button>
                                            
                                            <button
                                                onClick={() => completeAppointment(item._id)}
                                                className="p-1.5 rounded-full hover:bg-green-50 transition-colors"
                                                title="Mark as Completed"
                                            >
                                                <img className="w-6 h-6" src={assets.tick_icon} alt="Complete" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
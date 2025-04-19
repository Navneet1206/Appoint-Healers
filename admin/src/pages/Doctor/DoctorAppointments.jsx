import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments } = useContext(DoctorContext);
    const { backendUrl, slotDateFormat, currency } = useContext(AppContext);
    const [meetingLink, setMeetingLink] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    const sendMeetingLink = async (appointmentId) => {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/send-meeting-link`,
                { appointmentId, meetingLink },
                { headers: { dToken } }
            );
            if (data.success) {
                toast.success('Meeting link sent successfully');
                setMeetingLink('');
                setSelectedAppointment(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error sending meeting link');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const acceptAppointment = async (appointmentId) => {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/accept-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );
            if (data.success) {
                toast.success('Appointment accepted successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error accepting appointment');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-medium">All Appointments</p>
            <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
                {appointments.map((item, index) => (
                    <div key={index} className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50">
                        <p className="max-sm:hidden">{index}</p>
                        <div className="flex items-center gap-2">
                            <img src={item.userData.image} className="w-8 rounded-full" alt="" />
                            <p>{item.userData.name}</p>
                        </div>
                        <div>
                            <p className="text-xs inline border border-primary px-2 rounded-full">
                                {item.payment ? 'Online' : 'CASH'}
                            </p>
                        </div>
                        <p className="max-sm:hidden">{item.userData.age}</p>
                        <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                        <p>{currency}{item.amount}</p>
                        <div className="flex gap-2">
                            {item.cancelled ? (
                                <p className="text-red-400 text-xs font-medium">Cancelled</p>
                            ) : item.isCompleted ? (
                                <p className="text-green-500 text-xs font-medium">Completed</p>
                            ) : (
                                <>
                                    <img
                                        onClick={() => cancelAppointment(item._id)}
                                        className="w-10 cursor-pointer"
                                        src={assets.cancel_icon}
                                        alt=""
                                    />
                                    <img
                                        onClick={() => completeAppointment(item._id)}
                                        className="w-10 cursor-pointer"
                                        src={assets.tick_icon}
                                        alt=""
                                    />
                                    {item.payment && (
                                        <>
                                            <button
                                                onClick={() => setSelectedAppointment(item._id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Send Meeting Link'}
                                            </button>
                                            <button
                                                onClick={() => acceptAppointment(item._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Accept Appointment'}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Send Meeting Link</h3>
                        <div className="mb-4">
                            <label className="block mb-2">Meeting Link</label>
                            <input
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="w-full p-2 border rounded"
                                type="text"
                                placeholder="Enter meeting link"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => sendMeetingLink(selectedAppointment)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
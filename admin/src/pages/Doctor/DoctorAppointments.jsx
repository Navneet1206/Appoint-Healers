import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments } = useContext(DoctorContext);
    const { backendUrl, slotDateFormat, currency, calculateAge } = useContext(AppContext);
    const [meetingLink, setMeetingLink] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processedAppointments, setProcessedAppointments] = useState({});

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken, getAppointments]);

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
                setProcessedAppointments(prev => ({
                    ...prev,
                    [appointmentId]: {
                        ...prev[appointmentId],
                        linkSent: true
                    }
                }));
                getAppointments();
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
                setProcessedAppointments(prev => ({
                    ...prev,
                    [appointmentId]: {
                        ...prev[appointmentId],
                        accepted: true
                    }
                }));
                getAppointments();
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

    const cancelAppointment = async (appointmentId) => {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );
            if (data.success) {
                toast.success('Appointment cancelled successfully');
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error cancelling appointment');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );
            if (data.success) {
                toast.success('Appointment marked as completed');
                setProcessedAppointments(prev => ({
                    ...prev,
                    [appointmentId]: {
                        ...prev[appointmentId],
                        completed: true
                    }
                }));
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error completing appointment');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAppointmentAccepted = (appointmentId) => {
        return processedAppointments[appointmentId]?.accepted;
    };

    const isLinkSent = (appointmentId) => {
        return processedAppointments[appointmentId]?.linkSent;
    };

    const isAppointmentCompleted = (appointmentId) => {
        return processedAppointments[appointmentId]?.completed;
    };

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
                                    ) : item.isCompleted || isAppointmentCompleted(item._id) ? (
                                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-medium">Completed</span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => cancelAppointment(item._id)}
                                                className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                title="Cancel Appointment"
                                                disabled={isSubmitting}
                                            >
                                                <img className="w-6 h-6" src={assets.cancel_icon} alt="Cancel" />
                                            </button>
                                            
                                            <button
                                                onClick={() => completeAppointment(item._id)}
                                                className="p-1.5 rounded-full hover:bg-green-50 transition-colors"
                                                title="Mark as Completed"
                                                disabled={isSubmitting}
                                            >
                                                <img className="w-6 h-6" src={assets.tick_icon} alt="Complete" />
                                            </button>
                                            
                                            {item.payment && (
                                                <>
                                                    {!isAppointmentAccepted(item._id) && !item.isAccepted && (
                                                        <button
                                                            onClick={() => acceptAppointment(item._id)}
                                                            className="bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600 transition-colors"
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? 'Processing...' : 'Accept'}
                                                        </button>
                                                    )}
                                                    
                                                    {(isAppointmentAccepted(item._id) || item.isAccepted) && !isLinkSent(item._id) && !item.meetingLink && (
                                                        <button
                                                            onClick={() => setSelectedAppointment(item._id)}
                                                            className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? 'Processing...' : 'Send Link'}
                                                        </button>
                                                    )}
                                                    
                                                    {(isLinkSent(item._id) || item.meetingLink) && (
                                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-medium">
                                                            Link Sent
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl animate-slideUp">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Send Meeting Link</h3>
                        <p className="text-gray-500 text-sm mb-4">The patient will receive this link via email and SMS</p>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting URL</label>
                            <input
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                type="url"
                                placeholder="https://meet.google.com/abc-defg-hij"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => sendMeetingLink(selectedAppointment)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                disabled={isSubmitting || !meetingLink}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
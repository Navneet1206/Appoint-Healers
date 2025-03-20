import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format slot date (assumes format "dd_mm_yyyy")
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  // Get appointments from the backend
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel appointment API call
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Initialize Razorpay payment
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, { headers: { token } });
          if (data.success) {
            navigate('/my-appointments');
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Payment using Razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId }, { headers: { token } });
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((item) => {
    return (
      item.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docData.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slotDateFormat(item.slotDate).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-rose-50 p-4 sm:p-6 md:p-8 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-rose-600">My Appointments</h1>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </header>
      <div className="space-y-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-center md:items-stretch">
              <div className="md:w-1/4 flex justify-center items-center bg-rose-100 p-4">
                <img className="w-24 h-24 object-cover rounded-full" src={item.docData.image} alt={item.docData.name} />
              </div>
              <div className="md:w-1/2 p-4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-rose-700">{item.docData.name}</h2>
                <p className="text-rose-600">{item.docData.speciality}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-rose-600">Address:</span> {item.docData.address.line1}, {item.docData.address.line2}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium text-rose-600">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className="md:w-1/4 p-4 flex flex-col gap-2 justify-center items-center">
                {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                  <button
                    onClick={() => setPayment(item._id)}
                    className="w-full py-2 px-4 border border-rose-500 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-rose-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                  >
                    <img className="w-16 h-auto" src={assets.razorpay_logo} alt="Razorpay" />
                  </button>
                )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="w-full py-2 px-4 border rounded bg-rose-100 text-rose-500">
                    Paid
                  </button>
                )}
                {item.isCompleted && (
                  <button className="w-full py-2 px-4 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="w-full py-2 px-4 border border-rose-500 rounded hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="w-full py-2 px-4 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-rose-600 font-medium">
            <p>No appointments found.</p>
          </div>
        )}
      </div>
      <footer className="mt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.
      </footer>
    </div>
  );
};

export default MyAppointments;

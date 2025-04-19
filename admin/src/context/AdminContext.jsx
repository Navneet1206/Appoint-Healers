import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
        headers: { aToken }
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMeetingLink = async (appointmentId, meetingLink) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/send-meeting-link', { appointmentId, meetingLink }, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const acceptAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/accept-appointment', { appointmentId }, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/complete-appointment', { appointmentId }, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', {
        headers: { aToken }
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { aToken }
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken, setAToken,
    backendUrl,
    appointments, getAllAppointments,
    cancelAppointment,
    sendMeetingLink,
    acceptAppointment,
    completeAppointment,
    doctors, getAllDoctors,
    dashData, getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
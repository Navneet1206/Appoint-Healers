import api from '../lib/api';

// Create a new appointment
export const createAppointment = async (appointmentData: {
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) => {
  const { data } = await api.post('/appointments', appointmentData);
  return data;
};

// Get all appointments for logged in user
export const getAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

// Get appointment by ID
export const getAppointmentById = async (id: string) => {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
};

// Update appointment status
export const updateAppointmentStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
  const { data } = await api.put(`/appointments/${id}`, { status });
  return data;
};
import api from '../lib/api';
import { Availability } from '../types';

// Get availability for a professional
export const getAvailability = async (professionalId: string) => {
  const { data } = await api.get(`/availability/${professionalId}`);
  return data;
};

// Create or update availability
export const createAvailability = async (availabilityData: Partial<Availability>) => {
  const { data } = await api.post('/availability', availabilityData);
  return data;
};

// Delete availability
export const deleteAvailability = async (id: string) => {
  const { data } = await api.delete(`/availability/${id}`);
  return data;
};
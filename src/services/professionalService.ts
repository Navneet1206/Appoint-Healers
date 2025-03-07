import api from '../lib/api';
import { Professional } from '../types';

// Get all professionals
export const getProfessionals = async () => {
  const { data } = await api.get('/professionals');
  return data;
};

// Get professional by ID
export const getProfessionalById = async (id: string) => {
  const { data } = await api.get(`/professionals/${id}`);
  return data;
};

// Get professional profile for logged in user
export const getProfessionalProfile = async () => {
  const { data } = await api.get('/professionals/profile');
  return data;
};

// Create professional profile
export const createProfessionalProfile = async (professionalData: Partial<Professional>) => {
  const { data } = await api.post('/professionals/profile', professionalData);
  return data;
};

// Update professional profile
export const updateProfessionalProfile = async (id: string, professionalData: Partial<Professional>) => {
  const { data } = await api.put(`/professionals/${id}`, professionalData);
  return data;
};
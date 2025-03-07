import axios from 'axios';

// Define types for API request data and responses
interface UserRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ProfessionalRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AppointmentData {
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface PaymentOrderData {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentData {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  appointmentId: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token?: string;
}

interface ProfessionalResponse {
  id: string;
  name: string;
  specialization: string;
  hourlyRate: number;
  user: { email: string };
}

interface AppointmentResponse {
  id: string;
  user: { email: string };
  professional: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentId?: string;
}

interface PaymentResponse {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
}

// New type for payment order creation response (e.g., Razorpay order)
interface PaymentOrderResponse {
  id: string; // Order ID (e.g., Razorpay order_id)
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  createdAt: number;
}

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with baseURL and credentials
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (optional, if using JWT in Authorization header)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const registerUser = async (data: UserRegisterData): Promise<UserResponse> => {
  const response = await api.post('/auth/user/register', data);
  return response.data;
};

export const registerProfessional = async (data: ProfessionalRegisterData): Promise<UserResponse> => {
  const response = await api.post('/auth/professional/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<UserResponse> => {
  const response = await api.post('/auth/user/login', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Appointments API calls
export const createAppointment = async (data: AppointmentData): Promise<AppointmentResponse> => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const getAppointments = async (): Promise<AppointmentResponse[]> => {
  const response = await api.get('/appointments');
  return response.data;
};

// Professionals API calls
export const getProfessionals = async (): Promise<ProfessionalResponse[]> => {
  const response = await api.get('/professionals');
  return response.data;
};

export const getProfessionalProfile = async (): Promise<ProfessionalResponse> => {
  const response = await api.get('/professionals/profile');
  return response.data;
};

// Availability API calls
export const getAvailability = async (professionalId: string): Promise<any[]> => {
  const response = await api.get(`/availability/${professionalId}`);
  return response.data;
};

// Payments API calls
export const createPaymentOrder = async (data: PaymentOrderData): Promise<PaymentOrderResponse> => {
  const response = await api.post('/payments/create-order', data);
  return response.data;
};

export const verifyPayment = async (data: VerifyPaymentData): Promise<PaymentResponse> => {
  const response = await api.post('/payments/verify', data);
  return response.data;
};

export default api;
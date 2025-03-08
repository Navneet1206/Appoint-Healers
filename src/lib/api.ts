import axios from 'axios';

// Define types for API request data and responses
interface UserRegisterData {
  email: string;
  password: string;
  confirmPassword: string; // Added
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
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

interface VerifyOTPData {
  otp: string;
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

interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  createdAt: number;
}

interface VerifyOTPResponse {
  message: string;
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

// Add request interceptor for debugging and token handling
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data); // Debugging
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data); // Debugging
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API calls
export const registerUser = async (data: UserRegisterData): Promise<UserResponse> => {
  // Ensure phone number is prefixed with +91
  const formattedPhone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`;
  if (!/^\+91[0-9]{10}$/.test(formattedPhone)) {
    throw new Error('Phone number must be a valid 10-digit number starting with +91');
  }

  const formattedData = {
    ...data,
    phone: formattedPhone,
  };
  
  console.log('Formatted Data before API call:', formattedData); // Debugging
  const response = await api.post('/auth/user/register', formattedData);
  return response.data.user;
};
export const registerProfessional = async (data: ProfessionalRegisterData): Promise<UserResponse> => {
  const response = await api.post('/auth/professional/register', data);
  return response.data.user; // Adjust based on backend response structure
};

export const loginUser = async (data: LoginData): Promise<UserResponse> => {
  const response = await api.post('/auth/user/login', data);
  return response.data.user; // Adjust based on backend response structure
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get('/auth/me');
  return response.data.user; // Adjust based on backend response structure
};

// OTP Verification API calls
export const verifyEmail = async (otp: string): Promise<VerifyOTPResponse> => {
  const response = await api.post('/users/verify/email', { otp });
  return response.data;
};

export const verifyPhone = async (otp: string): Promise<VerifyOTPResponse> => {
  const response = await api.post('/users/verify/phone', { otp });
  return response.data;
};

export const resendEmailOTP = async (): Promise<VerifyOTPResponse> => {
  const response = await api.post('/users/resend/email-otp');
  return response.data;
};

export const resendPhoneOTP = async (): Promise<VerifyOTPResponse> => {
  const response = await api.post('/users/resend/phone-otp');
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
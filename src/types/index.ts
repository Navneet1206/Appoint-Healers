// User types
export interface User {
  id: string;
  email: string;
  role: 'user' | 'professional' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  phone: string;
}

// Professional types
export interface Professional {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  availability?: Availability[];
  createdAt?: string;
}

export interface Availability {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

// Appointment types
export interface Appointment {
  id: string;
  userId: string;
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId: string | null;
  notes: string | null;
  createdAt: string;
}

// Payment types
export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'user' | 'professional';
}

export interface VerifyEmailFormData {
  token: string;
}

export interface VerifyPhoneFormData {
  otp: string;
}

export interface BookAppointmentFormData {
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}
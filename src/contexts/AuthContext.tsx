import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api'; // Import the Axios instance

// Define user type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'professional' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  phone?: string;
}

// Define types for API request data
interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string; 
  dateOfBirth?: string; 
}

interface RegisterProfessionalData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  phone: string; // Made required; adjust if backend allows optional
  dateOfBirth?: string; // Added as optional; make required if backend needs it
}

// Define response types
interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (data: RegisterUserData) => Promise<void>;
  registerProfessional: (data: RegisterProfessionalData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginProfessional: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (phone: string, otp: string) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await api.get<AuthResponse>('/auth/me');
        setUser(data.user);
      } catch (err: any) {
        console.error('Auth check error:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setError(err.response?.data?.message || 'Failed to verify session');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const registerUser = async (data: RegisterUserData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Registering user with data:', data); // Debug log

      const { data: response } = await api.post<AuthResponse>('/auth/user/register', data);

      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setUser(response.user);
    } catch (err: any) {
      console.error('Registration error:', err.response?.data); // Log full error
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register professional
  const registerProfessional = async (data: RegisterProfessionalData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Registering professional with data:', data); // Debug log

      const { data: response } = await api.post<AuthResponse>('/auth/professional/register', data);

      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setUser(response.user);
    } catch (err: any) {
      console.error('Registration error:', err.response?.data); // Log full error
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generic login (defaults to user login)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/auth/user/login', { email, password });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user (specific endpoint)
  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/auth/user/login', { email, password });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login professional (specific endpoint)
  const loginProfessional = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/auth/professional/login', { email, password });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/auth/verify-email', { token });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify phone
  const verifyPhone = async (phone: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/auth/verify-phone', { phone, otp });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Phone verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/auth/logout');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    registerUser,
    registerProfessional,
    login,
    loginUser,
    loginProfessional,
    logout,
    verifyEmail,
    verifyPhone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
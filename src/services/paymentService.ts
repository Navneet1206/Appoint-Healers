import api from '../lib/api';

// Create Razorpay order
export const createOrder = async (orderData: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: any;
}) => {
  const { data } = await api.post('/payments/create-order', orderData);
  return data;
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  appointmentId: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
}) => {
  const { data } = await api.post('/payments/verify', paymentData);
  return data;
};

// Get all payments for logged in user
export const getPayments = async () => {
  const { data } = await api.get('/payments');
  return data;
};
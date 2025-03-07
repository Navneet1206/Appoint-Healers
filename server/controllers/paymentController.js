import Payment from '../models/paymentModel.js';
import Appointment from '../models/appointmentModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Initialize Razorpay
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    if (!amount || !receipt) {
      return res.status(400).json({ error: 'Amount and receipt are required' });
    }
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
      return res.status(400).json({ error: 'All payment details are required' });
    }
    
    // Verify the payment signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
      
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user is authorized
    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Create payment record
    const payment = await Payment.create({
      appointment: appointmentId,
      user: req.user._id,
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      status: 'completed',
      paymentMethod: req.body.paymentMethod || 'card',
      transactionId: razorpay_payment_id,
    });
    
    // Update appointment with payment ID and status
    appointment.payment = payment._id;
    appointment.status = 'confirmed';
    await appointment.save();
    
    res.status(200).json({ 
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      payment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// @desc    Get all payments for logged in user
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    let payments;
    
    if (req.user.role === 'user') {
      // Regular users can only see their own payments
      payments = await Payment.find({ user: req.user._id })
        .populate({
          path: 'appointment',
          populate: {
            path: 'professional',
            select: 'name specialization'
          }
        })
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      // Admins can see all payments
      payments = await Payment.find({})
        .populate('user', 'email')
        .populate({
          path: 'appointment',
          populate: {
            path: 'professional',
            select: 'name specialization'
          }
        })
        .sort({ createdAt: -1 });
    }
    
    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
import Appointment from '../models/appointmentModel.js';
import Professional from '../models/professionalModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  try {
    const { professionalId, date, startTime, endTime, notes } = req.body;
    
    // Check if professional exists
    const professional = await Professional.findById(professionalId);
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      user: req.user._id,
      professional: professionalId,
      date,
      startTime,
      endTime,
      notes,
      status: 'pending',
    });
    
    // Populate professional and user details for the response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('professional', 'name specialization hourlyRate')
      .populate('user', 'email phone');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all appointments for logged in user
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'user') {
      // Regular users can only see their own appointments
      appointments = await Appointment.find({ user: req.user._id })
        .populate('professional', 'name specialization hourlyRate')
        .populate('user', 'email phone')
        .populate('payment')
        .sort({ date: 1 });
    } else if (req.user.role === 'professional') {
      // Professionals can see appointments booked with them
      const professional = await Professional.findOne({ user: req.user._id });
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional profile not found' });
      }
      
      appointments = await Appointment.find({ professional: professional._id })
        .populate('professional', 'name specialization hourlyRate')
        .populate('user', 'email phone')
        .populate('payment')
        .sort({ date: 1 });
    } else if (req.user.role === 'admin') {
      // Admins can see all appointments
      appointments = await Appointment.find({})
        .populate('professional', 'name specialization hourlyRate')
        .populate('user', 'email phone')
        .populate('payment')
        .sort({ date: 1 });
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('professional', 'name specialization hourlyRate')
      .populate('user', 'email phone')
      .populate('payment');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user is authorized to view this appointment
    if (
      req.user.role === 'user' && appointment.user._id.toString() !== req.user._id.toString() ||
      req.user.role === 'professional' && appointment.professional.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('professional', 'name specialization hourlyRate user')
      .populate('user', 'email phone');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user is authorized to update this appointment
    const isProfessionalOwner = req.user.role === 'professional' && 
      appointment.professional.user.toString() === req.user._id.toString();
    
    if (
      req.user.role === 'user' && appointment.user._id.toString() !== req.user._id.toString() &&
      !isProfessionalOwner &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Update appointment status
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    
    // If appointment is confirmed, send confirmation email
    if (status === 'confirmed') {
      // Format date and time
      const date = new Date(appointment.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const startTime = appointment.startTime.substring(0, 5);
      const endTime = appointment.endTime.substring(0, 5);
      
      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: appointment.user.email,
        subject: 'Your Appointment Confirmation - SAVAYAS HEALS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a9d8e;">SAVAYAS HEALS</h2>
            <p>Your appointment has been confirmed!</p>
            <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details</h3>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
              <p><strong>Professional:</strong> ${appointment.professional.name}</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
            <p>Please arrive 5 minutes before your scheduled time. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            <p>Best regards,<br>The SAVAYAS HEALS Team</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
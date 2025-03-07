import Availability from '../models/availabilityModel.js';
import Professional from '../models/professionalModel.js';

// @desc    Get availability for a professional
// @route   GET /api/availability/:professionalId
// @access  Public
export const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ professional: req.params.professionalId });
    res.json(availability);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create or update availability
// @route   POST /api/availability
// @access  Private/Professional
export const createAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, isAvailable } = req.body;
    
    // Get professional ID for the logged-in user
    const professional = await Professional.findOne({ user: req.user._id });
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }
    
    // Check if availability already exists for this day
    const existingAvailability = await Availability.findOne({
      professional: professional._id,
      dayOfWeek,
    });
    
    if (existingAvailability) {
      // Update existing availability
      existingAvailability.startTime = startTime;
      existingAvailability.endTime = endTime;
      existingAvailability.isAvailable = isAvailable;
      
      const updatedAvailability = await existingAvailability.save();
      res.json(updatedAvailability);
    } else {
      // Create new availability
      const availability = await Availability.create({
        professional: professional._id,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable,
      });
      
      res.status(201).json(availability);
    }
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete availability
// @route   DELETE /api/availability/:id
// @access  Private/Professional
export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }
    
    // Get professional ID for the logged-in user
    const professional = await Professional.findOne({ user: req.user._id });
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }
    
    // Check if user is the owner of the availability or an admin
    if (availability.professional.toString() !== professional._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    await availability.deleteOne();
    
    res.json({ message: 'Availability removed' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
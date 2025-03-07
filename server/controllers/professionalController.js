import Professional from '../models/professionalModel.js';
import User from '../models/userModel.js';

// @desc    Get all professionals
// @route   GET /api/professionals
// @access  Public
export const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find({}).populate('user', 'email phone');
    res.json(professionals);
  } catch (error) {
    console.error('Get professionals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get professional by ID
// @route   GET /api/professionals/:id
// @access  Public
export const getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id).populate('user', 'email phone');
    
    if (professional) {
      res.json(professional);
    } else {
      res.status(404).json({ error: 'Professional not found' });
    }
  } catch (error) {
    console.error('Get professional error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create professional profile
// @route   POST /api/professionals
// @access  Private
export const createProfessional = async (req, res) => {
  try {
    const { name, specialization, bio, hourlyRate } = req.body;
    
    // Check if user already has a professional profile
    const existingProfile = await Professional.findOne({ user: req.user._id });
    
    if (existingProfile) {
      return res.status(400).json({ error: 'Professional profile already exists for this user' });
    }
    
    // Check if user has the professional role
    const user = await User.findById(req.user._id);
    
    if (user.role !== 'professional' && user.role !== 'admin') {
      // Update user role to professional
      user.role = 'professional';
      await user.save();
    }
    
    // Create professional profile
    const professional = await Professional.create({
      user: req.user._id,
      name,
      specialization,
      bio,
      hourlyRate,
    });
    
    res.status(201).json(professional);
  } catch (error) {
    console.error('Create professional error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update professional profile
// @route   PUT /api/professionals/:id
// @access  Private
export const updateProfessional = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    // Check if user is the owner of the profile or an admin
    if (professional.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Update fields
    professional.name = req.body.name || professional.name;
    professional.specialization = req.body.specialization || professional.specialization;
    professional.bio = req.body.bio || professional.bio;
    professional.hourlyRate = req.body.hourlyRate || professional.hourlyRate;
    
    const updatedProfessional = await professional.save();
    
    res.json(updatedProfessional);
  } catch (error) {
    console.error('Update professional error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get professional profile for logged in user
// @route   GET /api/professionals/profile
// @access  Private
export const getProfessionalProfile = async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    
    if (professional) {
      res.json(professional);
    } else {
      res.status(404).json({ error: 'Professional profile not found' });
    }
  } catch (error) {
    console.error('Get professional profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
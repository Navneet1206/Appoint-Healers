import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor to create a slot
const createSlot = async (req, res) => {
  try {
    console.log("Create slot request received:", req.body);
    const { docId, slotDate, slotTime, description, sessionType } = req.body;

    if (!docId) {
      console.log("No doctor ID provided");
      return res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
    }

    const doctor = await doctorModel.findById(docId);
    console.log("Doctor found:", doctor ? "Yes" : "No");

    if (!doctor) {
      console.log("Doctor not found with ID:", docId);
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Check for duplicate slot (same date and time)
    const exists = doctor.slots.some(
      (slot) => slot.slotDate === slotDate && slot.slotTime === slotTime
    );

    if (exists) {
      console.log("Duplicate slot found");
      return res
        .status(400)
        .json({ success: false, message: "Slot already exists" });
    }

    console.log("Adding new slot to doctor");
    doctor.slots.push({
      slotDate,
      slotTime,
      description,
      sessionType: sessionType || "video",
      status: "Active",
    });

    console.log("Saving doctor with new slot");
    await doctor.save();

    console.log("Slot created successfully");
    res.json({
      success: true,
      message: "Slot created successfully",
    });
  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for doctor to update a slot (status, description, and session type)
const updateSlot = async (req, res) => {
  try {
    const { docId, slotId, status, description, sessionType } = req.body;
    const doctor = await doctorModel.findById(docId);
    if (!doctor)
      return res.json({ success: false, message: "Doctor not found" });

    // Find the slot by its id (subdocument id)
    const slot = doctor.slots.id(slotId);
    if (!slot) {
      return res.json({ success: false, message: "Slot not found" });
    }

    if (status) slot.status = status;
    if (description !== undefined) slot.description = description;
    if (sessionType) slot.sessionType = sessionType;

    await doctor.save();
    res.json({ success: true, message: "Slot updated successfully", slot });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor to get their slots
const getSlots = async (req, res) => {
  try {
    console.log("Get slots request received:", req.body);
    const { docId } = req.body;

    if (!docId) {
      console.log("No doctor ID provided");
      return res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
    }

    const doctor = await doctorModel.findById(docId);
    console.log("Doctor found:", doctor ? "Yes" : "No");

    if (!doctor) {
      console.log("Doctor not found with ID:", docId);
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    console.log("Returning slots:", doctor.slots);
    res.json({
      success: true,
      slots: doctor.slots,
    });
  } catch (error) {
    console.error("Error getting slots:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  createSlot,
  updateSlot,
  getSlots,
};

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import professionalRequestModel from "../models/professionalRequestModel.js";
import reviewModel from "../models/reviewModel.js";
import transactionModel from "../models/transactionModel.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = new Map();

// ### Forgot Password for Doctor
const forgotPasswordDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    otpStore.set(doctor._id.toString(), { otp, type: "forgot", expiresAt });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Verification Code - SavayasHeal</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
                .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .header { text-align: center; padding: 25px; background-color: #f5f8ff; }
                .content { padding: 30px; }
                .otp-container { background-color: #f0f5ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; color: #1a365d; font-weight: bold; }
                .timer { color: #e53e3e; font-weight: bold; margin-top: 10px; }
                .footer { text-align: center; font-size: 12px; color: #666; padding: 20px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>SavayasHeal</h2>
                </div>
                <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>Please use the verification code below to reset your password:</p>
                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                        <div class="timer">Expires in 10 minutes</div>
                    </div>
                    <p>If you didn’t request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2025 SavayasHeal</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgotPasswordDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Reset Doctor Password
const resetPasswordDoctor = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const storedData = otpStore.get(doctor._id.toString());
    if (
      !storedData ||
      storedData.otp !== otp ||
      storedData.type !== "forgot" ||
      Date.now() > storedData.expiresAt
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(newPassword, salt);
    await doctor.save();

    otpStore.delete(doctor._id.toString());
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPasswordDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Missing email or password" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(doctor._id.toString(), { otp, type: "login", expiresAt });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Login OTP",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your SavayasHeal Verification Code</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding:0; background-color: #f9f9f9; }
                .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .header { text-align: center; padding: 25px; background-color: #f5f8ff; }
                .content { padding: 30px; }
                .otp-container { background-color: #f0f5ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; color: #1a365d; font-weight: bold; }
                .footer { text-align: center; font-size: 12px; color: #666; padding: 20px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>SavayasHeal</h2>
                </div>
                <div class="content">
                    <h2>Verify Your Identity</h2>
                    <p>Hello,</p>
                    <p>Please use the verification code below to log in:</p>
                    <div class="otp-container">
                        <span class="otp-code">${otp}</span>
                    </div>
                    <p>Expires in 10 minutes.</p>
                </div>
                <div class="footer">
                    <p>© 2025 SavayasHeal</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email", doctorId: doctor._id });
  } catch (error) {
    console.error("Error in loginDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Verify Doctor Login OTP
const verifyLoginOtpDoctor = async (req, res) => {
  try {
    const { doctorId, otp } = req.body;
    if (!doctorId || !otp) {
      return res.json({ success: false, message: "Missing doctorId or OTP" });
    }

    const storedData = otpStore.get(doctorId);
    if (
      !storedData ||
      storedData.otp !== otp ||
      storedData.type !== "login" ||
      Date.now() > storedData.expiresAt
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ id: doctorId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    otpStore.delete(doctorId);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in verifyLoginOtpDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Doctor Appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const appointments = await appointmentModel
      .find({ docId })
      .populate("userId", "name email")
      .sort({ slotDate: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error in appointmentsDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Cancel Appointment (Doctor)
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    if (!docId || !appointmentId) {
      return res.json({ success: false, message: "Missing doctor or appointment ID" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Unauthorized or invalid appointment" });
    }

    if (appointment.cancelled || appointment.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Appointment already cancelled" });
    }

    appointment.status = "Cancelled";
    appointment.cancelled = true;
    appointment.cancelledBy = "doctor"; // Set cancelledBy to "doctor"
    await appointment.save();

    const doctor = await doctorModel.findById(docId);
    const slot = doctor.slots.id(appointment.slotId);
    if (slot) {
      slot.status = "Active";
      slot.bookedBy = null;
      await doctor.save();
    }

    const user = await userModel.findById(appointment.userId).select("-password");

    const emailTemplate = (title, body) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px;">
        <h2 style="color: #4CAF50;">${title}</h2>
        <p>${body}</p>
        <p>Best regards,<br>The SavayasHeal Team</p>
      </div>
    `;

    await Promise.all([
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: "Appointment Cancelled by Doctor",
        html: emailTemplate(
          "Appointment Cancelled",
          `Dear ${user.name},<br><br>Your appointment with ${doctor.name} on ${appointment.slotDate} at ${appointment.slotTime} has been cancelled by the doctor.<br><br>${
            appointment.payment ? "Refund will be processed within 3-7 business days." : ""
          }`
        ),
      }),
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: doctor.email,
        subject: "Appointment Cancellation Confirmation",
        html: emailTemplate(
          "Cancellation Confirmation",
          `Dear ${doctor.name},<br><br>You have cancelled the appointment with ${user.name} on ${appointment.slotDate} at ${appointment.slotTime}.`
        ),
      }),
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "Appointment Cancelled by Doctor",
        html: emailTemplate(
          "Appointment Cancelled",
          `Doctor: ${doctor.name}<br>User: ${user.name}<br>Date: ${appointment.slotDate} at ${appointment.slotTime}`
        ),
      }),
    ]);

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error("Error in appointmentCancel:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Complete Appointment (Doctor)
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    if (!docId || !appointmentId) {
      return res.json({ success: false, message: "Missing doctor or appointment ID" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.json({ success: false, message: "Unauthorized or invalid appointment" });
    }

    if (appointment.isCompleted || appointment.cancelled) {
      return res.json({ success: false, message: "Appointment already completed or cancelled" });
    }

    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment completed" });
  } catch (error) {
    console.error("Error in appointmentComplete:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get All Doctors List
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email").limit(50);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error in doctorList:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Change Doctor Availability
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({ success: true, message: `Availability set to ${doctor.available ? "Available" : "Not Available"}` });
  } catch (error) {
    console.error("Error in changeAvailablity:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Doctor Profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const profileData = await doctorModel.findById(docId).select("-password").populate("slots");
    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.error("Error in doctorProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available, about } = req.body;
    const imageFile = req.file;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (fees && (isNaN(fees) || fees < 0)) {
      return res.json({ success: false, message: "Invalid fees value" });
    }

    doctor.fees = fees || doctor.fees;
    doctor.available = available !== undefined ? available : doctor.available;
    doctor.about = about || doctor.about;

    if (address) {
      try {
        doctor.address = JSON.parse(address);
      } catch {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "savayas_heal/banners",
      });
      doctor.bannerImage = imageUpload.secure_url;
    }

    await doctor.save();
    const updatedDoctor = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, message: "Profile updated", profileData: updatedDoctor });
  } catch (error) {
    console.error("Error in updateDoctorProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Doctor Dashboard Data
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const appointments = await appointmentModel.find({ docId }).populate("userId", "name");
    const patientSet = new Set();

    const earnings = appointments.reduce((sum, item) => {
      if (item.isCompleted && !item.cancelled) {
        patientSet.add(item.userId.toString());
        return sum + (item.discountedAmount || item.originalAmount || 0);
      }
      return sum;
    }, 0);

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments.slice(0, 5).sort((a, b) => new Date(b.slotDate) - new Date(a.slotDate)),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error in doctorDashboard:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Create a Slot
const createSlot = async (req, res) => {
  try {
    const { docId, slotDate, slotTime, description } = req.body;
    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate slotDate (e.g., DD_MM_YYYY) and slotTime (e.g., HH:MM)
    const datePattern = /^\d{2}_\d{2}_\d{4}$/;
    const timePattern = /^\d{2}:\d{2}$/;
    if (!datePattern.test(slotDate) || !timePattern.test(slotTime)) {
      return res.json({ success: false, message: "Invalid date or time format" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Check for slot conflicts
    const slotExists = doctor.slots.some(
      (slot) => slot.slotDate === slotDate && slot.slotTime === slotTime
    );
    if (slotExists) {
      return res.json({ success: false, message: "Slot already exists" });
    }

    // Validate future date
    const [day, month, year] = slotDate.split("_").map(Number);
    const slotDateObj = new Date(year, month - 1, day);
    if (slotDateObj < new Date().setHours(0, 0, 0, 0)) {
      return res.json({ success: false, message: "Cannot create slot for past date" });
    }

    doctor.slots.push({ slotDate, slotTime, description: description || "", status: "Active" });
    await doctor.save();

    res.json({ success: true, message: "Slot created successfully", slots: doctor.slots });
  } catch (error) {
    console.error("Error in createSlot:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Update a Slot
const updateSlot = async (req, res) => {
  try {
    const { docId, slotId, status, description } = req.body;
    if (!docId || !slotId) {
      return res.json({ success: false, message: "Missing doctor or slot ID" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot) {
      return res.json({ success: false, message: "Slot not found" });
    }

    const validStatuses = ["Active", "Booked", "Cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    if (status) slot.status = status;
    if (description !== undefined) slot.description = description;
    await doctor.save();

    res.json({ success: true, message: "Slot updated successfully", slot });
  } catch (error) {
    console.error("Error in updateSlot:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get All Slots
const getSlots = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const sortedSlots = doctor.slots.sort((a, b) => {
      const dateA = new Date(a.slotDate.split("_").reverse().join("-"));
      const dateB = new Date(b.slotDate.split("_").reverse().join("-"));
      return dateA - dateB;
    });

    res.json({ success: true, slots: sortedSlots });
  } catch (error) {
    console.error("Error in getSlots:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Send Meeting Link (Doctor)
const sendMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;
    if (!appointmentId || !meetingLink) {
      return res.json({ success: false, message: "Missing appointment ID or meeting link" });
    }

    const appointment = await appointmentModel.findById(appointmentId).populate("userId", "name email").populate("docId", "name email");
    if (!appointment || appointment.cancelled || appointment.isCompleted) {
      return res.json({ success: false, message: "Invalid or ineligible appointment" });
    }

    const user = appointment.userId;
    const doctor = appointment.docId;

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: "Meeting Link for Your Appointment",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px;">
          <h2 style="color: #4CAF50;">Meeting Link</h2>
          <p>Dear ${user.name},</p>
          <p>Your meeting link for the appointment with ${doctor.name} (${doctor.email}) is: <a href="${meetingLink}">${meetingLink}</a></p>
          <p>Date & Time: ${appointment.slotDate} at ${appointment.slotTime}</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Meeting link sent successfully" });
  } catch (error) {
    console.error("Error in sendMeetingLink:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Accept Appointment (Doctor)
const acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID required" });
    }

    const appointment = await appointmentModel.findById(appointmentId).populate("userId", "name email").populate("docId", "name email");
    if (!appointment || appointment.cancelled || appointment.isCompleted) {
      return res.json({ success: false, message: "Invalid or ineligible appointment" });
    }

    appointment.status = "Accepted";
    await appointment.save();

    const user = appointment.userId;
    const doctor = appointment.docId;

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: "Appointment Accepted",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px;">
          <h2 style="color: #4CAF50;">Appointment Accepted</h2>
          <p>Dear ${user.name},</p>
          <p>Your appointment with ${doctor.name} (${doctor.email}) on ${appointment.slotDate} at ${appointment.slotTime} has been accepted.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Appointment accepted successfully" });
  } catch (error) {
    console.error("Error in acceptAppointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Dashboard Data (Doctor)
const getDashData = async (req, res) => {
  try {
    const doctorId = req.userId; // Assumes auth middleware
    if (!doctorId) {
      return res.json({ success: false, message: "Authentication required" });
    }

    const appointments = await appointmentModel.find({ docId: doctorId }).populate("userId", "name image");
    const earnings = appointments
      .filter((app) => app.isCompleted && !app.cancelled)
      .reduce((sum, app) => sum + (app.discountedAmount || app.originalAmount || 0), 0);
    const patients = new Set(appointments.map((app) => app.userId.toString())).size;
    const latestAppointments = appointments
      .sort((a, b) => new Date(b.slotDate) - new Date(a.slotDate))
      .slice(0, 5)
      .map((app) => ({
        ...app.toObject(),
        userData: { name: app.userId.name, image: app.userId.image },
      }));

    res.json({
      success: true,
      earnings,
      appointments: appointments.length,
      patients,
      latestAppointments,
      doctorId,
    });
  } catch (error) {
    console.error("Error in getDashData:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Submit Professional Request
const submitProfessionalRequest = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, address, languages } = req.body;
    const imageFile = req.file;

    if (!name || !email || !speciality || !degree || !experience || !about || !fees || !address || !languages || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const existing = await Promise.all([
      doctorModel.findOne({ email }),
      professionalRequestModel.findOne({ email }),
    ]);
    if (existing[0] || existing[1]) {
      return res.json({ success: false, message: "Email already in use" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "savayas_heal/professionals",
    });

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.json({ success: false, message: "Invalid address format" });
    }

    const requestData = {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: parsedAddress,
      languages: languages.split(",").map((lang) => lang.trim()),
      image: imageUpload.secure_url,
      status: "Pending",
    };

    const newRequest = new professionalRequestModel(requestData);
    await newRequest.save();

    await Promise.all([
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Professional Registration Request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #4CAF50;">SavayasHeal</h2>
            <p>Dear ${name},</p>
            <p>Your request to join as a professional is under review.</p>
            <p><strong>Details:</strong> ${name}, ${speciality}, ₹${fees}</p>
          </div>
        `,
      }),
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "New Professional Request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #4CAF50;">New Request</h2>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Speciality: ${speciality}</p>
            <p>Fees: ₹${fees}</p>
            <p>Image: <a href="${imageUpload.secure_url}">View</a></p>
          </div>
        `,
      }),
    ]);

    res.json({ success: true, message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error in submitProfessionalRequest:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Doctor's Own Reviews
const getOwnReviews = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const reviews = await reviewModel
      .find({ doctorId: docId })
      .populate("userId", "name image")
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error in getOwnReviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Get Doctor Transactions
const getDoctorTransactions = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const transactions = await transactionModel
      .find({ doctorId: docId })
      .populate("userId", "name email")
      .populate("appointmentId", "slotDate slotTime originalAmount discountedAmount")
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ success: true, transactions: transactions.length ? transactions : [] });
  } catch (error) {
    console.error("Error in getDoctorTransactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ### Update Payment Details
const updatePaymentDetails = async (req, res) => {
  try {
    const { docId, paymentDetails } = req.body;
    if (!docId || !paymentDetails) {
      return res.json({ success: false, message: "Missing doctor ID or payment details" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (paymentDetails.bankAccount) {
      const { accountNumber, ifscCode } = paymentDetails.bankAccount;
      if (!accountNumber || !ifscCode) {
        return res.json({ success: false, message: "Invalid bank details" });
      }
    }

    doctor.paymentDetails = paymentDetails;
    await doctor.save();

    res.json({ success: true, message: "Payment details updated" });
  } catch (error) {
    console.error("Error in updatePaymentDetails:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  loginDoctor,
  forgotPasswordDoctor,
  resetPasswordDoctor,
  verifyLoginOtpDoctor,
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
  sendMeetingLink,
  acceptAppointment,
  getDashData,
  submitProfessionalRequest,
  getOwnReviews,
  getDoctorTransactions,
  updatePaymentDetails,
};
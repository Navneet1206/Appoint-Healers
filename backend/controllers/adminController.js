import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import Test from "../models/testModel.js";
import Coupon from "../models/couponModel.js";
import reviewModel from "../models/reviewModel.js";
import transactionModel from "../models/transactionModel.js";
import { refundUser } from "../utils/refund.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const otpStore = new Map();

// Admin login (unchanged)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const otp = generateOTP();
    otpStore.set("admin", { otp, type: "login" });

    setTimeout(() => otpStore.delete("admin"), 10 * 60 * 1000);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Login OTP",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Savayas Heal Verification Code</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eeeeee; }
                .logo { max-width: 200px; height: auto; }
                .content { padding: 30px 20px; }
                .otp-container { background-color: #f5f8ff; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; border: 1px solid #e1e5f0; }
                .otp-code { font-size: 28px; letter-spacing: 2px; color: #2d3748; font-weight: bold; }
                .footer { text-align: center; font-size: 12px; color: #666666; padding: 20px 0; border-top: 1px solid #eeeeee; }
                .button { background-color: #4a7aff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="/api/placeholder/200/80" alt="Savayas Heal Logo" class="logo">
                </div>
                <div class="content">
                    <h2>Verify Your Identity</h2>
                    <p>Hello,</p>
                    <p>We received a request to access your Savayas Heal account. Please use the verification code below to complete the process:</p>
                    <div class="otp-container">
                        <span class="otp-code">${otp}</span>
                    </div>
                    <p>This code will expire in <strong>10 minutes</strong> for security reasons.</p>
                    <p>If you didn't request this code, please ignore this email or contact our support team immediately if you believe your account security has been compromised.</p>
                    <p>Thank you for choosing Savayas Heal for your healthcare needs.</p>
                    <p>Warm regards,<br>The Savayas Heal Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                    <p>© 2025 Savayas Heal | <a href="#">Privacy Policy</a> | <a href="#">Unsubscribe</a></p>
                    <p>123 Health Street, Wellness City, WC 12345</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify admin login OTP (unchanged)
const verifyLoginOtpAdmin = async (req, res) => {
  try {
    const { otp } = req.body;
    const storedData = otpStore.get("admin");

    if (!storedData || storedData.otp !== otp || storedData.type !== "login") {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const token = jwt.sign(
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
      process.env.JWT_SECRET
    );
    otpStore.delete("admin");

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all appointments (unchanged)
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel an appointment (updated)
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId, cancelledBy } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment already cancelled" });
    }

    appointment.cancelled = true;
    appointment.cancelledBy = cancelledBy;

    if (cancelledBy === "doctor" || cancelledBy === "admin") {
      if (appointment.payment) {
        await refundUser(appointment.userId, appointment.discountedAmount || appointment.originalAmount, appointmentId);
        appointment.refundIssued = true;
      }
    }
    await appointment.save();

    const doctor = await doctorModel.findById(appointment.docId);
    const slot = doctor.slots.id(appointment.slotId);
    if (slot) {
      slot.status = "Active";
      await doctor.save();
    }

    const userData = await userModel.findById(appointment.userId).select("-password");
    const doctorData = await doctorModel.findById(appointment.docId);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Cancelled",
      html: `
        <p>Dear ${userData.name},</p>
        <p>Your appointment with Dr. ${doctorData.name} on ${appointment.slotDate} at ${appointment.slotTime} has been cancelled by ${cancelledBy}.</p>
        ${appointment.payment && cancelledBy !== "user" ? "<p>A refund has been issued.</p>" : ""}
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Appointment Cancel Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Force refund (new)
const forceRefund = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || !appointment.payment || appointment.refundIssued) {
      return res.json({ success: false, message: "No payment to refund or already refunded" });
    }

    await refundUser(appointment.userId, appointment.discountedAmount || appointment.originalAmount, appointmentId);
    appointment.refundIssued = true;
    await appointment.save();

    const userData = await userModel.findById(appointment.userId).select("-password");
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Refund Issued",
      html: `
        <p>Dear ${userData.name},</p>
        <p>A refund of ₹${appointment.discountedAmount || appointment.originalAmount} has been issued for your appointment on ${appointment.slotDate} at ${appointment.slotTime}.</p>
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: "Refund issued successfully" });
  } catch (error) {
    console.error("Force Refund Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Change slot on behalf of doctor (new)
const adminUpdateAppointmentSlot = async (req, res) => {
  try {
    const { appointmentId, newSlotId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const doctor = await doctorModel.findById(appointment.docId);
    const newSlot = doctor.slots.id(newSlotId);

    if (!newSlot || newSlot.status !== "Active") {
      return res.json({ success: false, message: "New slot not available" });
    }

    const oldSlotId = appointment.slotId;
    appointment.slotId = newSlotId;
    appointment.slotDate = newSlot.slotDate;
    appointment.slotTime = newSlot.slotTime;
    appointment.updatedByDoctor = true;
    appointment.awaitingUserConsent = true;
    appointment.userConsent = null;
    await appointment.save();

    const oldSlot = doctor.slots.id(oldSlotId);
    if (oldSlot) {
      oldSlot.status = "Active";
    }
    newSlot.status = "Pending";
    await doctor.save();

    const userData = await userModel.findById(appointment.userId).select("-password");
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Slot Update Request",
      html: `
        <p>Dear ${userData.name},</p>
        <p>The admin has updated your appointment slot with Dr. ${doctor.name} to ${newSlot.slotDate} at ${newSlot.slotTime}.</p>
        <p>Please respond to accept or reject this change.</p>
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: "Slot updated, awaiting user consent" });
  } catch (error) {
    console.error("Admin Update Appointment Slot Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Force accept/reject slot update (new)
const adminRespondToSlotUpdate = async (req, res) => {
  try {
    const { appointmentId, consent } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || !appointment.awaitingUserConsent) {
      return res.json({ success: false, message: "Invalid request or no pending update" });
    }

    if (consent) {
      appointment.userConsent = true;
      appointment.awaitingUserConsent = false;
      const doctor = await doctorModel.findById(appointment.docId);
      const slot = doctor.slots.id(appointment.slotId);
      if (slot) {
        slot.status = "Booked";
        await doctor.save();
      }
    } else {
      appointment.userConsent = false;
      appointment.awaitingUserConsent = false;
      appointment.cancelled = true;
      appointment.cancelledBy = "admin";
      if (appointment.payment) {
        await refundUser(appointment.userId, appointment.discountedAmount || appointment.originalAmount, appointmentId);
        appointment.refundIssued = true;
      }
      const doctor = await doctorModel.findById(appointment.docId);
      const slot = doctor.slots.id(appointment.slotId);
      if (slot) {
        slot.status = "Active";
        await doctor.save();
      }
    }

    await appointment.save();

    const userData = await userModel.findById(appointment.userId).select("-password");
    const doctorData = await doctorModel.findById(appointment.docId);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: consent ? "Slot Update Forced Accepted" : "Slot Update Forced Rejected",
      html: `
        <p>Dear ${userData.name},</p>
        <p>The admin has ${consent ? "accepted" : "rejected"} the slot update for your appointment with Dr. ${doctorData.name} on ${appointment.slotDate} at ${appointment.slotTime}.</p>
        ${!consent && appointment.payment ? "<p>A refund has been issued.</p>" : ""}
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: "Response recorded successfully" });
  } catch (error) {
    console.error("Admin Respond To Slot Update Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Add a doctor (unchanged)
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      languages,
      specialityList,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !languages
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      specialityList: specialityList.split(",").map((item) => item.trim()),
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      languages: languages.split(",").map((item) => item.trim()),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all doctors (unchanged)
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin dashboard data (unchanged)
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Complete an appointment (unchanged)
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true }
    );

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment completed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add a test (unchanged)
const addTest = async (req, res) => {
  try {
    const { title, description, category, subCategory, questions, resultRanges } = req.body;

    if (!title || !category || !subCategory || !questions || !resultRanges) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newTest = new Test({ title, description, category, subCategory, questions, resultRanges });
    await newTest.save();

    res.status(201).json({ success: true, message: "Test added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tests (unchanged)
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json({ success: true, tests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update a test (unchanged)
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const test = await Test.findByIdAndUpdate(id, updatedData, { new: true });
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, message: "Test updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a test (unchanged)
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a coupon (unchanged)
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;

    if (!code || !discountPercentage || !expirationDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newCoupon = new Coupon({ code, discountPercentage, expirationDate });
    await newCoupon.save();

    res.status(201).json({ success: true, message: "Coupon created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons (unchanged)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon by ID (unchanged)
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a coupon (unchanged)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, expirationDate } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountPercentage, expirationDate, updatedAt: Date.now() },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a coupon (unchanged)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Post a fake review (unchanged)
const postFakeReview = async (req, res) => {
  try {
    const { doctorId, rating, comment, userName } = req.body;

    if (!doctorId || !rating || !userName) {
      return res.json({
        success: false,
        message: "Doctor ID, rating, and user name are required",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const newReview = new reviewModel({
      doctorId,
      rating,
      comment,
      isFake: true,
      fakeUserName: userName,
      timestamp: Date.now(),
    });
    await newReview.save();

    res.json({ success: true, message: "Fake review posted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all transactions (unchanged)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find({})
      .populate("userId", "name email")
      .populate("doctorId", "name email")
      .populate("appointmentId", "slotDate slotTime couponCode originalAmount discountedAmount")
      .sort({ timestamp: -1 });

    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        transactions: [],
        message: "No transactions found",
      });
    }

    res.json({ success: true, transactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transactions",
    });
  }
};

// Send meeting link (unchanged)
const sendMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink, meetingPassword } = req.body;

    if (!appointmentId || !meetingLink) {
      return res.json({ success: false, message: "Appointment ID and meeting link are required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment is cancelled" });
    }

    if (appointment.isCompleted) {
      return res.json({ success: false, message: "Appointment is already completed" });
    }

    appointment.meetingLink = meetingLink;
    if (meetingPassword) {
      appointment.meetingPassword = meetingPassword;
    }
    await appointment.save();

    const userData = await userModel.findById(appointment.userId).select("-password");
    const doctorData = await doctorModel.findById(appointment.docId);

    const userMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Meeting Details",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Meeting Details for Your Appointment</h2>
          </div>
          <p>Dear ${userData.name},</p>
          <p>Here are the meeting details for your appointment with Dr. ${doctorData.name}:</p>
          <p>Date: ${appointment.slotDate}</p>
          <p>Time: ${appointment.slotTime}</p>
          <p>Meeting Link: <a href="${appointment.meetingLink}">${appointment.meetingLink}</a></p>
          ${appointment.meetingPassword ? `<p>Password: ${appointment.meetingPassword}</p>` : ""}
          <p>Please join the meeting at the scheduled time.</p>
          <p>Best regards,</p>
          <p>The Savayas Heals Team</p>
        </div>
      `,
    };

    const doctorMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctorData.email,
      subject: "Appointment Meeting Details",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Meeting Details for Appointment</h2>
          </div>
          <p>Dear Dr. ${doctorData.name},</p>
          <p>Here are the meeting details for your appointment with ${userData.name}:</p>
          <p>Date: ${appointment.slotDate}</p>
          <p>Time: ${appointment.slotTime}</p>
          <p>Meeting Link: <a href="${appointment.meetingLink}">${appointment.meetingLink}</a></p>
          ${appointment.meetingPassword ? `<p>Password: ${appointment.meetingPassword}</p>` : ""}
          <p>Please be ready to join the meeting at the scheduled time.</p>
          <p>Best regards,</p>
          <p>The Savayas Heals Team</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(doctorMailOptions),
    ]);

    res.json({ success: true, message: "Meeting link sent successfully" });
  } catch (error) {
    console.error("Send Meeting Link Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  verifyLoginOtpAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  completeAppointment,
  addTest,
  getTests,
  updateTest,
  deleteTest,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  postFakeReview,
  getAllTransactions,
  sendMeetingLink,
  forceRefund,               
  adminUpdateAppointmentSlot, 
  adminRespondToSlotUpdate,   
};
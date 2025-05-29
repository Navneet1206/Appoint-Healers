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
import { refundUser } from "../utils/refund.js";

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

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const otpStore = new Map();

// Forgot password for doctor
const forgotPasswordDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const otp = generateOTP();
    otpStore.set(doctor._id.toString(), { otp, type: "forgot" });

    setTimeout(() => otpStore.delete(doctor._id.toString()), 10 * 60 * 1000);

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
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9f9f9; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .header { text-align: center; padding: 25px 0; background-color: #f5f8ff; border-bottom: 1px solid #e1e5f0; }
                .logo { max-width: 180px; height: auto; }
                .content { padding: 30px 25px; }
                .otp-container { background-color: #f0f5ff; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; border: 1px solid #d0d9f0; }
                .otp-code { font-size: 32px; letter-spacing: 3px; color: #1a365d; font-weight: bold; font-family: 'Courier New', monospace; }
                .timer { color: #e53e3e; font-weight: bold; margin-top: 10px; }
                .instructions { background-color: #fffbeb; border-left: 4px solid #f6ad55; padding: 12px 15px; margin: 20px 0; font-size: 14px; }
                .footer { text-align: center; font-size: 12px; color: #666666; padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eeeeee; }
                .help-text { font-size: 13px; color: #718096; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #e2e8f0; }
                .button { background-color: #4a7aff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="/api/placeholder/180/60" alt="SavayasHeal Logo" class="logo">
                </div>
                <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset the password for your SavayasHeal account. To verify your identity and proceed with the password reset, please use the verification code below:</p>
                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                        <div class="timer">Expires in 10 minutes</div>
                    </div>
                    <div class="instructions">
                        <strong>How to reset your password:</strong>
                        <ol style="margin-top: 5px; padding-left: 20px;">
                            <li>Enter the verification code shown above on the password reset page</li>
                            <li>Create your new password following our security guidelines</li>
                            <li>Submit to complete the password reset process</li>
                        </ol>
                    </div>
                    <p>If you didn't request a password reset, please ignore this email or <a href="https://savayasheal.com/contact">contact our support team</a> immediately as someone may be attempting to access your account.</p>
                    <div class="help-text">
                        <p>For security reasons, this password reset link will expire in 10 minutes. If you need assistance, please visit our <a href="https://savayasheal.com/help">Help Center</a> or contact our support team.</p>
                    </div>
                    <p>Thank you,<br>The SavayasHeal Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message from SavayasHeal.com. Please do not reply to this email.</p>
                    <p>© 2025 SavayasHeal.com | <a href="https://savayasheal.com/privacy">Privacy Policy</a> | <a href="https://savayasheal.com/terms">Terms of Service</a></p>
                    <p>SavayasHeal Inc., 123 Wellness Avenue, Suite 200, Health City, HC 12345</p>
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

// Reset doctor password
const resetPasswordDoctor = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const storedData = otpStore.get(doctor._id.toString());
    if (!storedData || storedData.otp !== otp || storedData.type !== "forgot") {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    doctor.password = hashedPassword;
    await doctor.save();

    otpStore.delete(doctor._id.toString());

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const otp = generateOTP();
    otpStore.set(doctor._id.toString(), { otp, type: "login" });

    setTimeout(() => otpStore.delete(doctor._id.toString()), 10 * 60 * 1000);

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

    res.json({
      success: true,
      message: "OTP sent to your email",
      doctorId: doctor._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify doctor login OTP
const verifyLoginOtpDoctor = async (req, res) => {
  try {
    const { doctorId, otp } = req.body;
    const storedData = otpStore.get(doctorId);

    if (!storedData || storedData.otp !== otp || storedData.type !== "login") {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ id: doctorId }, process.env.JWT_SECRET);
    otpStore.delete(doctorId);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor appointments
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

// Cancel an appointment
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== docId) {
      return res.json({ success: false, message: "Unauthorized or invalid appointment" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment already cancelled" });
    }

    appointment.cancelled = true;
    appointment.cancelledBy = "doctor";
    let refundMessage = "";
    if (appointment.payment) {
      try {
        await refundUser(appointment.userId, appointment.discountedAmount || appointment.originalAmount, appointmentId);
        appointment.refundIssued = true;
        refundMessage = " A refund has been issued to your account.";
      } catch (refundError) {
        console.error("Refund failed:", refundError.message);
        refundMessage = " Refund could not be processed at this time. Our team has been notified.";
        // Proceed with cancellation even if refund fails
      }
    }
    await appointment.save();

    const doctor = await doctorModel.findById(docId);
    const slot = doctor.slots.id(appointment.slotId);
    if (slot) {
      slot.status = "Active";
      await doctor.save();
    }

    const userData = await userModel.findById(appointment.userId).select("-password");
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Cancelled by Doctor",
      html: `
        <p>Dear ${userData.name},</p>
        <p>Your appointment with Dr. ${doctor.name} on ${appointment.slotDate} at ${appointment.slotTime} has been cancelled by the doctor.</p>
        <p>${refundMessage}</p>
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: `Appointment cancelled successfully.${refundMessage}` });
  } catch (error) {
    console.error("Appointment Cancel Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update appointment slot
const updateAppointmentSlot = async (req, res) => {
  try {
    const { docId, appointmentId, newSlotId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== docId) {
      return res.json({ success: false, message: "Unauthorized or invalid appointment" });
    }

    if (appointment.cancelled || appointment.isCompleted) {
      return res.json({ success: false, message: "Cannot update cancelled or completed appointment" });
    }

    const doctor = await doctorModel.findById(docId);
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
        <p>Dr. ${doctor.name} has requested to update your appointment slot from ${appointment.slotDate} at ${appointment.slotTime} to ${newSlot.slotDate} at ${newSlot.slotTime}.</p>
        <p>Please respond to accept or reject this change.</p>
        <p>Best regards,<br>Savayas Heal Team</p>
      `,
    });

    res.json({ success: true, message: "Slot updated, awaiting user consent" });
  } catch (error) {
    console.error("Update Appointment Slot Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Complete an appointment
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.docId.toString() !== docId) {
      return res.json({
        success: false,
        message: "Unauthorized or invalid appointment",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all doctors list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Change doctor availability
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available, about } = req.body;
    const imageFile = req.file;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.fees = fees;
    doctor.available = available;
    doctor.about = about;

    if (address) {
      doctor.address = JSON.parse(address);
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

    res.json({
      success: true,
      message: "Profile Updated",
      profileData: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.originalAmount || item.amount;
      }
    });

    const patients = [
      ...new Set(appointments.map((item) => item.userId.toString())),
    ];

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

// Create a slot
const createSlot = async (req, res) => {
  try {
    const { docId, slotDate, slotTime, description } = req.body;
    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const exists = doctor.slots.some(
      (slot) => slot.slotDate === slotDate && slot.slotTime === slotTime
    );
    if (exists) {
      return res.json({ success: false, message: "Slot already exists" });
    }

    doctor.slots.push({ slotDate, slotTime, description, status: "Active" });
    await doctor.save();

    res.json({
      success: true,
      message: "Slot created successfully",
      slots: doctor.slots,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update a slot
const updateSlot = async (req, res) => {
  try {
    const { docId, slotId, status, description } = req.body;
    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot) {
      return res.json({ success: false, message: "Slot not found" });
    }

    slot.status = status;
    if (description !== undefined) slot.description = description;

    await doctor.save();

    res.json({ success: true, message: "Slot updated successfully", slot });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all slots
const getSlots = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, slots: doctor.slots });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Submit professional request
const submitProfessionalRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      languages,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !languages ||
      !imageFile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "savayas_heal/professionals",
    });
    const imageUrl = imageUpload.secure_url;

    const parsedAddress = JSON.parse(address);

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
      image: imageUrl,
      status: "Pending",
    };

    const newRequest = new professionalRequestModel(requestData);
    await newRequest.save();

    await Promise.all([
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Professional Registration Request - Savayas Heal",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50;">Savayas Heal</h2>
            <p>Dear ${name},</p>
            <p>Thank you for submitting your request to join Savayas Heal as a professional. Your request is under review, and we will notify you once a decision is made.</p>
            <p><strong>Details Submitted:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Speciality:</strong> ${speciality}</li>
              <li><strong>Degree:</strong> ${degree}</li>
              <li><strong>Experience:</strong> ${experience}</li>
              <li><strong>Fees:</strong> ₹${fees}</li>
            </ul>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,</p>
            <p><strong>Savayas Heal Team</strong></p>
          </div>
        `,
      }),
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "New Professional Registration Request - Savayas Heal",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50;">New Professional Request</h2>
            <p>A new professional has submitted a registration request. Please review the details below:</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Speciality:</strong> ${speciality}</li>
              <li><strong>Degree:</strong> ${degree}</li>
              <li><strong>Experience:</strong> ${experience}</li>
              <li><strong>About:</strong> ${about}</li>
              <li><strong>Fees:</strong> ₹${fees}</li>
              <li><strong>Address:</strong> ${parsedAddress.line1}, ${parsedAddress.line2}</li>
              <li><strong>Languages:</strong> ${languages}</li>
              <li><strong>Image:</strong> <a href="${imageUrl}">View Image</a></li>
            </ul>
            <p>Please take appropriate action to approve or reject this request.</p>
            <p>Best regards,</p>
            <p><strong>Savayas Heal System</strong></p>
          </div>
        `,
      }),
    ]);

    res.json({
      success: true,
      message:
        "Request submitted successfully. You will be notified via email.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor's own reviews
const getOwnReviews = async (req, res) => {
  try {
    const { docId } = req.body;
    const reviews = await reviewModel
      .find({ doctorId: docId })
      .populate("userId", "name image")
      .sort({ timestamp: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get doctor transactions
const getDoctorTransactions = async (req, res) => {
  try {
    const doctorId = req.body.docId;
    const transactions = await transactionModel
      .find({ doctorId })
      .populate("userId", "name email")
      .populate(
        "appointmentId",
        "slotDate slotTime couponCode originalAmount discountedAmount"
      )
      .sort({ timestamp: -1 });

    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        transactions: [],
        message: "No transactions found for this doctor",
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

// Update payment details
const updatePaymentDetails = async (req, res) => {
  try {
    const { docId, paymentDetails } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(
      docId,
      { paymentDetails },
      { new: true }
    );
    if (!doctor)
      return res.json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Payment details updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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
  submitProfessionalRequest,
  getOwnReviews,
  getDoctorTransactions,
  updatePaymentDetails,
  updateAppointmentSlot,
};
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import Test from "../models/testModel.js";
import Coupon from '../models/couponModel.js';
import reviewModel from "../models/reviewModel.js";

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpStore = new Map();

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const otp = generateOTP();
      otpStore.set("admin", { otp, type: "login" });

      setTimeout(() => {
        otpStore.delete("admin");
      }, 10 * 60 * 1000);

      await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "Login OTP",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Savayas Heal Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .logo {
            max-width: 200px;
            height: auto;
        }
        .content {
            padding: 30px 20px;
        }
        .otp-container {
            background-color: #f5f8ff;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #e1e5f0;
        }
        .otp-code {
            font-size: 28px;
            letter-spacing: 2px;
            color: #2d3748;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            padding: 20px 0;
            border-top: 1px solid #eeeeee;
        }
        .button {
            background-color: #4a7aff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin-top: 15px;
        }
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
</html>`,
      });

      res.json({ success: true, message: "OTP sent to your email" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyLoginOtpAdmin = async (req, res) => {
  try {
    const { otp } = req.body;
    const storedData = otpStore.get("admin");
    if (!storedData || storedData.otp !== otp || storedData.type !== "login") {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const token = jwt.sign(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD, process.env.JWT_SECRET);

    otpStore.delete("admin");

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address, languages, specialityList } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !languages) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality: speciality,
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

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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

const sendMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const userEmail = appointment.userData.email;
    const userName = appointment.userData.name;
    const doctorEmail = appointment.docData.email;
    const doctorName = appointment.docData.name;

    const userMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: "Meeting Link for Your Appointment",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Meeting Link</h2>
          </div>
          <p>Dear ${userName},</p>
          <p>Your meeting link for the appointment with ${doctorName} (${doctorEmail}) is: ${meetingLink}</p>
          <p>Date & Time: ${appointment.slotDate} at ${appointment.slotTime}</p>
          <p>Thank you for choosing our services.</p>
          <p>Best regards,</p>
          <p>The SAVAYAS HEALS Team</p>
        </div>
      `,
    };

    const doctorMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctorEmail,
      subject: "Meeting Link for Appointment",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Meeting Link</h2>
          </div>
          <p>Dear ${doctorName},</p>
          <p>The meeting link for your appointment with ${userName} (${userEmail}) is: ${meetingLink}</p>
          <p>Date & Time: ${appointment.slotDate} at ${appointment.slotTime}</p>
          <p>Best regards,</p>
          <p>The SAVAYAS HEALS Team</p>
        </div>
      `,
    };

    const sendUserEmail = new Promise((resolve, reject) => {
      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to user:", error);
          reject(error);
        } else {
          console.log("Email sent to user:", info.response);
          resolve(info);
        }
      });
    });

    const sendDoctorEmail = new Promise((resolve, reject) => {
      transporter.sendMail(doctorMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to doctor:", error);
          reject(error);
        } else {
          console.log("Email sent to doctor:", info.response);
          resolve(info);
        }
      });
    });

    await Promise.all([sendUserEmail, sendDoctorEmail]);
    res.json({ success: true, message: "Meeting link sent to both user and doctor" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const userEmail = appointment.userData.email;
    const userName = appointment.userData.name;
    const doctorEmail = appointment.docData.email;
    const doctorName = appointment.docData.name;

    const userMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: "Appointment Accepted",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Appointment Accepted</h2>
          </div>
          <p>Dear ${userName},</p>
          <p>Your appointment with ${doctorName} (${doctorEmail}) has been accepted.</p>
          <p>Date & Time: ${appointment.slotDate} at ${appointment.slotTime}</p>
          <p>Thank you for choosing our services.</p>
          <p>Best regards,</p>
          <p>The SAVAYAS HEALS Team</p>
        </div>
      `,
    };

    const doctorMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctorEmail,
      subject: "Appointment Accepted",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Appointment Accepted</h2>
          </div>
          <p>Dear ${doctorName},</p>
          <p>The appointment with ${userName} (${userEmail}) has been accepted.</p>
          <p>Date & Time: ${appointment.slotDate} at ${appointment.slotTime}</p>
          <p>Best regards,</p>
          <p>The SAVAYAS HEALS Team</p>
        </div>
      `,
    };

    const sendUserEmail = new Promise((resolve, reject) => {
      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to user:", error);
          reject(error);
        } else {
          console.log("Email sent to user:", info.response);
          resolve(info);
        }
      });
    });

    const sendDoctorEmail = new Promise((resolve, reject) => {
      transporter.sendMail(doctorMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to doctor:", error);
          reject(error);
        } else {
          console.log("Email sent to doctor:", info.response);
          resolve(info);
        }
      });
    });

    await Promise.all([sendUserEmail, sendDoctorEmail]);
    res.json({ success: true, message: "Notifications sent to both user and doctor" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Update the appointment to mark it as completed
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true } // Returns the updated document
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

const addTest = async (req, res) => {
  try {
    const { title, description, category, subCategory, questions, resultRanges } = req.body;
    if (!title || !category || !subCategory || !questions || !resultRanges) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const newTest = new Test({ title, description, category, subCategory, questions, resultRanges });
    await newTest.save();
    res.status(201).json({ success: true, message: 'Test added successfully' });
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json({ success: true, tests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const test = await Test.findByIdAndUpdate(id, updatedData, { new: true });
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.json({ success: true, message: 'Test updated successfully' });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByIdAndDelete(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    if (!code || !discountPercentage || !expirationDate) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const newCoupon = new Coupon({ code, discountPercentage, expirationDate });
    await newCoupon.save();
    res.status(201).json({ success: true, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a coupon
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
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, message: 'Coupon updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const postFakeReview = async (req, res) => {
  try {
    const { doctorId, rating, comment, userName } = req.body;
    if (!doctorId || !rating || !userName) {
      return res.json({ success: false, message: "Doctor ID, rating, and user name are required" });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be an integer between 1 and 5" });
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



export {
  loginAdmin,
  verifyLoginOtpAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  acceptAppointment,
  sendMeetingLink,
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
};
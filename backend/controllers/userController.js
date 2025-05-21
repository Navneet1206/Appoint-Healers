import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Test from "../models/testModel.js";
import UserTestResult from "../models/userTestResultModel.js";
import reviewModel from "../models/reviewModel.js";
import Coupon from "../models/couponModel.js";
import transactionModel from "../models/transactionModel.js";
import mongoose from "mongoose";
import crypto from "crypto";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const verificationCodes = new Map();
const resetOtps = new Map();
const otpVerified = new Map();

// Generate email template
const generateEmailTemplate = (title, body) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Savayas Heals</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff5f7;">
      <div style="max-width: 600px; margin: 30px auto; border: 1px solid #ffe0e6; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #ff5e8e; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">SAVAYAS HEALS</h1>
          </div>
          <div style="padding: 30px; color: #333;">
              <h2 style="color: #ff5e8e; margin-top: 0; font-size: 24px;">${title}</h2>
              <p style="font-size: 16px; line-height: 1.5;">${body}</p>
              <div style="background-color: #ffe0e6; padding: 15px; border-radius: 5px; margin: 20px 0; color: #ff5e8e; font-style: italic;">
                  "${body.split("<br>")[0]}"
              </div>
              <p style="font-size: 16px; line-height: 1.5;">
                  If you have any urgent queries, please feel free to call us at <strong>(91) 8468938745</strong>.
              </p>
              <p style="font-size: 16px; line-height: 1.5; margin: 30px 0 0;">
                  Best Regards,<br />SAVAYAS HEALS Team
              </p>
          </div>
          <div style="background-color: #ff5e8e; padding: 10px; text-align: center;">
              <p style="color: #ffffff; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender } = req.body;

    if (!name || !email || !password || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing Details: Name, Email, Password, Phone, DOB, and Gender are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (minimum 8 characters)",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }
    if (!validator.isMobilePhone(formattedPhone, "any", { strictMode: true })) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone: formattedPhone,
      dob,
      gender,
      isMobileVerified: true,
      isEmailVerified: false,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(user._id.toString(), { emailOtp });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Welcome to Savayas Heals - Email Verification Code",
      html: generateEmailTemplate(
        "Email Verification",
        `Dear ${name},<br><br>
         Thank you for joining Savayas Heals. Please verify your email address using the code below:<br>
         <strong style="font-size: 24px; color: #ff5e8e;">${emailOtp}</strong><br>
         This code expires in 10 minutes.`
      ),
    });

    res.status(201).json({
      success: true,
      message: "Verification code sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify user registration
const verifyUser = async (req, res) => {
  try {
    const { userId, emailCode } = req.body;

    const storedCodes = verificationCodes.get(userId);
    if (!storedCodes || storedCodes.emailOtp !== emailCode) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isMobileVerified = true;
    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    verificationCodes.delete(userId);

    res.status(200).json({ success: true, message: "User verified successfully", token });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    if (!user.isMobileVerified || !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your phone and email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtps.set(user._id.toString(), resetOtp);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: generateEmailTemplate(
        "Password Reset OTP",
        `Dear ${user.name},<br><br>
         Your password reset OTP is: <strong style="font-size: 24px; color: #ff5e8e;">${resetOtp}</strong><br>
         This OTP expires in 10 minutes.`
      ),
    });

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify reset OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const storedOtp = resetOtps.get(userId);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    otpVerified.set(userId, true);
    resetOtps.delete(userId);
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyResetOtp:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!otpVerified.get(userId)) {
      return res.status(403).json({ success: false, message: "OTP not verified" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    otpVerified.delete(userId);
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }
    if (!validator.isMobilePhone(formattedPhone, "any", { strictMode: true })) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const updateData = {
      name,
      phone: formattedPhone,
      address: address ? JSON.parse(address) : undefined,
      dob,
      gender,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotId, sessionType, couponCode } = req.body;

    if (!userId || !docId || !slotId || !sessionType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot || slot.status !== "Active") {
      return res.status(400).json({ success: false, message: "Slot not available or already booked" });
    }

    let originalAmount = doctor.fees || 0;
    let paidAmount = originalAmount;
    let discountPercentage = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, status: "Active" });
      if (!coupon || new Date() > coupon.expirationDate) {
        return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
      }
      discountPercentage = coupon.discountPercentage;
      paidAmount = originalAmount - (originalAmount * discountPercentage) / 100;
    }

    slot.status = "paymentpending";
    await doctor.save();

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      slot.status = "Active";
      await doctor.save();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const appointmentData = {
      userId,
      docId,
      slotId,
      slotDate: slot.slotDate,
      slotTime: slot.slotTime,
      duration: slot.duration || 45,
      userData,
      docData: doctor.toObject(),
      originalAmount,
      discountedAmount: paidAmount,
      couponCode: couponCode || null,
      sessionType,
      status: "paymentpending",
      payment: false,
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    const userMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Initiated - Complete Payment",
      html: generateEmailTemplate(
        "Appointment Initiated",
        `Dear ${userData.name},<br><br>
         You have initiated an appointment with ${doctor.name} on ${slot.slotDate} at ${slot.slotTime}.<br>
         Please complete the payment of ₹${paidAmount} via Razorpay within 10 minutes to confirm your booking.<br>
         ${
           couponCode
             ? `Coupon "${couponCode}" applied: ${discountPercentage}% off (Original: ₹${originalAmount}, Now: ₹${paidAmount})`
             : ""
         }`
      ),
    };

    const doctorMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctor.email,
      subject: "New Appointment Request",
      html: generateEmailTemplate(
        "New Appointment Request",
        `Dear ${doctor.name},<br><br>
         ${userData.name} has requested an appointment on ${slot.slotDate} at ${slot.slotTime}.<br>
         Payment of ₹${paidAmount} is pending and must be completed within 10 minutes.<br>
         ${
           couponCode
             ? `Coupon "${couponCode}" applied: ${discountPercentage}% off (Original: ₹${originalAmount}, Now: ₹${paidAmount})`
             : ""
         }`
      ),
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(doctorMailOptions),
    ]);

    res.status(201).json({
      success: true,
      message: "Appointment created, please complete payment",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action or invalid appointment",
      });
    }

    if (appointmentData.cancelled || appointmentData.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    appointmentData.status = "Cancelled";
    appointmentData.cancelled = true;
    await appointmentData.save();

    const doctor = await doctorModel.findById(appointmentData.docId);
    const slot = doctor.slots.id(appointmentData.slotId);
    if (slot) {
      slot.status = "Active";
      slot.bookedBy = null;
      await doctor.save();
    }

    const userData = await userModel.findById(userId).select("-password");
    const doctorData = await doctorModel.findById(appointmentData.docId);

    const userMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userData.email,
      subject: "Appointment Cancellation",
      html: generateEmailTemplate(
        "Appointment Cancellation",
        `Dear ${userData.name},<br><br>
         Your appointment with ${doctorData.name} scheduled for ${appointmentData.slotDate} at ${appointmentData.slotTime} has been cancelled.<br><br>
         ${
           appointmentData.payment
             ? "Our team will discuss your refund within 3-7 business days."
             : "No further action is required."
         }`
      ),
    };

    const doctorMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctorData.email,
      subject: "Appointment Cancellation by User",
      html: generateEmailTemplate(
        "Appointment Cancellation",
        `Dear ${doctorData.name},<br><br>
         The appointment with ${userData.name} (${userData.email}) scheduled for ${appointmentData.slotDate} at ${appointmentData.slotTime} has been cancelled by the user.<br><br>
         ${
           appointmentData.payment
             ? "Our team will handle the refund process with the user."
             : "No further action is required."
         }`
      ),
    };

    const adminMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: "Appointment Cancellation Notification",
      html: generateEmailTemplate(
        "Appointment Cancellation Notification",
        `An appointment has been cancelled by the user:<br><br>
         User: ${userData.name} (${userData.email})<br>
         Doctor: ${doctorData.name} (${doctorData.email})<br>
         Date & Time: ${appointmentData.slotDate} at ${appointmentData.slotTime}<br><br>
         ${
           appointmentData.payment
             ? "Payment: Online - Refund discussion pending"
             : "Payment: None - No refund required"
         }`
      ),
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(doctorMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    res.status(200).json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelAppointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    const appointmentIds = appointments.map((app) => app._id);
    const reviews = await reviewModel.find({ appointmentId: { $in: appointmentIds } });

    const appointmentsWithReviews = appointments.map((app) => {
      const review = reviews.find(
        (rev) => rev.appointmentId.toString() === app._id.toString()
      );
      return {
        ...app.toObject(),
        hasReview: !!review,
        review: review || null,
      };
    });

    res.status(200).json({ success: true, appointments: appointmentsWithReviews });
  } catch (error) {
    console.error("Error in listAppointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate Razorpay payment
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId).populate("docId");
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    if (appointmentData.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized appointment access" });
    }

    if (appointmentData.payment) {
      return res.status(400).json({ success: false, message: "Appointment already paid" });
    }

    const originalAmount = appointmentData.originalAmount || appointmentData.docId.fees || 0;
    const paidAmount = appointmentData.discountedAmount || originalAmount;

    const options = {
      amount: Math.round(paidAmount * 100), // Convert to paise
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    const newTransaction = new transactionModel({
      userId: appointmentData.userId,
      doctorId: appointmentData.docId._id,
      appointmentId: appointmentData._id,
      originalAmount,
      paidAmount,
      status: "pending",
      paymentMethod: "razorpay",
      transactionId: order.id,
      type: "payment",
      couponCode: appointmentData.couponCode || null,
    });

    await newTransaction.save();

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error in paymentRazorpay:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status !== "paid") {
      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const appointment = await appointmentModel.findById(orderInfo.receipt).session(session);
      if (!appointment) {
        throw new Error("Appointment not found");
      }

      const doctor = await doctorModel.findById(appointment.docId).session(session);
      const slot = doctor.slots.id(appointment.slotId);
      if (!slot) {
        throw new Error("Slot not found");
      }

      if (slot.status !== "paymentpending") {
        await appointmentModel.findByIdAndUpdate(
          appointment._id,
          { status: "Failed" },
          { session }
        );
        throw new Error("Slot is no longer available");
      }

      slot.status = "Booked";
      slot.bookedBy = appointment.userId;
      await doctor.save({ session });

      appointment.status = "Booked";
      appointment.payment = true;
      await appointment.save({ session });

      await appointmentModel.updateMany(
        { slotId: slot._id, status: "paymentpending", _id: { $ne: appointment._id } },
        { status: "Failed" },
        { session }
      );

      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        {
          status: "completed",
          paidAmount: orderInfo.amount / 100,
          meta: { gatewayResponse: { payment_id: razorpay_payment_id } },
        },
        { session }
      );

      await session.commitTransaction();

      const userData = await userModel.findById(appointment.userId).select("-password");
      const doctorEmail = doctor.email;

      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Confirmed",
        html: generateEmailTemplate(
          "Appointment Confirmed",
          `Dear ${userData.name},<br><br>
           Your appointment with ${doctor.name} on ${appointment.slotDate} at ${appointment.slotTime} has been confirmed.<br>
           Payment of ₹${appointment.discountedAmount || appointment.originalAmount} has been successfully processed.<br>
           ${
             appointment.couponCode
               ? `Coupon "${appointment.couponCode}" applied.`
               : ""
           }`
        ),
      };

      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctorEmail,
        subject: "Appointment Confirmed",
        html: generateEmailTemplate(
          "Appointment Confirmed",
          `Dear ${doctor.name},<br><br>
           An appointment with ${userData.name} on ${appointment.slotDate} at ${appointment.slotTime} has been confirmed.<br>
           Payment of ₹${appointment.discountedAmount || appointment.originalAmount} has been received.<br>
           ${
             appointment.couponCode
               ? `Coupon "${appointment.couponCode}" applied.`
               : ""
           }`
        ),
      };

      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(doctorMailOptions),
      ]);

      res.status(200).json({ success: true, message: "Payment successful" });
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in verifyRazorpay transaction:", error);
      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "failed" }
      );
      res.status(400).json({ success: false, message: error.message });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error in verifyRazorpay:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit a test
const submitTest = async (req, res) => {
  try {
    const { name, email, mobile, testId, answers } = req.body;

    if (!name || !email || !mobile || !testId || !answers) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    let formattedMobile = mobile.trim();
    if (!formattedMobile.startsWith("+")) {
      formattedMobile = `+91${formattedMobile}`;
    }
    if (!validator.isMobilePhone(formattedMobile, "any", { strictMode: true })) {
      return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    if (answers.length !== test.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Answers count does not match questions",
      });
    }

    let score = 0;
    test.questions.forEach((q, index) => {
      const selectedOptionIndex = answers[index];
      if (selectedOptionIndex >= 0 && selectedOptionIndex < q.options.length) {
        score += q.options[selectedOptionIndex].points;
      }
    });

    let resultText = "";
    for (const range of test.resultRanges) {
      if (score >= range.minScore && score <= range.maxScore) {
        resultText = range.resultText;
        break;
      }
    }
    if (!resultText) resultText = "No result found for this score";

    const userTestResult = new UserTestResult({
      name,
      email,
      mobile: formattedMobile,
      testId,
      answers,
      score,
      resultText,
    });
    await userTestResult.save();

    res.status(201).json({ success: true, score, resultText });
  } catch (error) {
    console.error("Error in submitTest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tests
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.status(200).json({ success: true, tests });
  } catch (error) {
    console.error("Error in getTests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.status(200).json({ success: true, test });
  } catch (error) {
    console.error("Error in getTestById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const { userId, doctorId, appointmentId, rating, comment } = req.body;

    const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Invalid appointment" });
    }

    if (!appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Appointment not completed yet",
      });
    }

    const existingReview = await reviewModel.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this appointment",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const newReview = new reviewModel({
      userId,
      doctorId,
      appointmentId,
      rating,
      comment,
    });
    await newReview.save();

    res.status(201).json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor reviews
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await reviewModel
      .find({ doctorId })
      .populate("userId", "name image")
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error in getDoctorReviews:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate a coupon
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: { $regex: new RegExp(`^${code}$`, "i") }, status: "Active" });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    res.status(200).json({ success: true, discountPercentage: coupon.discountPercentage });
  } catch (error) {
    console.error("Error in validateCoupon:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user transactions
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.body.userId;
    const transactions = await transactionModel
      .find({ userId })
      .populate("doctorId", "name")
      .populate("appointmentId", "slotDate slotTime couponCode originalAmount discountedAmount")
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error in getUserTransactions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  submitTest,
  addReview,
  getDoctorReviews,
  getTests,
  getTestById,
  validateCoupon,
  getUserTransactions,
};
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Test from "../models/testModel.js";
import UserTestResult from "../models/userTestResultModel.js";
import reviewModel from "../models/reviewModel.js";
import Coupon from "../models/couponModel.js";
import transactionModel from "../models/transactionModel.js";

dotenv.config();

const razorpayInstance = new razorpay({
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

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender } = req.body;

    if (!name || !email || !password || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Missing Details: Name, Email, Password, Phone, DOB, and Gender are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (minimum 8 characters)",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }
    if (!validator.isMobilePhone(formattedPhone, "any", { strictMode: true })) {
      return res.json({
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
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://via.placeholder.com/150" alt="Savayas Heals Logo" style="max-width: 100px; border-radius: 50%;">
            <h2 style="color: #4CAF50;">Welcome to Savayas Heals</h2>
          </div>
          <p>Dear ${name},</p>
          <p>Thank you for joining <strong>Savayas Heals</strong>. To complete your registration, please verify your email address using the code below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 8px;">${emailOtp}</span>
          </div>
          <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
          <p>We are excited to have you on board and look forward to helping you on your healing journey.</p>
          <p style="margin-top: 20px;">Warm regards,</p>
          <p><strong>The Savayas Heals Team</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Verification codes sent to your phone and email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify user registration
const verifyUser = async (req, res) => {
  try {
    const { userId, emailCode } = req.body;

    const storedCodes = verificationCodes.get(userId);
    if (!storedCodes || storedCodes.emailOtp !== emailCode) {
      return res.json({ success: false, message: "Invalid verification code(s)" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.isMobileVerified = true;
    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    verificationCodes.delete(userId);

    res.json({ success: true, message: "User verified successfully", token });
  } catch (error) {
    console.error("Verify User Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (!user.isMobileVerified || !user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Please verify your phone and email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Login User Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtps.set(user._id.toString(), resetOtp);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Dear ${user.name},</p><p>Your password reset OTP is: <strong>${resetOtp}</strong>. It expires in 10 minutes.</p>`,
    });

    res.json({
      success: true,
      message: "Password reset OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!otpVerified.get(userId)) {
      return res.json({ success: false, message: "OTP not verified" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    otpVerified.delete(userId);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify reset OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const storedOtp = resetOtps.get(userId);

    if (!storedOtp || storedOtp !== otp) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    otpVerified.set(userId, true);
    resetOtps.delete(userId);
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const updateData = {
      name,
      phone: formattedPhone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    await userModel.findByIdAndUpdate(userId, updateData);

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Book an appointment (updated: removed Zoom automation)
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotId, sessionType, couponCode } = req.body;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot || slot.status !== "Active") {
      return res.json({ success: false, message: "Slot not available" });
    }

    slot.status = "Pending";
    await doctor.save();

    let originalAmount = doctor.fees;
    let discountedAmount = null;
    let discountPercentage = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon || new Date() > coupon.expirationDate) {
        return res.json({ success: false, message: "Invalid or expired coupon" });
      }
      discountPercentage = coupon.discountPercentage;
      discountedAmount = originalAmount - (originalAmount * discountPercentage) / 100;
    }

    const userData = await userModel.findById(userId).select("-password");
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: doctor,
      originalAmount,
      discountedAmount: discountedAmount || originalAmount,
      couponCode: couponCode || null,
      slotId,
      slotDate: slot.slotDate,
      slotTime: slot.slotTime,
      sessionType,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Send emails for cash payments (no meeting link included)
    if (sessionType === "cash") {
      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Booked",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4CAF50;">Appointment Booked</h2>
            </div>
            <p>Dear ${userData.name},</p>
            <p>Your appointment with Dr. ${doctor.name} has been booked.</p>
            <p>Date: ${slot.slotDate}</p>
            <p>Time: ${slot.slotTime}</p>
            <p>The meeting details will be sent to you separately by the admin.</p>
            <p>Please note that payment will be collected at the time of the appointment.</p>
            <p>Best regards,</p>
            <p>The Savayas Heals Team</p>
          </div>
        `,
      };

      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctor.email,
        subject: "New Appointment Booked",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4CAF50;">New Appointment Booked</h2>
            </div>
            <p>Dear Dr. ${doctor.name},</p>
            <p>You have a new appointment with ${userData.name}.</p>
            <p>Date: ${slot.slotDate}</p>
            <p>Time: ${slot.slotTime}</p>
            <p>Please coordinate with the admin to provide the meeting details.</p>
            <p>Payment will be collected at the appointment (Cash).</p>
            <p>Best regards,</p>
            <p>The Savayas Heals Team</p>
          </div>
        `,
      };

      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(doctorMailOptions),
      ]);

      slot.status = "Booked";
      await doctor.save();
    }

    res.json({
      success: true,
      message: "Appointment Booked",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    const slot = doctorData.slots.id(appointmentData.slotId);
    if (slot) {
      slot.status = "Active";
      await doctorData.save();
    }

    if (!doctorData.slots_booked) doctorData.slots_booked = {};
    if (!doctorData.slots_booked[slotDate]) doctorData.slots_booked[slotDate] = [];

    doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });

    const sendCancellationNotificationEmail = async () => {
      const userData = await userModel.findById(userId).select("-password");
      const doctor = await doctorModel.findById(docId);

      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Cancellation",
        html: generateEmailTemplate(
          "Appointment Cancellation",
          `Dear ${userData.name},<br><br>
            Your appointment with ${doctor.name} scheduled for ${slotDate} at ${slotTime} has been cancelled.<br><br>
            ${
              appointmentData.payment
                ? "Our team will discuss your refund within 3-7 business days."
                : "No further action is required."
            }`
        ),
      };

      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctor.email,
        subject: "Appointment Cancellation",
        html: generateEmailTemplate(
          "Appointment Cancellation",
          `Dear ${doctor.name},<br><br>
            The appointment with ${userData.name} scheduled for ${slotDate} at ${slotTime} has been cancelled.<br><br>
            ${
              appointmentData.payment
                ? "Our team will discuss the refund process with the user within 3-7 business days."
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
          `An appointment has been cancelled:<br><br>
            User: ${userData.name}<br>
            Doctor: ${doctor.name}<br>
            Date & Time: ${slotDate} at ${slotTime}<br><br>
            ${
              appointmentData.payment
                ? "Payment: Online - Refund discussion pending"
                : "Payment: Cash - No refund required"
            }`
        ),
      };

      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(doctorMailOptions),
        transporter.sendMail(adminMailOptions),
      ]);
    };

    await sendCancellationNotificationEmail();

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Generate email template
function generateEmailTemplate(title, body) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Savayas Heal</title>
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
                    "${body}"
                </div>
                <p style="font-size: 16px; line-height: 1.5;">
                    If you have any urgent queries, please call us at <strong>(91) 8468938745</strong>.
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
}

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

    res.json({ success: true, appointments: appointmentsWithReviews });
  } catch (error) {
    console.error("List Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Initiate Razorpay payment
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    if (appointmentData.payment) {
      return res.json({
        success: false,
        message: "Payment already completed for this appointment",
      });
    }

    const amountToPay = appointmentData.discountedAmount || appointmentData.originalAmount;

    const options = {
      amount: amountToPay * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);

    const newTransaction = new transactionModel({
      userId: appointmentData.userId,
      doctorId: appointmentData.docId,
      appointmentId: appointmentData._id,
      amount: amountToPay,
      status: "pending",
      paymentMethod: "razorpay",
      transactionId: order.id,
      type: "payment",
    });
    await newTransaction.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Razorpay Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment (updated: no meeting link sent here)
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment verification details" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (!orderInfo) {
      return res.json({ success: false, message: "Invalid order ID" });
    }

    if (orderInfo.status === "paid") {
      const appointment = await appointmentModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true },
        { new: true }
      );

      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "completed" }
      );

      const doctor = await doctorModel.findById(appointment.docId);
      const slot = doctor.slots.id(appointment.slotId);
      if (slot) {
        slot.status = "Booked";
        await doctor.save();
      }

      const userData = await userModel.findById(appointment.userId).select("-password");
      const doctorData = await doctorModel.findById(appointment.docId);

      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
            </div>
            <p>Dear ${userData.name},</p>
            <p>Your appointment with Dr. ${doctorData.name} has been confirmed.</p>
            <p>Date: ${appointment.slotDate}</p>
            <p>Time: ${appointment.slotTime}</p>
            <p>The meeting details will be sent to you separately by the admin.</p>
            <p>Your payment of ₹${appointment.discountedAmount || appointment.originalAmount} has been received.</p>
            <p>Best regards,</p>
            <p>The Savayas Heals Team</p>
          </div>
        `,
      };

      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctorData.email,
        subject: "Appointment Confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
            </div>
            <p>Dear Dr. ${doctorData.name},</p>
            <p>The appointment with ${userData.name} has been confirmed.</p>
            <p>Date: ${appointment.slotDate}</p>
            <p>Time: ${appointment.slotTime}</p>
            <p>Please coordinate with the admin to provide the meeting details.</p>
            <p>The user has paid ₹${appointment.discountedAmount || appointment.originalAmount}.</p>
            <p>Best regards,</p>
            <p>The Savayas Heals Team</p>
          </div>
        `,
      };

      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(doctorMailOptions),
      ]);

      res.json({ success: true, message: "Payment Successful and Appointment Confirmed" });
    } else {
      await transactionModel.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "failed" }
      );
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("Verify Razorpay Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Submit a test
const submitTest = async (req, res) => {
  try {
    const { name, email, mobile, testId, answers } = req.body;

    if (!name || !email || !mobile || !testId || !answers) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    let formattedMobile = mobile.trim();
    if (!formattedMobile.startsWith("+")) {
      formattedMobile = `+91${formattedMobile}`;
    }
    if (!validator.isMobilePhone(formattedMobile, "any", { strictMode: true })) {
      return res.json({ success: false, message: "Invalid mobile number" });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.json({ success: false, message: "Test not found" });
    }

    if (answers.length !== test.questions.length) {
      return res.json({
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

    res.json({ success: true, score, resultText });
  } catch (error) {
    console.error("Submit Test Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const { userId, doctorId, appointmentId, rating, comment } = req.body;

    const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.json({ success: false, message: "Invalid appointment" });
    }

    if (!appointment.isCompleted) {
      return res.json({
        success: false,
        message: "Appointment not completed yet",
      });
    }

    const existingReview = await reviewModel.findOne({ appointmentId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "Review already submitted for this appointment",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.json({
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

    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.json({ success: false, message: error.message });
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

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get Doctor Reviews Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get all tests
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json({ success: true, tests });
  } catch (error) {
    console.error("Get Tests Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);

    if (!test) {
      return res.json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, test });
  } catch (error) {
    console.error("Get Test By ID Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Validate a coupon
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: { $regex: new RegExp(`^${code}$`, "i") } });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    const currentDate = new Date();
    if (currentDate > coupon.expirationDate) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    res.status(200).json({ success: true, discountPercentage: coupon.discountPercentage });
  } catch (error) {
    console.error("Validate Coupon Error:", error);
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

    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        transactions: [],
        message: "No transactions found for this user",
      });
    }

    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Get User Transactions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transactions",
    });
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
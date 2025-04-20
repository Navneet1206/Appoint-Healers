import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
// Removed: import stripe from "stripe";
import razorpay from "razorpay";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import testResultModel from "../models/testResultModel.js";
import reviewModel from "../models/reviewModel.js";
dotenv.config();

// Gateway Initialize
// REMOVED STRIPE INITIALIZATION
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Temporary storage for verification and reset codes (use Redis or DB in production)
const verificationCodes = new Map();
const resetOtps = new Map();

// Temporary storage for OTP verification status
const otpVerified = new Map();

// API to register user with phone and email verification
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Checking for all required data to register user
    if (!name || !email || !password || !phone) {
      return res.json({
        success: false,
        message:
          "Missing Details: Name, Email, Password, and Phone are required",
      });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (minimum 8 characters)",
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // Format phone number to E.164 (e.g., +918435061006)
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`; // Assuming India (+91), adjust country code as needed
    }
    if (!validator.isMobilePhone(formattedPhone, "any", { strictMode: true })) {
      return res.json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone: formattedPhone,
      isMobileVerified: true,
      isEmailVerified: false, // Default false until verified
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate and store OTPs for phone and email
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(user._id.toString(), { emailOtp });

    // Send email OTP via Nodemailer
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
                <p>Dear Valued User,</p>
                <p>Thank you for joining <strong>Savayas Heals</strong>, where we prioritize your health and well-being. To complete your registration, please verify your email address using the code below:</p>
                <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 8px;">${emailOtp}</span>
                </div>
                <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                <p>We are excited to have you on board and look forward to helping you on your healing journey.</p>
                <p style="margin-top: 20px;">Warm regards,</p>
                <p><strong>The Savayas Heals Team</strong></p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email. Please do not reply to this message.</p>
            </div>
            `,
    });

    res.json({
      success: true,
      message: "Verification codes sent to your phone and email",
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify user phone and email
const verifyUser = async (req, res) => {
  try {
    const { userId, phoneCode, emailCode } = req.body;

    const storedCodes = verificationCodes.get(userId);
    if (!storedCodes || storedCodes.emailOtp !== emailCode) {
      return res.json({
        success: false,
        message: "Invalid verification code(s)",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Mark both as verified
    user.isMobileVerified = true;
    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    verificationCodes.delete(userId);

    res.json({ success: true, message: "User verified successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Check if user is verified
    if (!user.isMobileVerified || !user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Please verify your phone and email first",
      });
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

// API to handle forgot password with email OTP
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
      html: `<p>Your password reset OTP is: <strong>${resetOtp}</strong>. It expires in 10 minutes.</p>`,
    });

    res.json({
      success: true,
      message: "Password reset OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to reset password after OTP verification
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    // Check if OTP was verified previously
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

    // Remove verification flag once password is reset
    otpVerified.delete(userId);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify OTP for password reset
const verifyResetOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const storedOtp = resetOtps.get(userId);
    if (!storedOtp || storedOtp !== otp) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }
    // OTP verified successfully. Set flag and remove OTP.
    otpVerified.set(userId, true);
    resetOtps.delete(userId);
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Format phone number for update profile as well
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`; // Assuming India (+91)
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone: formattedPhone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Updated backend/controllers/userController.js
// Updated backend/controllers/userController.js
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotId } = req.body;
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    // Find the slot by its subdocument id
    const slot = doctor.slots.id(slotId);
    if (!slot || slot.status !== "Active") {
      return res.json({ success: false, message: "Slot not available" });
    }
    // Mark the slot as booked
    slot.status = "Booked";
    await doctor.save();

    const userData = await userModel.findById(userId).select("-password");
    // Create the appointment with a reference to the slot
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: doctor,
      amount: doctor.fees,
      slotId,
      slotDate: slot.slotDate,
      slotTime: slot.slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Email notification for appointment creation
    function sendAppointmentConfirmationEmail() {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      // Email content for user
      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Confirmation",
        html: generateEmailTemplate(
          "Appointment Confirmation",
          `Dear ${userData.name},<br><br>    
                    Your appointment with ${doctor.name} (${
            doctor.email
          }) has been successfully booked for ${slot.slotDate} at ${
            slot.slotTime
          }.<br><br>
                    ${
                      newAppointment.payment
                        ? "Your online payment has been completed."
                        : "Please make the payment at the time of your appointment."
                    }
                    `
        ),
      };

      // Email content for doctor
      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctor.email,
        subject: "New Appointment Scheduled",
        html: generateEmailTemplate(
          "New Appointment Scheduled",
          `Dear ${doctor.name},<br><br>
                    You have a new appointment scheduled with ${
                      userData.name
                    } (${userData.email}) on ${slot.slotDate} at ${
            slot.slotTime
          }.<br><br>
                    ${
                      newAppointment.payment
                        ? "The user has completed the online payment."
                        : "The user will make the payment at the time of their appointment."
                    }
                    `
        ),
      };

      // Email content for admin
      const adminMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: "New Appointment Notification",
        html: generateEmailTemplate(
          "New Appointment Notification",
          `A new appointment has been scheduled:<br><br>
                    User: ${userData.name} (${userData.email})<br>
                    Doctor: ${doctor.name} (${doctor.email})<br>
                    Date & Time: ${slot.slotDate} at ${slot.slotTime}<br><br>
                    ${
                      newAppointment.payment
                        ? "Payment: Online"
                        : "Payment: Cash (To be collected at appointment time)"
                    }
                    `
        ),
      };

      // Send emails
      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to user:", error);
        } else {
          console.log("Email sent to user:", info.response);
        }
      });

      transporter.sendMail(doctorMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to doctor:", error);
        } else {
          console.log("Email sent to doctor:", info.response);
        }
      });

      transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to admin:", error);
        } else {
          console.log("Email sent to admin:", info.response);
        }
      });
    }

    sendAppointmentConfirmationEmail();

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    // Ensure slots_booked exists and initialize if necessary
    if (!doctorData.slots_booked) {
      doctorData.slots_booked = {};
    }

    if (!doctorData.slots_booked[slotDate]) {
      doctorData.slots_booked[slotDate] = [];
    }

    doctorData.slots_booked[slotDate] = doctorData.slots_booked[
      slotDate
    ].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked: doctorData.slots_booked,
    });

    // Email notification for appointment cancellation
    async function sendCancellationNotificationEmail() {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      // Fetch user and doctor data
      const userData = await userModel.findById(userId).select("-password");
      const doctor = await doctorModel.findById(docId);

      // Email content for user
      const userMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Appointment Cancellation",
        html: generateEmailTemplate(
          "Appointment Cancellation",
          `Dear ${userData.name},<br><br>
                    Your appointment with ${doctor.name} (${
            doctor.email
          }) scheduled for ${slotDate} at ${slotTime} has been cancelled.<br><br>
                    ${
                      appointmentData.payment
                        ? "Our team will discuss your refund within 3-7 business days."
                        : "No further action is required."
                    }
                    `
        ),
      };

      // Email content for doctor
      const doctorMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: doctor.email,
        subject: "Appointment Cancellation",
        html: generateEmailTemplate(
          "Appointment Cancellation",
          `Dear ${doctor.name},<br><br>
                    The appointment with ${userData.name} (${
            userData.email
          }) scheduled for ${slotDate} at ${slotTime} has been cancelled.<br><br>
                    ${
                      appointmentData.payment
                        ? "Our team will discuss the refund process with the user within 3-7 business days."
                        : "No further action is required."
                    }
                    `
        ),
      };

      // Email content for admin
      const adminMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: "Appointment Cancellation Notification",
        html: generateEmailTemplate(
          "Appointment Cancellation Notification",
          `An appointment has been cancelled:<br><br>
                    User: ${userData.name} (${userData.email})<br>
                    Doctor: ${doctor.name} (${doctor.email})<br>
                    Date & Time: ${slotDate} at ${slotTime}<br><br>
                    ${
                      appointmentData.payment
                        ? "Payment: Online - Refund discussion pending"
                        : "Payment: Cash - No refund required"
                    }
                    `
        ),
      };

      // Send emails
      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to user:", error);
        } else {
          console.log("Email sent to user:", info.response);
        }
      });

      transporter.sendMail(doctorMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to doctor:", error);
        } else {
          console.log("Email sent to doctor:", info.response);
        }
      });

      transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email to admin:", error);
        } else {
          console.log("Email sent to admin:", info.response);
        }
      });
    }

    sendCancellationNotificationEmail();

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Helper function to generate email HTML template
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
                    If you have any urgent queries, please feel free to call us at <strong>(91) 8468938745</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 30px 0 0;">
                    Best Regards,<br />SAVAYAS HEALS Team
                </p>
            </div>
            <div style="background-color: #ff5e8e; padding: 10px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    // Fetch reviews for these appointments
    const appointmentIds = appointments.map((app) => app._id);
    const reviews = await reviewModel.find({ appointmentId: { $in: appointmentIds } });

    // Map reviews to appointments
    const appointmentsWithReviews = appointments.map((app) => {
      const review = reviews.find(
        (rev) => rev.appointmentId.toString() === app._id.toString()
      );
      return {
        ...app.toObject(),
        hasReview: !!review,
        review: review ? review : null,
      };
    });

    res.json({ success: true, appointments: appointmentsWithReviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to make payment of appointment using Razorpay
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

    // Creating options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment of Razorpay
// Updated backend/controllers/userController.js
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      // Fetch appointment and user details
      const appointment = await appointmentModel.findById(orderInfo.receipt);
      const userData = await userModel
        .findById(appointment.userId)
        .select("-password");
      const doctor = await doctorModel.findById(appointment.docId);

      // Email notification for payment confirmation
      function sendPaymentConfirmationEmail() {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        });

        // Email content for user
        const userMailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: userData.email,
          subject: "Payment Confirmation",
          html: generateEmailTemplate(
            "Payment Confirmation",
            `Dear ${userData.name},<br><br>
                        Your payment for the appointment with ${doctor.name} (${doctor.email}) scheduled for ${appointment.slotDate} at ${appointment.slotTime} has been successfully processed.<br><br>
                        Thank you for choosing Savayas Heal.
                        `
          ),
        };

        // Email content for doctor
        const doctorMailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: doctor.email,
          subject: "Payment Received",
          html: generateEmailTemplate(
            "Payment Received",
            `Dear ${doctor.name},<br><br>
                        You have received a payment from ${userData.name} (${userData.email}) for the appointment scheduled for ${appointment.slotDate} at ${appointment.slotTime}.<br><br>
                        Thank you for using Savayas Heal.
                        `
          ),
        };

        // Email content for admin
        const adminMailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: process.env.NODEMAILER_EMAIL,
          subject: "Payment Received Notification",
          html: generateEmailTemplate(
            "Payment Received Notification",
            `A payment has been received:<br><br>
                        User: ${userData.name} (${userData.email})<br>
                        Doctor: ${doctor.name} (${doctor.email})<br>
                        Date & Time: ${appointment.slotDate} at ${appointment.slotTime}<br><br>
                        Payment: Online - Completed
                        `
          ),
        };

        // Send emails
        transporter.sendMail(userMailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email to user:", error);
          } else {
            console.log("Email sent to user:", info.response);
          }
        });

        transporter.sendMail(doctorMailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email to doctor:", error);
          } else {
            console.log("Email sent to doctor:", info.response);
          }
        });

        transporter.sendMail(adminMailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email to admin:", error);
          } else {
            console.log("Email sent to admin:", info.response);
          }
        });
      }

      sendPaymentConfirmationEmail();

      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const submitTest = async (req, res) => {
    try {
      const { name, phone, answers } = req.body;
  
      // Mapping of answers to specialties
      const questionMapping = {
        q1: {
          Often: "Stress Management",
          Always: "Stress Management",
        },
        q2: {
          Yes: "Sleep Disorders",
        },
        q3: {
          "Somewhat negative": "Depression",
          "Very negative": "Depression",
        },
        q4: {
          Yes: "Social Anxiety",
        },
        q5: {
          Yes: "Relationship Counseling",
        },
      };
  
      // Determine required specialties from answers
      let requiredSpecialties = [];
      for (const [questionId, answer] of Object.entries(answers)) {
        if (questionMapping[questionId] && questionMapping[questionId][answer]) {
          requiredSpecialties.push(questionMapping[questionId][answer]);
        }
      }
      requiredSpecialties = [...new Set(requiredSpecialties)]; // Remove duplicates
  
      // Fetch all doctors
      const allDoctors = await doctorModel.find({}).select("-password -email");
  
      // If no doctors exist, return an error
      if (!allDoctors || allDoctors.length === 0) {
        return res.json({ success: false, message: "No doctors available." });
      }
  
      // If only one doctor exists, suggest that one
      if (allDoctors.length === 1) {
        const testResult = new testResultModel({
          name,
          phone,
          answers,
          suggestedSpecialties: [allDoctors[0].speciality],
        });
        await testResult.save();
        return res.json({
          success: true,
          doctorId: allDoctors[0]._id,
          suggestedSpecialties: [allDoctors[0].speciality],
        });
      }
  
      // Score doctors based on specialty matches
      const doctorScores = allDoctors.map((doctor) => {
        const specialties = [
          doctor.speciality,
          ...(doctor.specialityList || []),
        ].filter(Boolean);
        const matchCount = requiredSpecialties.filter((reqSpec) =>
          specialties.includes(reqSpec)
        ).length;
        return { doctor, score: matchCount };
      });
  
      // Sort by score (descending) and select the best doctor
      doctorScores.sort((a, b) => b.score - a.score);
      const bestDoctor = doctorScores[0].doctor;
      const suggestedSpecialties = [
        bestDoctor.speciality,
        ...(bestDoctor.specialityList || []),
      ].filter((spec) => requiredSpecialties.includes(spec));
  
      // Save test result
      const testResult = new testResultModel({
        name,
        phone,
        answers,
        suggestedSpecialties,
      });
      await testResult.save();
  
      // Return the best doctor's ID for navigation
      res.json({
        success: true,
        doctorId: bestDoctor._id,
        suggestedSpecialties,
      });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };

  const addReview = async (req, res) => {
    try {
      const { userId, doctorId, appointmentId, rating, comment } = req.body;
  
      // Validate appointment
      const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });
      if (!appointment) {
        return res.json({ success: false, message: "Invalid appointment" });
      }
  
      // Check if appointment is completed
      if (!appointment.isCompleted) {
        return res.json({ success: false, message: "Appointment not completed yet" });
      }
  
      // Check if review already exists
      const existingReview = await reviewModel.findOne({ appointmentId });
      if (existingReview) {
        return res.json({ success: false, message: "Review already submitted for this appointment" });
      }
  
      // Validate rating
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Rating must be an integer between 1 and 5" });
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
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  const getDoctorReviews = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const reviews = await reviewModel
        .find({ doctorId })
        .populate("userId", "name image")
        .sort({ timestamp: -1 }); // Latest reviews first
      res.json({ success: true, reviews });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
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
};

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary';
import stripe from "stripe";
import razorpay from 'razorpay';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Twilio setup
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    console.log('Twilio keys and numbers are loaded');
} else {
    console.log('Twilio keys are missing');
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

// Temporary storage for verification codes (use Redis or DB in production)
const verificationCodes = new Map();

// API to register user with phone verification
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Checking for all required data to register user
        if (!name || !email || !password || !phone) {
            return res.json({ success: false, message: 'Missing Details: Name, Email, Password, and Phone are required' });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        // Format phone number to E.164 (e.g., +918435061006)
        let formattedPhone = phone.trim();
        console.log('To Phone:', formattedPhone);
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = `+91${formattedPhone}`; // Assuming India (+91), adjust country code as needed
        }
        if (!validator.isMobilePhone(formattedPhone, 'any', { strictMode: true })) {
            return res.json({ success: false, message: "Please enter a valid phone number" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone: formattedPhone, // Store formatted phone number
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Send verification code via Twilio
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes.set(user._id.toString(), verificationCode);

        await twilioClient.messages.create({
            body: `Your verification code is: ${verificationCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone, // Use formatted phone number
        });

        res.json({ success: true, message: 'Verification code sent to your phone', userId: user._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to verify user phone
const verifyUser = async (req, res) => {
    try {
        const { userId, code } = req.body;

        const storedCode = verificationCodes.get(userId);
        if (!storedCode || storedCode !== code) {
            return res.json({ success: false, message: 'Invalid verification code' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        verificationCodes.delete(userId);

        res.json({ success: true, message: 'User verified successfully', token });
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

// API to handle forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
        });

        res.json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

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
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = `+91${formattedPhone}`; // Assuming India (+91)
        }

        await userModel.findByIdAndUpdate(userId, { name, phone: formattedPhone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // Upload image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' });
        }

        let slots_booked = docData.slots_booked;

        // Checking for slot availability 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select("-password");

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });
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
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
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
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
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
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase();

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees",
                },
                unit_amount: appointmentData.amount * 100,
            },
            quantity: 1,
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to verify Stripe payment
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            return res.json({ success: true, message: 'Payment Successful' });
        }

        res.json({ success: false, message: 'Payment Failed' });
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
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
};
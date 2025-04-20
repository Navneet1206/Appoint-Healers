import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import userModel from "../models/userModel.js"; 
import professionalRequestModel from "../models/professionalRequestModel.js";

dotenv.config();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const otpStore = new Map();
  
  const forgotPasswordDoctor = async (req, res) => {
    try {
      const { email } = req.body;
      const doctor = await doctorModel.findOne({ email });
      if (!doctor) {
        return res.json({ success: false, message: 'Doctor not found' });
      }
  
      const otp = generateOTP();
      otpStore.set(doctor._id.toString(), { otp, type: 'forgot' });
  
      setTimeout(() => {
        otpStore.delete(doctor._id.toString());
      }, 10 * 60 * 1000);
  
      await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Verification Code - SavayasHeal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            padding: 25px 0;
            background-color: #f5f8ff;
            border-bottom: 1px solid #e1e5f0;
        }
        .logo {
            max-width: 180px;
            height: auto;
        }
        .content {
            padding: 30px 25px;
        }
        .otp-container {
            background-color: #f0f5ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
            border: 1px solid #d0d9f0;
        }
        .otp-code {
            font-size: 32px;
            letter-spacing: 3px;
            color: #1a365d;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }
        .timer {
            color: #e53e3e;
            font-weight: bold;
            margin-top: 10px;
        }
        .instructions {
            background-color: #fffbeb;
            border-left: 4px solid #f6ad55;
            padding: 12px 15px;
            margin: 20px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            padding: 20px;
            background-color: #f9f9f9;
            border-top: 1px solid #eeeeee;
        }
        .help-text {
            font-size: 13px;
            color: #718096;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px dashed #e2e8f0;
        }
        .button {
            background-color: #4a7aff;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin-top: 15px;
            font-weight: bold;
        }
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
            <p>&copy; 2025 SavayasHeal.com | <a href="https://savayasheal.com/privacy">Privacy Policy</a> | <a href="https://savayasheal.com/terms">Terms of Service</a></p>
            <p>SavayasHeal Inc., 123 Wellness Avenue, Suite 200, Health City, HC 12345</p>
        </div>
    </div>
</body>
</html>`,
      });
  
      res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const resetPasswordDoctor = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const doctor = await doctorModel.findOne({ email });
      if (!doctor) {
        return res.json({ success: false, message: 'Doctor not found' });
      }
  
      const storedData = otpStore.get(doctor._id.toString());
      if (!storedData || storedData.otp !== otp || storedData.type !== 'forgot') {
        return res.json({ success: false, message: 'Invalid or expired OTP' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      doctor.password = hashedPassword;
      await doctor.save();
  
      otpStore.delete(doctor._id.toString());
  
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const loginDoctor = async (req, res) => {
    try {
      const { email, password } = req.body;
      const doctor = await doctorModel.findOne({ email });
  
      if (!doctor) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, doctor.password);
  
      if (isMatch) {
        const otp = generateOTP();
        otpStore.set(doctor._id.toString(), { otp, type: 'login' });
  
        setTimeout(() => {
          otpStore.delete(doctor._id.toString());
        }, 10 * 60 * 1000);
  
        await transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL,
          to: email,
          subject: 'Login OTP',
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
            <p>&copy; 2025 Savayas Heal | <a href="#">Privacy Policy</a> | <a href="#">Unsubscribe</a></p>
            <p>123 Health Street, Wellness City, WC 12345</p>
        </div>
    </div>
</body>
</html>`,
        });
  
        res.json({ success: true, message: 'OTP sent to your email', doctorId: doctor._id });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const verifyLoginOtpDoctor = async (req, res) => {
    try {
      const { doctorId, otp } = req.body;
      const storedData = otpStore.get(doctorId);
      if (!storedData || storedData.otp !== otp || storedData.type !== 'login') {
        return res.json({ success: false, message: 'Invalid or expired OTP' });
      }
  
      const token = jwt.sign({ id: doctorId }, process.env.JWT_SECRET);
  
      otpStore.delete(doctorId);
  
      res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor to create a slot
const createSlot = async (req, res) => {
    try {
        const { docId, slotDate, slotTime, description } = req.body;
        const doctor = await doctorModel.findById(docId);
        if (!doctor) return res.json({ success: false, message: "Doctor not found" });
        
        // Check for duplicate slot (same date and time)
        const exists = doctor.slots.some(slot => slot.slotDate === slotDate && slot.slotTime === slotTime);
        if (exists) {
            return res.json({ success: false, message: "Slot already exists" });
        }
        doctor.slots.push({ slotDate, slotTime, description, status: "Active" });
        await doctor.save();
        res.json({ success: true, message: "Slot created successfully", slots: doctor.slots });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for doctor to update a slot (status and/or description)
const updateSlot = async (req, res) => {
    try {
        const { docId, slotId, status, description } = req.body;
        const doctor = await doctorModel.findById(docId);
        if (!doctor) return res.json({ success: false, message: "Doctor not found" });
        
        // Find the slot by its id (subdocument id)
        const slot = doctor.slots.id(slotId);
        if (!slot) {
            return res.json({ success: false, message: "Slot not found" });
        }
        slot.status = status;
        if (description !== undefined) {
            slot.description = description;
        }
        await doctor.save();
        res.json({ success: true, message: "Slot updated successfully", slot });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// (Optional) API to get all slots for a doctor
const getSlots = async (req, res) => {
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId);
        if (!doctor) return res.json({ success: false, message: "Doctor not found" });
        res.json({ success: true, slots: doctor.slots });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const sendMeetingLink = async (req, res) => {
    try {
        const { appointmentId, meetingLink } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        const userEmail = appointment.userData.email;
        const userName = appointment.userData.name;
        const doctorName = appointment.docData.name;
        const doctorEmail = appointment.docData.email;

        // Email content for user
        const userMailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: userEmail,
            subject: 'Meeting Link for Your Appointment',
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

        // Send email to user
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email to user:', error);
                return res.json({ success: false, message: 'Error sending email' });
            }
            console.log('Email sent to user:', info.response);
            res.json({ success: true, message: 'Meeting link sent successfully' });
        });
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
            return res.json({ success: false, message: 'Appointment not found' });
        }

        const userEmail = appointment.userData.email;
        const userName = appointment.userData.name;
        const doctorName = appointment.docData.name;
        const doctorEmail = appointment.docData.email;

        // Email content for user
        const userMailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: userEmail,
            subject: 'Appointment Accepted',
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

        // Send email to user
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email to user:', error);
                return res.json({ success: false, message: 'Error sending email' });
            }
            console.log('Email sent to user:', info.response);
            res.json({ success: true, message: 'Appointment accepted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const getDashData = async (req, res) => {
    try {
      const doctorId = req.userId; // From auth middleware
      const appointments = await appointmentModel.find({ docId: doctorId });
      const earnings = appointments
        .filter((app) => app.payment && !app.cancelled)
        .reduce((sum, app) => sum + app.fees, 0);
      const patients = [...new Set(appointments.map((app) => app.userId.toString()))].length;
      const latestAppointments = appointments
        .sort((a, b) => new Date(b.slotDate) - new Date(a.slotDate))
        .slice(0, 5)
        .map((app) => ({
          ...app.toObject(),
          userData: { name: 'User Name', image: 'user_image_url' }, // Populate user data
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
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };


  const submitProfessionalRequest = async (req, res) => {
    try {
      const { name, email, speciality, degree, experience, about, fees, address, languages } = req.body;
      const imageFile = req.file;
  
      // Validation
      if (!name || !email || !speciality || !degree || !experience || !about || !fees || !address || !languages || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
      }
  
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email" });
      }
  
      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      const imageUrl = imageUpload.secure_url;
  
      // Parse address
      const parsedAddress = JSON.parse(address);
  
      // Store request
      const requestData = {
        name,
        email,
        speciality,
        degree,
        experience,
        about,
        fees: Number(fees),
        address: parsedAddress,
        languages: languages.split(',').map(lang => lang.trim()),
        image: imageUrl,
        status: "Pending",
      };
  
      const newRequest = new professionalRequestModel(requestData);
      await newRequest.save();
  
      // Send email to professional
      await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Professional Registration Request - Savayas Heal',
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
      });
  
      // Send email to admin
      await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.ADMIN_EMAIL, // Add ADMIN_EMAIL to .env
        subject: 'New Professional Registration Request - Savayas Heal',
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
      });
  
      res.json({ success: true, message: 'Request submitted successfully. You will be notified via email.' });
    } catch (error) {
      console.log(error);
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
    sendMeetingLink,
    acceptAppointment,
    getDashData,
    submitProfessionalRequest,
}

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

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

        const user = await doctorModel.findById(appointment.userId).select('-password');
        const doctor = await doctorModel.findById(appointment.docId);

        // Email content for user
        const userMailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: 'Meeting Link for Your Appointment',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #4CAF50;">Meeting Link</h2>
                    </div>
                    <p>Dear ${user.name},</p>
                    <p>Your meeting link for the appointment with ${doctor.name} (${doctor.email}) is: ${meetingLink}</p>
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

        const user = await doctorModel.findById(appointment.userId).select('-password');
        const doctor = await doctorModel.findById(appointment.docId);

        // Update appointment status
        appointment.isCompleted = true;
        await appointment.save();

        // Email content for user
        const userMailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: userData.email,
            subject: 'Appointment Accepted',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #4CAF50;">Appointment Accepted</h2>
                    </div>
                    <p>Dear ${user.name},</p>
                    <p>Your appointment with ${doctor.name} (${doctor.email}) has been accepted.</p>
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
    sendMeetingLink,
    acceptAppointment
}

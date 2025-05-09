import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel,
    completeAppointment, addDoctor,sendMeetingLink,acceptAppointment, allDoctors, adminDashboard, verifyLoginOtpAdmin } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/verify-login-otp", verifyLoginOtpAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

adminRouter.post("/send-meeting-link", authAdmin, sendMeetingLink);
adminRouter.post("/accept-appointment", authAdmin, acceptAppointment);
adminRouter.post("/complete-appointment", authAdmin, completeAppointment);

export default adminRouter;
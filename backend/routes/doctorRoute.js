import express from "express";
import {
  loginDoctor,
  forgotPasswordDoctor,
  resetPasswordDoctor,
  verifyLoginOtpDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  submitProfessionalRequest,
  changeAvailablity,
  createSlot,
  updateSlot,
  getSlots,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  getOwnReviews,
  getDoctorTransactions,
  updatePaymentDetails,
  updateAppointmentSlot, // New import
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";
import upload from "../middleware/multer.js";
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/forgot-password", forgotPasswordDoctor);
doctorRouter.post("/reset-password", resetPasswordDoctor);
doctorRouter.post("/verify-login-otp", verifyLoginOtpDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, upload.single("bannerImage"), updateDoctorProfile);
doctorRouter.post("/create-slot", authDoctor, createSlot);
doctorRouter.post("/update-slot", authDoctor, updateSlot);
doctorRouter.post("/slots", authDoctor, getSlots);
doctorRouter.post("/request-professional", upload.single("image"), submitProfessionalRequest);
doctorRouter.get("/reviews", authDoctor, getOwnReviews);
doctorRouter.get("/transactions", authDoctor, getDoctorTransactions);
doctorRouter.post("/update-payment-details", authDoctor, updatePaymentDetails);
doctorRouter.post("/update-appointment-slot", authDoctor, updateAppointmentSlot); // New route

export default doctorRouter;
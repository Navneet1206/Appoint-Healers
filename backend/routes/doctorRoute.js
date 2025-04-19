import express from "express";
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  createSlot,
  updateSlot,
  getSlots,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  sendMeetingLink,
  acceptAppointment,

} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/create-slot", authDoctor, createSlot);
doctorRouter.post("/update-slot", authDoctor, updateSlot);
doctorRouter.post("/slots", authDoctor, getSlots);
doctorRouter.post("/send-meeting-link", authDoctor, sendMeetingLink);
doctorRouter.post("/accept-appointment", authDoctor, acceptAppointment);

export default doctorRouter;

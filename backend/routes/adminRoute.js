import express from "express";
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  completeAppointment,
  addDoctor,
  sendMeetingLink,
  acceptAppointment,
  allDoctors,
  adminDashboard,
  verifyLoginOtpAdmin,
  addTest,
  getTests,
  updateTest,
  deleteTest,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/adminController.js";
import { changeAvailablity } from "../controllers/doctorController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/verify-login-otp", verifyLoginOtpAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.post("/send-meeting-link", authAdmin, sendMeetingLink);
adminRouter.post("/accept-appointment", authAdmin, acceptAppointment);
adminRouter.post("/complete-appointment", authAdmin, completeAppointment);
adminRouter.post("/add-test", authAdmin, addTest);
adminRouter.get("/tests", authAdmin, getTests);
adminRouter.put('/tests/:id', authAdmin, updateTest);
adminRouter.delete('/tests/:id', authAdmin, deleteTest);


adminRouter.post('/coupons', authAdmin, createCoupon);
adminRouter.get('/coupons', authAdmin, getAllCoupons);
adminRouter.get('/coupons/:id', authAdmin, getCouponById);
adminRouter.put('/coupons/:id', authAdmin, updateCoupon);
adminRouter.delete('/coupons/:id', authAdmin, deleteCoupon);
export default adminRouter;

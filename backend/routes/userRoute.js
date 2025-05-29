import express from "express";
import {
  loginUser,
  registerUser,
  verifyResetOtp,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  submitTest,
  verifyRazorpay,
  verifyUser,
  forgotPassword,
  resetPassword,
  addReview,
  getDoctorReviews,
  getTests,
  getTestById,
  validateCoupon,
  getUserTransactions,
  respondToSlotUpdate, 
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/verify-reset-otp", verifyResetOtp);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
userRouter.post("/add-review", authUser, addReview);
userRouter.get("/reviews/:doctorId", getDoctorReviews);
userRouter.post("/submit-test", submitTest);
userRouter.get("/tests", getTests);
userRouter.get("/tests/:testId", getTestById);
userRouter.post("/validate-coupon", authUser, validateCoupon);
userRouter.get("/transactions", authUser, getUserTransactions);
userRouter.post("/respond-to-slot-update", authUser, respondToSlotUpdate); // New route

export default userRouter;
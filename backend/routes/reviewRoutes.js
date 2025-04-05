import express from "express";
import {
  submitReview,
  getDoctorReviews,
  getUserReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Review routes are working" });
});

// Submit a review (protected route)
router.post("/", protect, submitReview);

// Get reviews for a doctor (public route)
router.get("/doctor/:doctorId", getDoctorReviews);

// Get user's reviews (protected route)
router.get("/user", protect, getUserReviews);

export default router;

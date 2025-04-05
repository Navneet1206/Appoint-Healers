import Review from "../models/reviewModel.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";

// Submit a review
export const submitReview = async (req, res) => {
  try {
    console.log("Submit review request received");
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    console.log("Headers:", req.headers);

    const { appointmentId, rating, comment } = req.body;
    const userId = req.user._id;

    console.log("Appointment ID:", appointmentId);
    console.log("User ID:", userId);
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    console.log("Appointment found:", appointment ? "Yes" : "No");

    if (!appointment) {
      console.log("Appointment not found");
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment belongs to the user
    console.log("Appointment user ID:", appointment.userId.toString());
    console.log("Request user ID:", userId.toString());

    if (appointment.userId.toString() !== userId.toString()) {
      console.log("User not authorized to review this appointment");
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this appointment",
      });
    }

    // Check if the appointment is completed
    console.log("Appointment completed:", appointment.isCompleted);

    if (!appointment.isCompleted) {
      console.log("Appointment not completed");
      return res.status(400).json({
        success: false,
        message: "Cannot review an incomplete appointment",
      });
    }

    // Check if a review already exists
    const existingReview = await Review.findOne({ appointmentId });
    console.log("Existing review found:", existingReview ? "Yes" : "No");

    if (existingReview) {
      console.log("Review already exists for this appointment");
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this appointment",
      });
    }

    // Create the review
    console.log("Creating new review");
    const review = new Review({
      appointmentId,
      doctorId: appointment.docId,
      userId,
      rating,
      comment,
    });

    await review.save();
    console.log("Review saved successfully");

    // Update the appointment with the review
    appointment.review = review._id;
    await appointment.save();
    console.log("Appointment updated with review");

    // Update doctor's average rating
    const doctor = await Doctor.findById(appointment.docId);
    console.log("Doctor found:", doctor ? "Yes" : "No");

    const doctorReviews = await Review.find({ doctorId: appointment.docId });
    console.log("Doctor reviews count:", doctorReviews.length);

    const totalRating = doctorReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / doctorReviews.length;

    doctor.rating = averageRating;
    await doctor.save();
    console.log("Doctor rating updated");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ success: false, message: "Error submitting review" });
  }
};

// Get reviews for a doctor
export const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctorId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ userId })
      .populate("doctorId", "name image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const refundUser = async (userId, amount, appointmentId) => {
  try {
    const originalTransaction = await transactionModel.findOne({
      appointmentId,
      type: "payment",
      status: "completed",
    });

    if (!originalTransaction) {
      throw new Error("No completed payment transaction found for this appointment");
    }

    const paymentId = originalTransaction.transactionId;
    if (!paymentId.startsWith("pay_")) {
      throw new Error("Invalid payment ID format for refund");
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      notes: { reason: "Appointment cancelled by doctor" },
    });

    const refundTransaction = new transactionModel({
      userId,
      doctorId: originalTransaction.doctorId,
      appointmentId,
      amount: -amount, // Negative to indicate refund
      status: refund.status === "processed" ? "completed" : "pending",
      paymentMethod: "refund",
      transactionId: refund.id,
      type: "refund",
    });
    await refundTransaction.save();

    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error("Refund Error:", error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};
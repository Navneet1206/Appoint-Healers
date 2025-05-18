import Razorpay from "razorpay";
import appointmentModel from "../models/appointmentModel.js";
import transactionModel from "../models/transactionModel.js";
import doctorModel from "../models/doctorModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const initiatePaymentToDoctor = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId)
      .populate("userId", "name")
      .populate("doctorId", "name email paymentDetails");

    if (!appointment || appointment.paymentToDoctor || !appointment.payment || appointment.cancelled) {
      return res.json({ success: false, message: "Invalid or already paid appointment" });
    }

    const doctor = appointment.doctorId;
    if (!doctor.paymentDetails || (!doctor.paymentDetails.bankAccount?.accountNumber && !doctor.paymentDetails.upiId)) {
      return res.json({ success: false, message: "Doctor's payment details missing" });
    }

    const amount = appointment.discountedAmount || appointment.originalAmount;
    const payoutMethod = doctor.paymentDetails.bankAccount?.accountNumber ? "bank_transfer" : "upi";

    const payoutOptions = {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      mode: payoutMethod,
      purpose: "Doctor Payment",
      fund_account: {
        account_type: payoutMethod === "bank_transfer" ? "bank_account" : "vpa",
        [payoutMethod === "bank_transfer" ? "bank_account" : "vpa"]: payoutMethod === "bank_transfer"
          ? {
              name: doctor.paymentDetails.bankAccount.accountHolderName,
              account_number: doctor.paymentDetails.bankAccount.accountNumber,
              ifsc: doctor.paymentDetails.bankAccount.ifscCode,
            }
          : { address: doctor.paymentDetails.upiId },
      },
      reference_id: appointmentId,
    };

    const payout = await razorpay.payouts.create(payoutOptions);

    const transaction = new transactionModel({
      userId: appointment.userId._id,
      doctorId: doctor._id,
      appointmentId: appointment._id,
      amount,
      status: payout.status === "processed" ? "completed" : "pending",
      paymentMethod: "razorpay_payout",
      transactionId: payout.id,
      type: "payout",
    });
    await transaction.save();

    await appointmentModel.findByIdAndUpdate(appointmentId, { paymentToDoctor: true });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctor.email,
      subject: "Payment Received for Appointment",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Payment Received</h2>
          <p>Dear ${doctor.name},</p>
          <p>You have received a payment for an appointment with ${appointment.userId.name}.</p>
          <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>Transaction ID:</strong> ${payout.id}</li>
            <li><strong>Date & Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>Best regards,<br>The Savayas Heal Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Payment initiated", transactionId: payout.id });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { initiatePaymentToDoctor };
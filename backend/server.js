import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import contactRoutes from "./routes/contactRoutes.js";
import userModel from "./models/userModel.js";
import doctorModel from "./models/doctorModel.js";
import appointmentModel from "./models/appointmentModel.js";
import transactionModel from "./models/transactionModel.js";
import cron from "node-cron";

// App config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Cron job to reset slots for unpaid appointments older than 5 minutes
cron.schedule("* * * * *", async () => {
  try {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes in milliseconds
    const pendingAppointments = await appointmentModel.find({
      payment: false,           // Payment not completed
      cancelled: false,         // Not yet cancelled
      date: { $lt: fiveMinutesAgo }, // Older than 5 minutes
    });

    for (const appointment of pendingAppointments) {
      const doctor = await doctorModel.findById(appointment.docId);
      if (doctor) {
        const slot = doctor.slots.id(appointment.slotId);
        if (slot) {
          slot.status = "Active"; // Reset slot to available
          await doctor.save();
        }
      }
      appointment.cancelled = true; // Mark appointment as cancelled
      await appointment.save();
      console.log(`Cancelled appointment ${appointment._id} due to payment timeout`);
    }
  } catch (error) {
    console.error("Error in appointment cleanup cron job:", error);
  }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
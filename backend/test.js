import express from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

async function getZoomAccessToken() {
  const token = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const res = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    return res.data.access_token;
  } catch (err) {
    console.error("Error getting Zoom access token:", err.response.data);
    throw err;
  }
}

app.get("/create-meeting", async (req, res) => {
  try {
    const accessToken = await getZoomAccessToken();

    const meetingConfig = {
      topic: "Zoom Meeting",
      type: 1,
      settings: {
        host_video: true,
        participant_video: true,
      },
    };

    const zoomRes = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingConfig,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { join_url, password } = zoomRes.data;

    console.log("✅ Meeting Created");
    console.log("Join URL:", join_url);
    console.log("Password:", password);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: "rajvl132011@gmail.com",
      subject: "Zoom Meeting Link",
      html: `<h3>Your Meeting is Ready</h3>
             <p><strong>Join URL:</strong> <a href="${join_url}">${join_url}</a></p>
             <p><strong>Password:</strong> ${password}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Meeting created and email sent!", join_url, password });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).send("Failed to create meeting or send email.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
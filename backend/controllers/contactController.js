import Contact from "../models/contactModel.js";
import { createTransport } from "nodemailer";

export async function sendContactMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    // Save the contact message to the database
    const contactMessage = new Contact({ name, email, message });
    await contactMessage.save();

    // Create a Nodemailer transporter using your email service credentials
    let transporter = createTransport({
      service: "Gmail", // Change if needed or use SMTP settings
      auth: {
        user: process.env.NODEMAILER_EMAIL, // Your email address
        pass: process.env.NODEMAILER_PASSWORD, // Your email password or app-specific password
      },
    });

    // Email HTML Template Function
    const generateEmailTemplate = (title, body) => {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff5f7;">
        <div style="max-width: 600px; margin: 30px auto; border: 1px solid #ffe0e6; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #ff5e8e; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">SAVAYAS HEALS</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <h2 style="color: #ff5e8e; margin-top: 0;">${title}</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              ${body}
            </p>
            <div style="background-color: #ffe0e6; padding: 15px; border-radius: 5px; margin: 20px 0; color: #ff5e8e; font-style: italic;">
              "${message}"
            </div>
            <p style="font-size: 16px; line-height: 1.5;">
              If you have any urgent queries, please feel free to call us at <strong>(91) 8468938745</strong>.
            </p>
            <p style="font-size: 16px; line-height: 1.5; margin: 20px 0 0;">Best Regards,<br/>SAVAYAS HEALS Team</p>
          </div>
          <div style="background-color: #ff5e8e; padding: 10px; text-align: center;">
            <p style="color: #ffffff; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} SAVAYAS HEALS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `;
    };

    // Email options for admin notification
    let mailOptionsAdmin = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL, // Admin email address
      subject: `New Contact Message from ${name}`,
      html: generateEmailTemplate(
        "New Contact Message",
        `You have received a new message from <strong>${name} (${email})</strong>. Please review the message below:`
      ),
    };

    // Email options for user confirmation
    let mailOptionsUser = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "We Received Your Message",
      html: generateEmailTemplate(
        "Thank You for Contacting Us!",
        `Hello <strong>${name}</strong>,<br> We have received your message and will get back to you as soon as possible.`
      ),
    };

    // Send email to admin
    transporter.sendMail(mailOptionsAdmin, (error, info) => {
      if (error) {
        console.error("Error sending email to admin:", error);
      } else {
        console.log("Email sent to admin:", info.response);
      }
    });

    // Send email to user
    transporter.sendMail(mailOptionsUser, (error, info) => {
      if (error) {
        console.error("Error sending email to user:", error);
      } else {
        console.log("Email sent to user:", info.response);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error in sending contact message:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
}

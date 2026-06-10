const nodemailer = require("nodemailer");
require("dotenv").config();

const smtpPort = Number(process.env.SMTP_PORT) || 587;

// CREATE TRANSPORTER (SMTP BASED)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  // port: process.env.SMTP_PORT || 587,
  port: smtpPort,
  secure: smtpPort === 465, // TLS after connect
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// VERIFY SMTP CONNECTION
const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log("SMTP READY");
  } catch (err) {
    console.error("SMTP VERIFICATION FAILED:", err.message);
  }
};

// SEND MAIL FUNCTION
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"MyBookStore" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("MAIL SENT:", info.messageId);

    if (info.rejected.length > 0) {
      console.log("REJECTED EMAILS:", info.rejected);
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    // PROPER ERROR HANDLING
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        console.error("NETWORK ERROR:", err.message);
        break;

      case "EAUTH":
        console.error("AUTH ERROR (Check Email/Password):", err.message);
        break;

      case "EENVELOPE":
        console.error("INVALID RECEIVER:", err.rejected);
        break;

      default:
        console.error("MAIL ERROR:", err.message);
    }

    return { success: false, error: err.message };
  }
};

module.exports = { transporter, verifySMTP, sendMail };

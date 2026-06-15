// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // CREATE TRANSPORTER (SMTP BASED)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: process.env.SMTP_PORT || 587,
//   secure: false, // TLS after connect
//   family: 4,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // VERIFY SMTP CONNECTION
// const verifySMTP = async () => {
//   try {
//     await transporter.verify();
//     console.log("SMTP READY");
//   } catch (err) {
//     console.error("SMTP VERIFICATION FAILED:", err.message);
//   }
// };

// // SEND MAIL FUNCTION
// const sendMail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"MyBookStore" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("MAIL SENT:", info.messageId);

//     if (info.rejected.length > 0) {
//       console.log("REJECTED EMAILS:", info.rejected);
//     }

//     return { success: true, messageId: info.messageId };
//   } catch (err) {
//     // PROPER ERROR HANDLING
//     // switch (err.code) {
//     //   case "ECONNECTION":
//     //   case "ETIMEDOUT":
//     //     console.error("NETWORK ERROR:", err.message);
//     //     break;

//     //   case "EAUTH":
//     //     console.error("AUTH ERROR (Check Email/Password):", err.message);
//     //     break;

//     //   case "EENVELOPE":
//     //     console.error("INVALID RECEIVER:", err.rejected);
//     //     break;

//     //   default:
//     //     console.error("MAIL ERROR:", err.message);
//     // }

//     // return { success: false, error: err.message };

//     console.error("MAIL ERROR:", err.code, err.message);
//     console.error(err);
//     return {
//       success: false,
//       error: `${err.code}: ${err.message}`,
//     };
//   }
// };

// module.exports = { transporter, verifySMTP, sendMail };

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("BREVO SMTP ERROR:", error);
  } else {
    console.log("BREVO SMTP READY");
  }
});

module.exports = transporter;

const nodemailer = require("nodemailer");

require("dotenv").config();

// CHECK ENV

console.log("EMAIL USER => ", process.env.EMAIL_USER);

console.log("EMAIL PASS => ", process.env.EMAIL_PASS);

// SMTP TRANSPORTER

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

// VERIFY SMTP

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR => ", error);
  } else {
    console.log("SMTP READY");
  }
});

module.exports = transporter;

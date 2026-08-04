const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mail");

const createUser = async (req, res) => {
  try {
    const { uName, fName, lName, email, password, role } = req.body;

    if (!uName || !fName || !lName || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // Username Validation
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;

    if (!usernameRegex.test(uName)) {
      return res.status(400).json({
        error:
          "Username must start with a letter and contain only letters, numbers, underscore (_) or dot (.)",
      });
    }

    // Email Validation
    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.indexOf("@") > email.lastIndexOf(".")
    ) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    const duplicate = await User.findOne({ uName });

    if (duplicate) {
      return res.status(201).json({ error: "Username already exists" });
    }

    const hassPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      uName,
      fName,
      lName,
      email,
      password: hassPass,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res
        .status(201)
        .json({ error: "User Succeccfully Created", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { loginId, uName, password } = req.body;

    const userInput = (loginId || uName || "").trim();

    if (!userInput || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({
      $or: [{ uName: userInput }, { email: userInput }],
    });

    if (!user) {
      return res.status(400).json({
        error: "Incorrect username or password",
      });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (!isMatchPass) {
      return res.status(400).json({
        error: "Incorrect username or password",
      });
    }

    // Only admin and super admin can login
    // if (user.role !== "admin" && user.role !== "super_admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only admin can sign in.",
    //   });
    // }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      seacure: true,
      sameSite: "none",
    });

    return res.status(200).json({ messsage: "User Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const readUser = async (req, res) => {
  try {
    const { uName } = req.body;

    if (!uName) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const user = await User.findOne({ uName });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
    console.log(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { uName, fName, lName, email, password } = req.body;

    if (!uName || !fName || !lName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ uName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatePass = await bcrypt.hash(password, 10);

    user.fName = fName;
    user.lName = lName;
    user.email = email;
    user.password = updatePass;

    await user.save();

    res.status(200).json({ message: "User Successfully Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { uName } = req.body;

    const user = await User.findOneAndDelete({ uName });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User Successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("EMAIL:", email);
    console.log("Forgot Password API HIT");

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email is not register",
      });
    }
    console.log(user);

    // OTP GENERATE
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE OTP
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const mailRes = await sendMail({
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your password reset OTP is ${otp}. This OTP is valid for 5 minutes. Do not share it with anyone.`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      </head>

      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:20px 10px;">
      <tr>
      <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="max-width:600px;background:#ffffff;border-radius:8px;">

      <tr>
      <td align="center"
      style="background:#2563eb;padding:20px;color:#ffffff;font-size:26px;font-weight:bold;">
      MyBookStore
      </td>
      </tr>

      <tr>
      <td style="padding:30px 20px;">

      <h2 style="margin-top:0;color:#222;">
      Password Reset Request
      </h2>

      <p style="font-size:16px;color:#555;line-height:24px;">
      Hello,
      </p>

      <p style="font-size:16px;color:#555;line-height:24px;">
      We received a request to reset the password associated with your account. Please use the verification code below to proceed:
      </p>

      <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:25px auto;">
      <tr>
      <td align="center"
      style="
      background:#eff6ff;
      border:2px solid #2563eb;
      padding:15px 25px;
      font-size:30px;
      font-weight:bold;
      color:#2563eb;
      ">
      ${otp}
      </td>
      </tr>
      </table>

      <p style="font-size:15px;color:#555;">
      <b>Important:</b>
      </p>

      <ul style="padding-left:20px;color:#555;font-size:15px;line-height:24px;">
      <li>This OTP is valid for <b>5 minutes</b>.</li>
      <li>Do not share this OTP with anyone.</li>
      <li>If you didn't request this, ignore this email.</li>
      </ul>

      <p style="font-size:16px;color:#555;line-height:24px;">
      Thank you,<br>
      <b>MyBookStore Team</b>
      </p>

      </td>
      </tr>

      <tr>
      <td
      align="center"
      style="
      padding:18px;
      background:#f8f8f8;
      font-size:13px;
      color:#777;
      ">
      © ${new Date().getFullYear()} MyBookStore. All Rights Reserved.
      </td>
      </tr>

      </table>

      </td>
      </tr>
      </table>

      </body>
      </html>
      `,
    });

    if (!mailRes.success) {
      return res.status(500).json({
        message: mailRes.error || "Failed to send OTP",
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    // CHECK OTP
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK EXPIRY
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK EXPIRY
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // HASH PASSWORD
    const hashPass = await bcrypt.hash(password, 10);

    user.password = hashPass;

    // CLEAR OTP
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { uName, currentPassword, newPassword } = req.body;

    // Validation
    if (!uName || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // User Find
    const user = await User.findOne({ uName });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current Password Check
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Same Password Check
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different",
      });
    }

    // Hash New Password
    const hashPass = await bcrypt.hash(newPassword, 10);

    // Update Password
    user.password = hashPass;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  login,
  logout,
  readUser,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
};

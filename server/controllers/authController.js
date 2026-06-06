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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid Gmail address",
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
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({
      $or: [{ uName: loginId }, { email: loginId }],
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (!isMatchPass) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
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
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <div style="padding: 30px;">
            <h2 style="color: #333333; margin-bottom: 15px;">
              Password Reset Request
            </h2>

            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              Hello,
            </p>

            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              We received a request to reset the password associated with your account.
              Please use the verification code below to proceed:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="
                display: inline-block;
                background: #eff6ff;
                color: #2563eb;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                padding: 15px 30px;
                border-radius: 8px;
                border: 2px dashed #2563eb;
              ">
                ${otp}
              </span>
            </div>

            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              <strong>Important:</strong>
            </p>

            <ul style="color: #555555; font-size: 15px; line-height: 1.8;">
              <li>This OTP is valid for <strong>5 minutes</strong>.</li>
              <li>Do not share this code with anyone.</li>
              <li>If you did not request a password reset, please ignore this email.</li>
            </ul>

            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              Thank you,<br>
              <strong>MyBookStore Team</strong>
            </p>
          </div>

          <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 13px;">
            © ${new Date().getFullYear()} MyBookStore. All Rights Reserved.
          </div>

        </div>
      </div>
    `,
    });

    if (!mailRes.success) {
      return res.status(500).json({
        message: "Failed to send OTP",
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

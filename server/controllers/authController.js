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
    const { uName, password } = req.body;

    if (!uName || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ uName });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (!isMatchPass) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    // console.log(uName, password);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

    // SEND MAIL
    const mailRes = await sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
      html: `
        <div style="font-family:sans-serif">
          <h2>Password Reset</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>Valid for 5 minutes</p>
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
};

const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { uName, fName, lName, email, password } = req.body;

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
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json({ error: "User Succeccfully Created" });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

module.exports = {
  createUser,
  login,
  logout,
  readUser,
  updateUser,
  deleteUser,
};

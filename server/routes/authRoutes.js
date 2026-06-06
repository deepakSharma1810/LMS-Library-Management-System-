const express = require("express");
const {
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
} = require("../controllers/authController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/logout").post(verifyToken, logout);

router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

router.route("/change-password").post(verifyToken, changePassword);

router
  .route("/:uName")
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser)
  .get(verifyToken, readUser);

module.exports = router;

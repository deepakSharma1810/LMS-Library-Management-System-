const express = require("express");
const {
  createUser,
  login,
  logout,
  readUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/:uName").put(updateUser).delete(deleteUser).get(readUser);

module.exports = router;

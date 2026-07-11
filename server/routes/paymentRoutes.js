const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/create-order").post(verifyToken, createPaymentOrder);
router.route("/verify").post(verifyToken, verifyPayment);

module.exports = router;

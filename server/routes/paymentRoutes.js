const express = require("express");
const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
  checkPurchase,
} = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyJWT");

router.route("/create-order").post(verifyToken, createPaymentOrder);
router.route("/verify").post(verifyToken, verifyPayment);
router.post("/check-purchase", verifyToken, checkPurchase);

module.exports = router;

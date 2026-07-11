const express = require("express");

const {
  createOrder,
  getMyOrders,
  downloadInvoice,
} = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/").post(verifyToken, createOrder);
router.route("/my-orders").get(verifyToken, getMyOrders);

router.get("/invoice/:id", verifyToken, downloadInvoice);

module.exports = router;

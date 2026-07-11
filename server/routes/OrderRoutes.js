const express = require("express");

const { createOrder, getMyOrders } = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/").post(verifyToken, createOrder);
router.route("/my-orders").get(verifyToken, getMyOrders);

module.exports = router;

const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");
const User = require("../model/User");
const Book = require("../model/Book");

// Create Razorpay Order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Amount Received:", amount);

    const options = {
      amount: Number(amount) * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shipping,
      items,
      subtotal,
      discount,
      delivery,
      total,
    } = req.body;

    // Verify Signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment Signature",
      });
    }

    // Create Order
    const order = await Order.create({
      user: req.user.id,
      shipping,
      items,
      subtotal,
      discount,
      delivery,
      total,
      paymentMethod: "Online",
      paymentStatus: "Paid",
      razorpay_order_id,
      razorpay_payment_id,
    });

    const purchasedBooks = [];

    for (const item of items) {
      const book = await Book.findById(item.book);

      if (!book) continue;

      if (book.bookType === "ebook") {
        purchasedBooks.push(book._id);
      }
    }

    if (purchasedBooks.length > 0) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $addToSet: {
            ebookLibrary: {
              $each: purchasedBooks,
            },
          },
        },
        { new: true },
      );
    }

    res.status(201).json({
      success: true,
      message: "Payment Verified",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};

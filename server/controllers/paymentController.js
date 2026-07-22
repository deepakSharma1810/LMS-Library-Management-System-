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
  console.log(req.body.items);
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

    const user = await User.findById(req.user.id);

    const validatedItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      //  Book type validation
      // if (
      //   (book.bookType === "ebook" && item.bookType !== "ebook") ||
      //   (book.bookType === "physical" && item.bookType !== "physical")
      // ) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `${book.name} does not support ${item.bookType}`,
      //   });
      // }

      if (!book.bookType.includes(item.bookType)) {
        return res.status(400).json({
          success: false,
          message: `${book.name} doesn't support ${item.bookType}`,
        });
      }

      // Ebook already purchased validation
      if (item.bookType === "ebook") {
        const alreadyPurchased = user.ebookLibrary.some(
          (id) => id.toString() === book._id.toString(),
        );

        if (alreadyPurchased) {
          return res.status(400).json({
            success: false,
            message: `${book.name} is already purchased.`,
          });
        }
      }

      validatedItems.push({
        book: book._id,
        quantity: item.quantity,
        price: item.price,
        bookType: item.bookType,
      });
    }

    // Create Order
    const order = await Order.create({
      user: req.user.id,
      shipping,
      items: validatedItems,
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

    for (const item of validatedItems) {
      // const book = await Book.findById(item.book);

      // if (!book) continue;

      if (item.bookType === "ebook") {
        purchasedBooks.push(item.book);
      }
    }

    console.log(items);
    console.log("Purchased Books:", purchasedBooks);

    if (purchasedBooks.length > 0) {
      const user = await User.findByIdAndUpdate(
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
      console.log(user.ebookLibrary);
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

// Check Purchase
const checkPurchase = async (req, res) => {
  try {
    const { items } = req.body;

    const user = await User.findById(req.user.id);

    for (const item of items) {
      const book = await Book.findById(item.book);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      if (item.bookType !== "ebook") {
        continue;
      }

      if (book.bookType.includes("ebook")) {
        const alreadyPurchased = user.ebookLibrary.some(
          (id) => id.toString() === book._id.toString(),
        );

        if (alreadyPurchased) {
          return res.status(400).json({
            success: false,
            message: `${book.name} ebook is already purchased.`,
          });
        }
      }
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  checkPurchase,
};

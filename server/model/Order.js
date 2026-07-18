const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "book",
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: Number,

        accessGranted: {
          type: Boolean,
          default: false,
        },

        bookType: {
          type: String,
          enum: ["physical", "ebook", "both"],
          required: true,
        },
      },
    ],

    shipping: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    subtotal: Number,
    discount: Number,
    delivery: Number,
    total: Number,

    paymentMethod: {
      type: String,
      enum: ["Cod", "Online"],
      default: "ONLINE",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Delivered",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);

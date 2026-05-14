const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["new_book", "update_sell", "delete_book", "add_sell"],
      required: true,
    },
    title: String,
    message: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // ya admin
    },
    meta: {
      bookId: String,
      sellId: String,
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("notification", notificationSchema);
module.exports = Notification;

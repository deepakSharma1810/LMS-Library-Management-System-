const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uName: {
      type: String,
      required: true,
    },
    fName: {
      type: String,
      required: true,
    },
    lName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
      },
    ],
    ebookLibrary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

const User = mongoose.model("users", userSchema);
module.exports = User;

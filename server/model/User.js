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
    },
    password: {
      type: String,
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
module.exports = User;

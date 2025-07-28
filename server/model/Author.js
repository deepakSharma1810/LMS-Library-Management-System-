const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
      },
    ],
  },
  { timestamps: true }
);

const Author = mongoose.model("authores", authorSchema);
module.exports = Author;

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    actualPdf: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
      },
    ],
  },
  { timestamps: true },
);

const Book = mongoose.model("book", bookSchema);
module.exports = Book;

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
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "author",
        },
        name: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("books", bookSchema);
module.exports = Book;

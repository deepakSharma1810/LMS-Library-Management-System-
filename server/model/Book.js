const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      default: 0,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
    actualPdf: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isbn: {
      type: String,
      default: "",
    },
    pages: {
      type: Number,
      default: 0,
    },
    publisher: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "English",
    },
    dimensions: {
      type: String,
      default: "",
    },
    features: [
      {
        type: String,
      },
    ],
    seller: {
      name: {
        type: String,
        default: "BooksWorld",
      },
      rating: {
        type: Number,
        default: 4.5,
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("book", bookSchema);

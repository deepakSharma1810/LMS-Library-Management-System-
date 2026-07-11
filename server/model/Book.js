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

    bookType: {
      type: String,
      enum: ["physical", "ebook"],
      default: "physical",
    },

    ebookPdf: {
      type: String,
      default: "",
    },

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
        ref: "Category",
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    //  =========================

    isNew: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Book = mongoose.model("book", bookSchema);
module.exports = Book;

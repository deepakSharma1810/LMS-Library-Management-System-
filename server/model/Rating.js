const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// same user ek hi book ko ek baar rate kare
ratingSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("rating", ratingSchema);

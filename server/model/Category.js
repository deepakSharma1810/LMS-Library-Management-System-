const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
      },
    ],
    info: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;

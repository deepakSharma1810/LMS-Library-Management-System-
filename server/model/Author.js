const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "Author",
        "Writer",
        "Novelist",
        "Poet",
        "Story Writer",
        "Content Writer",
        "Editor",
        "Researcher",
        "Teacher",
        "Professor",
        "Tech Writer",
        "Motivational Speaker",
      ],
      default: "Author",
    },
    bio: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
      },
    ],
  },
  { timestamps: true },
);

const Author = mongoose.model("author", authorSchema);
module.exports = Author;

const Rating = require("../model/Rating");
const Book = require("../model/Book");
const mongoose = require("mongoose");
const User = require("../model/User");

// Add / Update Rating
const addRating = async (req, res) => {
  try {
    const { rating, review, bookId } = req.body;

    if (!rating || !bookId) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const userId = req.user.id;

    let existing = await Rating.findOne({
      user: userId,
      book: bookId,
    });

    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
    } else {
      await Rating.create({
        user: userId,
        book: bookId,
        rating,
        review,
      });
    }

    // 🔥 recalculate avg rating
    const ratings = await Rating.find({ book: bookId });

    const avg =
      ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: avg.toFixed(1),
      reviews: ratings.length,
    });

    res.json({ success: true, message: "Rating submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Ratings of Book
const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ book: req.params.bookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Rating
const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const rating = await Rating.findById(ratingId);

    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    // Only owner can delete
    if (rating.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Rating.findByIdAndDelete(ratingId);

    //  Recalculate rating
    const ratings = await Rating.find({ book: rating.book });

    const avg =
      ratings.length > 0
        ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length
        : 0;

    await Book.findByIdAndUpdate(rating.book, {
      rating: avg.toFixed(1),
      reviews: ratings.length,
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addRating, getRatings, deleteRating };

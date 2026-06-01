const { search } = require("../routes/authRoutes");

const searchBooks = async (req, res) => {
  try {
    const { search, category, author, minPrice, maxPrice } = req.query;

    let query = {};

    // 🔍 search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 📂 category filter
    if (category) {
      query.categories = category;
    }

    // ✍️ author filter
    if (author) {
      query.author = author;
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const books = await Book.find(query)
      .populate("author")
      .populate("categories");

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchBooks };

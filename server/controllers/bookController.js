const { get } = require("mongoose");
const Book = require("../model/Book");
const Category = require("../model/Category");

const createBook = async (req, res) => {
  try {
    const { name, author, price, coverPhoto, actualPdf } = req.body;

    if (!name || !author || !price || !coverPhoto || !actualPdf) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const duplicate = await Book.findOne({ name });

    if (duplicate) {
      return res.status(400).json({ message: "Book Already Exists" });
    }

    const newBook = new Book({
      name,
      author,
      price,
      coverPhoto,
      actualPdf,
    });

    await newBook.save();

    res.status(201).json({ message: "Book Successfully Created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readBook = async (req, res) => {
  try {
    const { name } = req.body;

    const getBook = await Book.findOne({ name });

    if (!getBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book Successfully found", getBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readBookByAuthor = async (req, res) => {
  try {
    const { name } = req.body;

    const books = await Book.findOne({ "author.name": name });

    if (!books) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book Successfully found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { name, author, price, coverPhoto, actualPdf } = req.body;

    if (!name || !author || !price || !coverPhoto || !actualPdf) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const getBook = await Book.findOne({ name });

    if (!getBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    getBook.author = author;
    getBook.price = price;
    getBook.coverPhoto = coverPhoto;
    getBook.actualPdf = actualPdf;

    await getBook.save();

    res.status(200).json({ message: "Book Successfully Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { name } = req.body;

    const book = await Book.findOneAndDelete({ name });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book Successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  readBook,
  readBookByAuthor,
  updateBook,
  deleteBook,
};

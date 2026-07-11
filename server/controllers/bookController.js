const { io } = require("../index");
const Author = require("../model/Author");
const Book = require("../model/Book");
const Category = require("../model/Category");
const Notification = require("../model/Notification");
const Order = require("../model/Order");

const createBook = async (req, res) => {
  try {
    const {
      name,
      author,
      price,
      mrp,
      coverPhoto,
      actualPdf,
      description,
      rating,
      reviews,
      stock,
      isbn,
      pages,
      publisher,
      language,
      dimensions,
      features,
      seller,
      categories,
      // ---------
      isNew,
      isPopular,
    } = req.body;

    if (!name || !author || !price || !mrp || !coverPhoto || !actualPdf) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const duplicate = await Book.findOne({ name });

    if (duplicate) {
      return res.status(400).json({ message: "Book Already Exists" });
    }

    const authorObj = await Author.findById(author);

    if (!authorObj) {
      return res.status(404).json({ Message: "author not found" });
    }

    if (categories?.length) {
      const validCategories = await Category.find({
        _id: { $in: categories },
      });

      if (validCategories.length !== categories.length) {
        return res.status(404).json({
          message: "Some categories not found",
        });
      }
    }

    const newBook = new Book({
      name,
      author,
      price,
      mrp,
      coverPhoto,
      actualPdf,
      description,
      rating,
      reviews,
      stock,
      isbn,
      pages,
      publisher,
      language,
      dimensions,
      features,
      seller,
      categories,
      // -----------
      isNew: isNew || false,
      isPopular: isPopular || false,
    });

    await newBook.save();

    authorObj.books.push(newBook._id);

    await authorObj.save();

    const io = req.app.get("io");

    const notification = await Notification.create({
      type: "new_book",
      title: `New book listed: ${name}`,
      message: `${authorObj.name} added '${name}'`,
      meta: { bookId: newBook._id },
      unread: true,
    });

    console.log("Done");

    // EMIT REAL-TIME EVENT
    io.emit("new-notification", notification);

    res.status(201).json({ message: "Book Successfully Created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAllBook = async (req, res) => {
  try {
    const { type, search } = req.query;

    let filter = {};

    // SEARCH FILTER
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    //  TYPE FILTER
    if (type === "new") {
      filter.isNew = true;
    } else if (type === "popular") {
      filter.isPopular = true;
    }

    // MAIN BOOKS (with search + type)
    let booksQuery = Book.find(filter).populate("author");

    if (type === "new") {
      booksQuery = booksQuery.sort({ createdAt: -1 }).limit(10);
    } else if (type === "popular") {
      booksQuery = booksQuery.sort({ rating: -1 }).limit(10);
    } else if (type === "previous") {
      booksQuery = booksQuery.sort({ updatedAt: -1 }).limit(10);
    }

    const books = await booksQuery;

    // EXTRA SECTIONS (ONLY WHEN SEARCH EXISTS)
    let popular = [];
    let latest = [];

    if (search) {
      popular = await Book.find({
        ...filter,
        isPopular: true,
      })
        .populate("author")
        .limit(6);

      latest = await Book.find({
        ...filter,
        isNew: true,
      })
        .sort({ createdAt: -1 })
        .populate("author")
        .limit(6);
    }

    res.status(200).json({
      message: "Books fetched successfully",
      books,
      popular,
      latest,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBook = await Book.findById(id).populate("author");
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
    // const { name } = req.body;
    // const books = await Book.findOne({ authorName: name });
    // if (!books) {
    //   return res.status(404).json({ message: "Book not found" });
    // }
    // res.status(200).json({ message: "Book Successfully found" });

    const { authorId } = req.params;

    const books = await Book.find({ author: authorId }).populate("author");

    if (!books.length) {
      return res.status(404).json({
        message: "No books found for this author",
      });
    }

    res.status(200).json({
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      author,
      price,
      mrp,
      coverPhoto,
      actualPdf,
      description,
      rating,
      reviews,
      stock,
      isbn,
      pages,
      publisher,
      language,
      dimensions,
      features,
      seller,
      categories,
      // --------
      isNew,
      isPopular,
    } = req.body;

    // find existing book
    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // if author changed, validate new author
    if (author) {
      const authorObj = await Author.findById(author);

      if (!authorObj) {
        return res.status(404).json({
          message: "Author not found",
        });
      }

      // remove from old author
      if (existingBook.author.toString() !== author) {
        await Author.findByIdAndUpdate(existingBook.author, {
          $pull: { books: existingBook._id },
        });

        // add into new author
        authorObj.books.push(existingBook._id);
        await authorObj.save();
      }
    }

    // category validation
    if (categories?.length) {
      const validCategories = await Category.find({
        _id: { $in: categories },
      });

      if (validCategories.length !== categories.length) {
        return res.status(404).json({
          message: "Some categories not found",
        });
      }
    }

    // update fields only if provided
    existingBook.name = name || existingBook.name;
    existingBook.author = author || existingBook.author;
    existingBook.price = price || existingBook.price;
    existingBook.mrp = mrp || existingBook.mrp;
    existingBook.coverPhoto = coverPhoto || existingBook.coverPhoto;
    existingBook.actualPdf = actualPdf || existingBook.actualPdf;
    existingBook.description = description || existingBook.description;
    existingBook.rating = rating ?? existingBook.rating;
    existingBook.reviews = reviews ?? existingBook.reviews;
    existingBook.stock = stock ?? existingBook.stock;
    existingBook.isbn = isbn || existingBook.isbn;
    existingBook.pages = pages ?? existingBook.pages;
    existingBook.publisher = publisher || existingBook.publisher;
    existingBook.language = language || existingBook.language;
    existingBook.dimensions = dimensions || existingBook.dimensions;
    existingBook.features = features || existingBook.features;
    existingBook.seller = seller || existingBook.seller;
    existingBook.categories = categories || existingBook.categories;
    existingBook.isNew = isNew ?? existingBook.isNew;
    existingBook.isPopular = isPopular ?? existingBook.isPopular;

    await existingBook.save();

    const io = req.app.get("io");

    const notification = await Notification.create({
      type: "update_book",
      title: `Book updated`,
      message: `'${existingBook.name}' has been updated`,
      meta: { bookId: existingBook._id },
      unread: true,
    });

    // EMIT REAL-TIME EVENT
    io.emit("new-notification", notification);

    res.status(200).json({
      message: "Book updated successfully",
      book: existingBook,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const book = await Book.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      message: "Book status updated",
      book,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // remove from author books array
    await Author.findByIdAndUpdate(book.author, {
      $pull: { books: book._id },
    });

    const io = req.app.get("io");

    const notification = await Notification.create({
      type: "delete_book",
      title: `Book deleted`,
      message: `'${book.name}' has been removed`,
      meta: { bookId: book._id },
      unread: true,
    });

    // EMIT REAL-TIME EVENT
    io.emit("new-notification", notification);

    res.status(200).json({ message: "Book Successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readEbook = async (req, res) => {
  try {
    const { id } = req.params;

    // Book exists?
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Physical book cannot be read online
    if (book.bookType === "physical") {
      return res.status(400).json({
        success: false,
        message: "This is a physical book.",
      });
    }

    // User purchased ebook?
    const order = await Order.findOne({
      user: req.user.id,
      paymentStatus: "Paid",
      items: {
        $elemMatch: {
          book: id,
          accessGranted: true,
        },
      },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Please purchase this ebook first.",
      });
    }

    res.status(200).json({
      success: true,
      pdf: book.actualPdf,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createBook,
  readAllBook,
  readBook,
  readBookByAuthor,
  updateBook,
  updateBookStatus,
  deleteBook,
  readEbook,
};

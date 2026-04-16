const Author = require("../model/Author");

const createAuthor = async (req, res) => {
  try {
    const { name, coverPhoto, role, bio, description, books } = req.body;

    if (!name || !coverPhoto || !bio) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const duplicate = await Author.findOne({ name });

    if (duplicate) {
      return res.status(201).json({ message: "Author Already Exists" });
    }

    const newAuthor = new Author({
      name,
      coverPhoto,
      role,
      bio,
      description,
      books: books || [],
    });

    await newAuthor.save();

    res
      .status(200)
      .json({ message: "Author Successfully Created", author: newAuthor });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const readAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id).populate("books");

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author Successfully found", author });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate("books");
    console.log(req.user);
    // console.log(authors);
    if (!authors || authors.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }

    res
      .status(200)
      .json({ message: "All authors fetched successfully", authors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, coverPhoto, role, bio, description, books } = req.body;

    // if (!name || !bio) {
    //   return res.status(400).json({ message: "PLease fill all the feilds" });
    // }

    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    author.name = name || author.name;
    author.coverPhoto = coverPhoto || author.coverPhoto;
    author.role = role || author.role;
    author.bio = bio || author.bio;
    author.description = description || author.description;
    author.books = books || author.books;

    await author.save();

    res.status(200).json({ message: "Author Successfully Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findByIdAndDelete(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author Successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAuthor,
  readAuthor,
  getAllAuthors,
  updateAuthor,
  deleteAuthor,
};

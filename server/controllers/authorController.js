const Author = require("../model/Author");

const createAuthor = async (req, res) => {
  try {
    const { name, coverPhoto, info } = req.body;

    if (!name || !coverPhoto || !info) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const duplicate = await Author.findOne({ name });

    if (duplicate) {
      return res.status(201).json({ message: "Author Already Exists" });
    }

    const newAuthor = new Author({
      name,
      coverPhoto,
      info,
    });

    await newAuthor.save();

    res.status(200).json({ message: "Author Successfully Created" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const readAuthor = async (req, res) => {
  try {
    const { name } = req.body;

    const author = await Author.findOne({ name });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author Successfully found", author });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, coverPhoto, info } = req.body;

    if (!name || !coverPhoto || !info) {
      return res.status(400).json({ message: "PLease fill all the feilds" });
    }

    const author = await Author.findOne({ name });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    author.name = name;
    author.coverPhoto = coverPhoto;
    author.info = info;

    author.save();

    res.status(200).json({ message: "Author Successfully Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { name } = req.body;

    const author = await Author.findOneAndDelete({ name });

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
  updateAuthor,
  deleteAuthor,
};

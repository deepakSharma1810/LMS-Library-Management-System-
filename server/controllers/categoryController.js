const Category = require("../model/Category");
const User = require("../model/User");
const Book = require("../model/Book");

const createCategory = async (req, res) => {
  try {
    const { name, info } = req.body;

    if (!name || !info) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, info });

    await newCategory.save();

    res.status(201).json({ message: "Category Successfully Created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOne({ name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category Successfully found", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, info } = req.body;

    if (!name || !info) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const category = await Category.findOne({ name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    category.info = info;

    res.status(200).json({ message: "Category Successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOneAndDelete({ name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category Successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
};

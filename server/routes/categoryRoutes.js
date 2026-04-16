const express = require("express");
const {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/").post(createCategory).get(getAllCategories);
router
  .route("/:name")
  .get(readCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;

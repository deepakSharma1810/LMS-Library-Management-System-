const express = require("express");
const {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/").post(createCategory);
router
  .route("/:name")
  .get(readCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;

const express = require("express");
const {
  createBook,
  readBook,
  updateBook,
  deleteBook,
  readBookByAuthor,
} = require("../controllers/bookController");

const router = express.Router();

router.route("/").post(createBook);
router
  .route("/:book")
  .get(readBook)
  .patch(updateBook)
  .delete(deleteBook)
  .post(readBookByAuthor);

module.exports = router;

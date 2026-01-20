const express = require("express");
const {
  createBook,
  readBook,
  updateBook,
  deleteBook,
  readBookByAuthor,
  readAllBook,
} = require("../controllers/bookController");

const router = express.Router();

router.route("/").post(createBook).get(readAllBook);
router
  .route("/:id")
  .get(readBook)
  .patch(updateBook)
  .delete(deleteBook)
  .post(readBookByAuthor);

module.exports = router;

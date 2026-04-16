const express = require("express");
const {
  createBook,
  readBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  readBookByAuthor,
  readAllBook,
} = require("../controllers/bookController");

const router = express.Router();

router.route("/").post(createBook).get(readAllBook);
router.patch("/status/:id", updateBookStatus);
router
  .route("/:id")
  .get(readBook)
  .patch(updateBook)
  .delete(deleteBook)
  .post(readBookByAuthor);

module.exports = router;

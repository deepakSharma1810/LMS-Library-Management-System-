const express = require("express");
const {
  createBook,
  readBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  readBookByAuthor,
  readAllBook,
  readEbook,
  myLibrary,
} = require("../controllers/bookController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/").post(createBook).get(readAllBook);
router.patch("/status/:id", updateBookStatus);
// router.get("/author/:authorId", readBookByAuthor);
router
  .route("/:id")
  .get(readBook)
  .patch(updateBook)
  .delete(deleteBook)
  .post(readBookByAuthor);

router.get("/read/:id", verifyToken, readEbook);
router.get("/my-library", verifyToken, myLibrary);
router.get("/read/:id", verifyToken, readEbook);

module.exports = router;

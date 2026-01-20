const express = require("express");

const {
  createAuthor,
  readAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
} = require("../controllers/authorController");

const router = express.Router();

router.route("/").post(createAuthor).get(getAllAuthors);
router.route("/:id").get(readAuthor).patch(updateAuthor).delete(deleteAuthor);

module.exports = router;

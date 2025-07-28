const express = require("express");
const {
  createAuthor,
  readAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const router = express.Router();

router.route("/").post(createAuthor);
router.route("/:name").get(readAuthor).patch(updateAuthor).delete(deleteAuthor);

module.exports = router;

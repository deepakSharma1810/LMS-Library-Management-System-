const express = require("express");

const {
  createAuthor,
  readAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
} = require("../controllers/authorController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/").post(verifyToken, createAuthor).get(getAllAuthors);
router
  .route("/:id")
  .get(readAuthor)
  .patch(verifyToken, updateAuthor)
  .delete(verifyToken, deleteAuthor);

module.exports = router;

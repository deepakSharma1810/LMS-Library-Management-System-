const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  addRating,
  getRatings,
  deleteRating,
} = require("../controllers/ratingController");

const router = express.Router();

router.post("/add", verifyJWT, addRating);
router.get("/:bookId", getRatings);
router.delete("/:ratingId", verifyJWT, deleteRating);

module.exports = router;

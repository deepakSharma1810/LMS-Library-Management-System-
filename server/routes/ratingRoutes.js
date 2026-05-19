const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  addRating,
  getRatings,
  deleteRating,
} = require("../controllers/ratingController");

const router = express.Router();

router.post("/add", addRating);
router.get("/:bookId", getRatings);
router.delete("/:ratingId", deleteRating);

module.exports = router;

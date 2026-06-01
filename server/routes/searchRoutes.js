const express = require("express");
const { searchBooks } = require("../controllers/searchController ");

const router = express.Router();

router.route("/search").get(searchBooks);

module.exports = router;

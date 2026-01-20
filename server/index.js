const dotenv = require("dotenv");
dotenv.config("./.env");
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./config/connection");
const bodyParser = require("body-parser");

// middleware
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const ImageRouter = require("./middleware/multer");

app.get("/", (req, res) => {
  res.send("LMS Server");
});

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/book", bookRoutes);
app.use("/author", authorRoutes);
app.use("/", ImageRouter);

app.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING AT PORT NO " + process.env.PORT);
});

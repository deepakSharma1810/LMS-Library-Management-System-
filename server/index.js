const dotenv = require("dotenv");
// dotenv.config("./.env");
require("dotenv").config();

const { verifySMTP } = require("./utils/mail");
verifySMTP();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

// DB connection
const connection = require("./config/connection");

// middleware
app.use(
  "/uploads",
  cors({ origin: "http://localhost:5173" }),
  express.static("uploads"),
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ImageRouter = require("./middleware/multer");

app.get("/", (req, res) => {
  res.send("LMS Server");
});

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/book", bookRoutes);
app.use("/book/status", bookRoutes);
app.use("/author", authorRoutes);
app.use("/notifications", notificationRoutes);
app.use("/rating", ratingRoutes);
app.use("/", ImageRouter);

//  SOCKET SERVER
const server = http.createServer(app);

// SOCKET INIT
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// GLOBAL ACCESS
app.set("io", io);

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// EXPORT IO
module.exports.io = io;

const PORT = process.env.PORT || 5000;

//  FINAL LISTEN
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT NO ${PORT}`);
});

module.exports = app;

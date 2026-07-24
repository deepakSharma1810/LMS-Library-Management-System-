const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const { verifySMTP } = require("./utils/mail");
verifySMTP();

const app = express();

// DB connection
const connection = require("./config/connection");

// ================= CORS =================
const corsOptions = require("./config/corsOptions");

app.use(cors(corsOptions));

// Handle Preflight Requests
app.options("/.*/", cors(corsOptions));

// middleware
app.use(bodyParser.json());
app.use(express.json());

// Static Uploads
app.use(
  "/uploads",
  cors(corsOptions),
  express.static(path.join(__dirname, "uploads")),
);

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
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
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/", ImageRouter);

//  SOCKET SERVER
const server = http.createServer(app);

// SOCKET INIT
const io = new Server(server, {
  cors: {
    origin: require("./config/whitelist"),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
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

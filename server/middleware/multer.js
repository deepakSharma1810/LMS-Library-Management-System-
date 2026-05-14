const express = require("express");
const multer = require("multer");
// const Author = require("../model/Author");

const ImageRouter = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// IMAGE STORAGE
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// PDF STORAGE
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/pdfs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// IMAGE FILTER
const imageFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG images allowed"), false);
  }
};

// PDF FILTER
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF allowed"), false);
  }
};

// UPLOAD INSTANCES
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: imageFilter,
});

const pdfUpload = multer({
  storage: pdfStorage,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: pdfFilter,
});

// ROUTES
ImageRouter.route("/uploadmulter").post(
  imageUpload.single("ImageData"),
  (req, res, cb) => {
    console.log(req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      return res.status(200).json({ file: req.file.path });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

ImageRouter.route("/upload-pdf").post(
  pdfUpload.single("pdf"),
  (req, res, cb) => {
    console.log(req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No pdf uploaded" });
      }

      return res.status(200).json({ file: req.file.path });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = ImageRouter;

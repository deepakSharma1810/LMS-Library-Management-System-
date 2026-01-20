const express = require("express");
const multer = require("multer");
// const Author = require("../model/Author");

const ImageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

ImageRouter.route("/uploadmulter").post(
  upload.single("ImageData"),
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

    // const newImage = new Author({
    //   coverPhoto: req.file.path,
    //   name: req.body.name,
    //   info: req.body.info,
    // });

    // newImage
    //   .save()
    //   .then((result) => {
    //     console.log(result);
    //     res.status(200).json({
    //       success: true,
    //       document: result,
    //     });
    //   })
    // return res.json({ file: req.file.path }).catch((err) => {
    //   console.log(err);
    //   res.status(500).json({ message: err.message });
    // });
  }
);

module.exports = ImageRouter;

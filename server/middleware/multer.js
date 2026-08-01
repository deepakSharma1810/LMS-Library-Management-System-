// const express = require("express");
// const multer = require("multer");

// const ImageRouter = express.Router();

// // IMAGE STORAGE
// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // PDF STORAGE
// const pdfStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/pdfs");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // IMAGE FILTER
// const imageFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG/PNG images allowed"), false);
//   }
// };

// // PDF FILTER
// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF allowed"), false);
//   }
// };

// // UPLOAD INSTANCES
// const imageUpload = multer({
//   storage: imageStorage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: imageFilter,
// });

// const pdfUpload = multer({
//   storage: pdfStorage,
//   limits: { fileSize: 1024 * 1024 * 20 },
//   fileFilter: pdfFilter,
// });

// // ROUTES
// ImageRouter.route("/uploadmulter").post(
//   imageUpload.single("ImageData"),
//   (req, res, cb) => {
//     console.log(req.file);
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: "No image uploaded" });
//       }

//       return res.status(200).json({ file: req.file.path });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: error.message });
//     }
//   },
// );

// ImageRouter.route("/upload-pdf").post(
//   pdfUpload.single("pdf"),
//   (req, res, cb) => {
//     console.log(req.file);
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: "No pdf uploaded" });
//       }

//       return res.status(200).json({ file: req.file.path });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: error.message });
//     }
//   },
// );

// module.exports = ImageRouter;

const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const ImageRouter = express.Router();

/* ===========================
   IMAGE STORAGE (Cloudinary)
=========================== */

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => {
      const fileName = file.originalname.split(".")[0];
      return `${Date.now()}-${fileName}`;
    },
  },
});

/* ===========================
   PDF STORAGE (Cloudinary)
=========================== */

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/pdfs",
    resource_type: "raw",
    format: "pdf",
    public_id: (req, file) => {
      const fileName = file.originalname.split(".")[0];
      return `${Date.now()}-${fileName}`;
    },
  },
});

/* ===========================
   IMAGE FILTER
=========================== */

const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
  }
};

/* ===========================
   PDF FILTER
=========================== */

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

/* ===========================
   MULTER UPLOADS
=========================== */

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: imageFilter,
});

const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
  fileFilter: pdfFilter,
});

/* ===========================
   IMAGE UPLOAD
=========================== */

ImageRouter.post(
  "/uploadmulter",
  imageUpload.single("ImageData"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        file: req.file.path,
        public_id: req.file.filename,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

/* ===========================
   PDF UPLOAD
=========================== */

ImageRouter.post("/upload-pdf", pdfUpload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      file: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = ImageRouter;

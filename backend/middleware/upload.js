const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

// Always use an absolute path.
// This prevents Render from resolving "uploads/"
// relative to the wrong working directory.

const uploadDir = path.join(
  __dirname,
  "../uploads"
);


// =====================================================
// CREATE UPLOAD DIRECTORY
// =====================================================

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


// =====================================================
// STORAGE CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      uploadDir
    );

  },


  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      path.extname(
        file.originalname
      );

    cb(
      null,
      uniqueName
    );

  },

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype &&
    file.mimetype.startsWith("image/")
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        "Only image files are allowed!"
      ),
      false
    );

  }

};


// =====================================================
// UPLOAD MIDDLEWARE
// =====================================================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    // Maximum image size: 5 MB
    fileSize:
      5 * 1024 * 1024,

  },

});


// =====================================================
// EXPORT
// =====================================================

module.exports = upload;
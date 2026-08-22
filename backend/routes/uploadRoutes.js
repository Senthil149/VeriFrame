const express = require("express");

const router = express.Router();


// ==========================================
// MIDDLEWARE
// ==========================================

const upload =
  require("../middleware/upload");

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// CONTROLLERS
// ==========================================

const {
  uploadImage,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require("../controllers/uploadController");


// ==========================================
// UPLOAD IMAGE
// ==========================================

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  uploadImage
);


// ==========================================
// GET CURRENT USER HISTORY
// ==========================================

router.get(
  "/history",
  authMiddleware,
  getAnalysisHistory
);


// ==========================================
// GET ONE CURRENT USER ANALYSIS
// ==========================================

router.get(
  "/history/:id",
  authMiddleware,
  getAnalysisById
);


// ==========================================
// DELETE CURRENT USER ANALYSIS
// ==========================================

router.delete(
  "/history/:id",
  authMiddleware,
  deleteAnalysis
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;
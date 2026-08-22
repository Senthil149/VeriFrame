const express = require("express");

const router = express.Router();


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// NEWS CONTROLLER
// ==========================================

const {
  analyzeNews,
} = require("../controllers/newsController");


// ==========================================
// FAKE NEWS ANALYSIS
// ==========================================
//
// POST
// /api/news/analyze
//
// Flow:
//
// Frontend
//    ↓
// Node.js
//    ↓
// Authentication
//    ↓
// News Controller
//    ↓
// Python AI
//    ↓
// MongoDB
//

router.post(
  "/analyze",
  authMiddleware,
  analyzeNews
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
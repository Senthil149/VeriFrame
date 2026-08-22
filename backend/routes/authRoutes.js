const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  activateAccount,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  exportUserData,
  deactivateAccount,
  deleteAccount,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);

// Activate deactivated account
router.put(
  "/activate",
  activateAccount
);

// Forgot password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset password
router.put(
  "/reset-password/:token",
  resetPassword
);


// =====================================================
// PROTECTED ROUTES
// =====================================================

// Update Profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// Change Password
router.put(
  "/password",
  authMiddleware,
  changePassword
);

// Export User Data
router.get(
  "/export",
  authMiddleware,
  exportUserData
);

// Deactivate Account
router.put(
  "/deactivate",
  authMiddleware,
  deactivateAccount
);

// Permanently Delete Account
router.delete(
  "/account",
  authMiddleware,
  deleteAccount
);

module.exports = router;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// =====================================================
// REGISTER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("❌ Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated.",
        accountDeactivated: true,
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("❌ Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// ACTIVATE ACCOUNT
// =====================================================

const activateAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.isActive === true) {
      return res.status(400).json({
        success: false,
        message: "Account is already active",
      });
    }

    user.isActive = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
    });
  } catch (error) {
    console.log("❌ Activate Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to activate account",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("❌ Profile Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.log(
      "❌ Change Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update password",
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
      We intentionally return the same message
      whether the email exists or not.
    */

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been generated.",
      });
    }

    // Generate secure random token

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.passwordResetToken =
      hashedToken;

    // Token valid for 15 minutes

    user.passwordResetExpires =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const resetLink =
      `${frontendUrl}/reset-password/${resetToken}`;

    /*
      DEVELOPMENT ONLY

      In production you should send this
      link through an email service.
    */

    console.log(
      "🔐 PASSWORD RESET LINK:",
      resetLink
    );

    res.status(200).json({
      success: true,

      message:
        "If an account exists for this email, a password reset link has been generated.",

      developmentResetLink:
        process.env.NODE_ENV === "production"
          ? undefined
          : resetLink,
    });

  } catch (error) {

    console.log(
      "❌ Forgot Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;

    const { newPassword } =
      req.body;


    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required",
      });
    }


    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password is required",
      });
    }


    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }


    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    const user =
      await User.findOne({

        passwordResetToken:
          hashedToken,

        passwordResetExpires: {
          $gt: new Date(),
        },

      });


    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired",
      });
    }


    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );


    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password",
      });
    }


    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );


    // Remove token after successful reset

    user.passwordResetToken =
      undefined;

    user.passwordResetExpires =
      undefined;


    await user.save();


    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });

  } catch (error) {

    console.log(
      "❌ Reset Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to reset password",
    });
  }
};

// =====================================================
// EXPORT USER DATA
// =====================================================

const exportUserData = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.userId
      ).select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({

      success: true,

      data: {

        account: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage:
            user.profileImage,
          isActive:
            user.isActive,
          createdAt:
            user.createdAt,
          updatedAt:
            user.updatedAt,
        },

        application:
          "VeriFrame",

        exportedAt:
          new Date().toISOString(),
      },

    });

  } catch (error) {

    console.log(
      "❌ Export Data Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to export user data",
    });
  }
};

// =====================================================
// DEACTIVATE ACCOUNT
// =====================================================

const deactivateAccount = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    user.isActive = false;

    await user.save();


    res.status(200).json({
      success: true,
      message:
        "Account deactivated successfully",
    });

  } catch (error) {

    console.log(
      "❌ Deactivate Account Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to deactivate account",
    });
  }
};

// =====================================================
// DELETE ACCOUNT
// =====================================================

const deleteAccount = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    await User.findByIdAndDelete(
      req.userId
    );


    res.status(200).json({
      success: true,
      message:
        "Account deleted successfully",
    });

  } catch (error) {

    console.log(
      "❌ Delete Account Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete account",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {

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

};
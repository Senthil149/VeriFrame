const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(

    {

      name: {
        type: String,
        required: true,
        trim: true,
      },


      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },


      password: {
        type: String,
        required: true,
      },


      profileImage: {
        type: String,
        default: "",
      },


      // =================================================
      // ACCOUNT STATUS
      // =================================================

      isActive: {
        type: Boolean,
        default: true,
      },


      // =================================================
      // PASSWORD RESET
      // =================================================

      passwordResetToken: {
        type: String,
        default: undefined,
      },


      passwordResetExpires: {
        type: Date,
        default: undefined,
      },

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );
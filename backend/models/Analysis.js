const mongoose = require("mongoose");


// ==========================================
// ANALYSIS SCHEMA
// Supports:
// IMAGE analysis
// NEWS analysis
// ==========================================

const analysisSchema = new mongoose.Schema(
  {

    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ==========================================
    // ANALYSIS TYPE
    // ==========================================

    analysisType: {
      type: String,

      enum: [
        "IMAGE",
        "NEWS",
      ],

      default: "IMAGE",

      required: true,
    },


    // ==========================================
    // FILE INFORMATION
    // IMAGE ANALYSIS ONLY
    // ==========================================

    fileName: {
      type: String,
      default: "",
    },

    imagePath: {
      type: String,
      default: "",
    },


    // ==========================================
    // NEWS INFORMATION
    // NEWS ANALYSIS ONLY
    // ==========================================

    newsText: {
      type: String,
      default: "",
    },


    // ==========================================
    // AI RESULT
    // ==========================================

    prediction: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },


    // ==========================================
    // SEMANTIC ANALYSIS
    // IMAGE ANALYSIS
    // ==========================================

    semanticDescription: {
      type: String,
      default: "",
    },


    // ==========================================
    // IMAGE SHA-256 HASH
    // IMAGE ANALYSIS
    // ==========================================

    imageHash: {
      type: String,
      default: "",
    },


    // ==========================================
    // BLOCKCHAIN INFORMATION
    // IMAGE ANALYSIS
    // ==========================================

    blockchainStatus: {
      type: String,
      default: "PENDING",
    },

    blockchainRecordId: {
      type: String,
      default: "",
    },

    blockchainBlockIndex: {
      type: Number,
      default: null,
    },

    blockchainBlockHash: {
      type: String,
      default: "",
    },

    blockchainPreviousHash: {
      type: String,
      default: "",
    },

    blockchainVerified: {
      type: Boolean,
      default: false,
    },

  },

  {
    timestamps: true,
  }
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
  mongoose.model(
    "Analysis",
    analysisSchema
  );
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const Analysis = require("../models/Analysis");


// =====================================================
// BLOCKCHAIN
// =====================================================

const {
  veriFrameBlockchain,
} = require("../blockchain/VeriFrameBlockchain");


// =====================================================
// UPLOAD IMAGE + AI ANALYSIS
// =====================================================

const uploadImage = async (req, res) => {

  try {

    // =================================================
    // CHECK AUTHENTICATION
    // =================================================

    if (!req.userId) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication required",

      });

    }


    // =================================================
    // CHECK IMAGE
    // =================================================

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          "No image uploaded",

      });

    }


    // =================================================
    // CREATE FORM DATA
    // =================================================

    const form =
      new FormData();


    form.append(
      "image",
      fs.createReadStream(
        req.file.path
      )
    );


    // =================================================
    // SEND IMAGE TO PYTHON AI SERVICE
    // =================================================

    console.log(
      "🤖 Sending image to AI service..."
    );


    const response =
      await axios.post(

        "http://localhost:5001/analyze",

        form,

        {

          headers:
            form.getHeaders(),

          timeout:
            120000,

        }

      );


    // =================================================
    // GET AI RESPONSE
    // =================================================

    const aiResult =
      response.data;


    console.log(
      "🤖 Flask Response:",
      aiResult
    );


    // =================================================
    // CHECK AI RESPONSE
    // =================================================

    if (
      !aiResult ||
      !aiResult.success
    ) {

      return res.status(500).json({

        success: false,

        message:
          aiResult?.message ||
          "AI image analysis failed",

      });

    }


    // =================================================
    // IMAGE SHA-256
    // =================================================

    const imageBuffer =
      fs.readFileSync(
        req.file.path
      );


    const imageHash =
      crypto
        .createHash("sha256")
        .update(imageBuffer)
        .digest("hex");


    console.log(
      "🔐 Image SHA-256 Hash:",
      imageHash
    );


    // =================================================
    // SEMANTIC ANALYSIS
    // =================================================

    const semanticDescription =
      aiResult
        .semanticAnalysis
        ?.success
        ? aiResult
            .semanticAnalysis
            .description
        : "";


    console.log(
      "🧠 Semantic Description:",
      semanticDescription
    );


    // =================================================
    // SAVE IMAGE ANALYSIS
    // =================================================

    console.log(
      "💾 Saving image analysis to MongoDB..."
    );


    const analysis =
      await Analysis.create({

        user:
          req.userId,

        analysisType:
          "IMAGE",

        fileName:
          req.file.originalname,

        imagePath:
          req.file.path,

        newsText:
          "",

        prediction:
          aiResult.prediction,

        confidence:
          Number(
            aiResult.confidence || 0
          ),

        semanticDescription:
          semanticDescription,

        imageHash:
          imageHash,

        blockchainStatus:
          "PENDING",

        blockchainRecordId:
          "",

        blockchainBlockIndex:
          null,

        blockchainBlockHash:
          "",

        blockchainPreviousHash:
          "",

        blockchainVerified:
          false,

      });


    console.log(
      "✅ Image analysis saved:",
      analysis._id
    );


    console.log(
      "👤 Analysis belongs to user:",
      req.userId
    );


    // =================================================
    // CREATE BLOCKCHAIN RECORD
    // =================================================

    console.log(
      "🔗 Creating blockchain record..."
    );


    let blockchainStatus =
      "FAILED";

    let blockchainRecordId =
      "";

    let blockchainBlockIndex =
      null;

    let blockchainBlockHash =
      "";

    let blockchainPreviousHash =
      "";

    let blockchainVerified =
      false;


    try {

      // IMPORTANT:
      // Blockchain is now persistent in MongoDB,
      // therefore this operation is asynchronous.

      const blockchainBlock =
        await veriFrameBlockchain.addAnalysisBlock({

          analysisId:
            analysis._id,

          userId:
            req.userId,

          imageHash:
            imageHash,

          prediction:
            aiResult.prediction,

          confidence:
            Number(
              aiResult.confidence || 0
            ),

          semanticDescription:
            semanticDescription,

        });


      // =================================================
      // BLOCKCHAIN INFORMATION
      // =================================================

      blockchainRecordId =
        blockchainBlock.data.analysisId;


      blockchainBlockIndex =
        blockchainBlock.index;


      blockchainBlockHash =
        blockchainBlock.hash;


      blockchainPreviousHash =
        blockchainBlock.previousHash;


      // =================================================
      // VERIFY BLOCKCHAIN
      // =================================================

      const verification =
        await veriFrameBlockchain.verifyImage(

          analysis._id,

          imageHash

        );


      blockchainVerified =
        verification.verified;


      blockchainStatus =
        blockchainVerified
          ? "VERIFIED"
          : "FAILED";


      console.log(
        "🔗 Blockchain status:",
        blockchainStatus
      );


      console.log(
        "🔗 Blockchain block:",
        blockchainBlockIndex
      );


      console.log(
        "🔐 Blockchain hash:",
        blockchainBlockHash
      );


      console.log(
        "↩️ Previous hash:",
        blockchainPreviousHash
      );


    } catch (blockchainError) {

      console.log(
        "❌ Blockchain Error:",
        blockchainError
      );


      blockchainStatus =
        "FAILED";

    }


    // =================================================
    // UPDATE MONGODB WITH BLOCKCHAIN DATA
    // =================================================

    analysis.blockchainStatus =
      blockchainStatus;


    analysis.blockchainRecordId =
      blockchainRecordId;


    analysis.blockchainBlockIndex =
      blockchainBlockIndex;


    analysis.blockchainBlockHash =
      blockchainBlockHash;


    analysis.blockchainPreviousHash =
      blockchainPreviousHash;


    analysis.blockchainVerified =
      blockchainVerified;


    await analysis.save();


    console.log(
      "💾 Blockchain information saved to MongoDB"
    );


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      analysisType:
        "IMAGE",

      prediction:
        aiResult.prediction,

      confidence:
        Number(
          aiResult.confidence || 0
        ),

      semanticAnalysis: {

        success:
          aiResult
            .semanticAnalysis
            ?.success ||
          false,

        description:
          semanticDescription,

      },

      imageHash:
        imageHash,

      blockchainStatus:
        blockchainStatus,

      blockchainRecordId:
        blockchainRecordId,

      blockchainBlockIndex:
        blockchainBlockIndex,

      blockchainBlockHash:
        blockchainBlockHash,

      blockchainPreviousHash:
        blockchainPreviousHash,

      blockchainVerified:
        blockchainVerified,

      analysisId:
        analysis._id,

      fileName:
        req.file.filename,

      imageUrl:
        `http://localhost:5000/uploads/${req.file.filename}`,

    });


  } catch (error) {

    console.log(
      "❌ Upload/AI Error:",
      error
    );


    if (error.response) {

      console.log(
        "❌ AI Service Status:",
        error.response.status
      );


      console.log(
        "❌ AI Service Response:",
        error.response.data
      );

    }


    return res.status(500).json({

      success: false,

      message:
        error.response?.data?.message ||
        error.message ||
        "AI Service Failed",

    });

  }

};


// =====================================================
// GET CURRENT USER ANALYSIS HISTORY
// =====================================================

const getAnalysisHistory =
  async (req, res) => {

    try {

      if (!req.userId) {

        return res.status(401).json({

          success: false,

          message:
            "Authentication required",

        });

      }


      const analyses =
        await Analysis.find({

          user:
            req.userId,

        })
        .sort({

          createdAt:
            -1,

        });


      const normalizedAnalyses =
        analyses.map(
          (analysis) => {

            const item =
              analysis.toObject();


            // ==========================================
            // DETERMINE TYPE FOR OLD RECORDS
            // ==========================================

            if (
              !item.analysisType
            ) {

              item.analysisType =
                item.imagePath
                  ? "IMAGE"
                  : "NEWS";

            }


            // ==========================================
            // IMAGE
            // ==========================================

            if (
              item.analysisType ===
              "IMAGE"
            ) {

              item.newsText =
                item.newsText ||
                "";

            }


            // ==========================================
            // NEWS
            // ==========================================

            if (
              item.analysisType ===
              "NEWS"
            ) {

              item.fileName =
                item.fileName ||
                "Fake News Analysis";

              item.imagePath =
                "";

              item.imageHash =
                "";

              item.semanticDescription =
                "";

              item.blockchainStatus =
                "NOT_APPLICABLE";

              item.blockchainRecordId =
                "";

              item.blockchainBlockIndex =
                null;

              item.blockchainBlockHash =
                "";

              item.blockchainPreviousHash =
                "";

              item.blockchainVerified =
                false;

              item.newsText =
                item.newsText ||
                "";

            }


            return item;

          }
        );


      console.log(
        "📚 History records found:",
        normalizedAnalyses.length
      );


      console.log(
        "📊 History types:",
        normalizedAnalyses.map(
          (item) => ({

            id:
              item._id,

            type:
              item.analysisType,

            prediction:
              item.prediction,

            confidence:
              item.confidence,

          })
        )
      );


      return res.status(200).json({

        success: true,

        count:
          normalizedAnalyses.length,

        analyses:
          normalizedAnalyses,

      });


    } catch (error) {

      console.log(
        "❌ History Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch analysis history",

      });

    }

  };


// =====================================================
// GET ONE ANALYSIS BY ID
// =====================================================

const getAnalysisById =
  async (req, res) => {

    try {

      if (!req.userId) {

        return res.status(401).json({

          success: false,

          message:
            "Authentication required",

        });

      }


      const analysis =
        await Analysis.findOne({

          _id:
            req.params.id,

          user:
            req.userId,

        });


      if (!analysis) {

        return res.status(404).json({

          success: false,

          message:
            "Analysis not found",

        });

      }


      // ==========================================
      // NEWS ANALYSIS
      // ==========================================

      if (
        analysis.analysisType ===
        "NEWS"
      ) {

        return res.status(200).json({

          success: true,

          analysis: {

            ...analysis.toObject(),

            analysisType:
              "NEWS",

            fileName:
              analysis.fileName ||
              "Fake News Analysis",

            imagePath:
              "",

            blockchainStatus:
              "NOT_APPLICABLE",

            blockchainVerified:
              false,

          },

        });

      }


      // ==========================================
      // IMAGE ANALYSIS
      // ==========================================

      return res.status(200).json({

        success: true,

        analysis: {

          ...analysis.toObject(),

          analysisType:
            "IMAGE",

          blockchainStatus:
            analysis.blockchainStatus ||
            "PENDING",

          blockchainVerified:
            analysis.blockchainVerified ||
            false,

          blockchainRecordId:
            analysis.blockchainRecordId ||
            "",

          blockchainBlockIndex:
            analysis.blockchainBlockIndex ??
            null,

          blockchainBlockHash:
            analysis.blockchainBlockHash ||
            "",

          blockchainPreviousHash:
            analysis.blockchainPreviousHash ||
            "",

        },

      });


    } catch (error) {

      console.log(
        "❌ Get Analysis Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch analysis",

      });

    }

  };


// =====================================================
// DELETE ANALYSIS
// =====================================================

const deleteAnalysis =
  async (req, res) => {

    try {

      if (!req.userId) {

        return res.status(401).json({

          success: false,

          message:
            "Authentication required",

        });

      }


      const analysis =
        await Analysis.findOne({

          _id:
            req.params.id,

          user:
            req.userId,

        });


      if (!analysis) {

        return res.status(404).json({

          success: false,

          message:
            "Analysis not found",

        });

      }


      // ==========================================
      // DELETE IMAGE FILE
      // ==========================================

      if (

        analysis.analysisType ===
        "IMAGE" &&

        analysis.imagePath

      ) {

        try {

          const imagePath =
            path.resolve(
              analysis.imagePath
            );


          if (
            fs.existsSync(
              imagePath
            )
          ) {

            fs.unlinkSync(
              imagePath
            );


            console.log(
              "🗑️ Image file deleted:",
              imagePath
            );

          }

        } catch (fileError) {

          console.log(
            "⚠️ Could not delete image file:",
            fileError.message
          );

        }

      }


      // ==========================================
      // DELETE MONGODB ANALYSIS
      // ==========================================

      await Analysis.findByIdAndDelete(
        analysis._id
      );


      console.log(
        "✅ Analysis deleted from MongoDB:",
        analysis._id
      );


      return res.status(200).json({

        success: true,

        message:

          analysis.analysisType ===
          "NEWS"

            ? "News analysis deleted successfully"

            : "Image analysis deleted successfully",

      });


    } catch (error) {

      console.log(
        "❌ Delete Analysis Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete analysis",

      });

    }

  };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  uploadImage,

  getAnalysisHistory,

  getAnalysisById,

  deleteAnalysis,

};
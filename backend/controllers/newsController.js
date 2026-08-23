const axios = require("axios");

const Analysis =
  require("../models/Analysis");


// ==========================================
// FAKE NEWS ANALYSIS
// ==========================================

const analyzeNews = async (
  req,
  res
) => {

  try {

    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    if (!req.userId) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication required",

      });

    }


    // ==========================================
    // GET NEWS TEXT
    // ==========================================

    const { text } =
      req.body;


    if (
      !text ||
      !text.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "News content is required",

      });

    }


    const cleanedText =
      text.trim();


    console.log(
      "📰 Sending news to AI service..."
    );


    // ==========================================
    // SEND TO PYTHON AI SERVICE
    // ==========================================

    const response =
      await axios.post(
"https://veriframe-ai-service.onrender.com/analyze-news",

        {
          text:
            cleanedText,
        },

        {
          timeout:
            120000,
        }

      );


    // ==========================================
    // GET AI RESPONSE
    // ==========================================

    const aiResult =
      response.data;


    console.log(
      "📰 News AI Response:",
      aiResult
    );


    // ==========================================
    // CHECK AI RESPONSE
    // ==========================================

    if (
      !aiResult ||
      !aiResult.success
    ) {

      return res.status(500).json({

        success: false,

        message:
          aiResult?.message ||
          "News AI analysis failed",

      });

    }


    // ==========================================
    // NORMALIZE RESULT
    // ==========================================

    const prediction =
      String(
        aiResult.prediction ||
        "UNCERTAIN"
      ).toUpperCase();


    const confidence =
      Number(
        aiResult.confidence ||
        0
      );


    // ==========================================
    // SAVE NEWS ANALYSIS
    // ==========================================

    console.log(
      "💾 Saving Fake News analysis to MongoDB..."
    );


    const analysis =
      await Analysis.create({

        user:
          req.userId,

        // IMPORTANT
        analysisType:
          "NEWS",

        // No image for news
        fileName:
          "",

        imagePath:
          "",

        // Store article text
        newsText:
          cleanedText,

        // AI result
        prediction:
          prediction,

        confidence:
          confidence,

        // News does not use these
        semanticDescription:
          "",

        imageHash:
          "",

        blockchainStatus:
          "NOT_APPLICABLE",

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
      "✅ Fake News analysis saved:",
      analysis._id
    );


    console.log(
      "👤 News analysis belongs to user:",
      req.userId
    );


    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return res.status(200).json({

      success: true,

      prediction:
        prediction,

      confidence:
        confidence,

      message:
        aiResult.message ||
        "News analysis completed.",

      analysisId:
        analysis._id,

      analysisType:
        "NEWS",

    });


  } catch (error) {

    // ==========================================
    // ERROR
    // ==========================================

    console.log(
      "❌ Fake News Analysis Error:",
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
        "Fake news analysis failed",

    });

  }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  analyzeNews,

};
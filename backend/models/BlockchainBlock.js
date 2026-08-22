 const mongoose = require("mongoose");


// ==========================================
// BLOCKCHAIN BLOCK SCHEMA
// ==========================================

const blockchainBlockSchema =
  new mongoose.Schema(

    {

      // ==========================================
      // BLOCK INDEX
      // ==========================================

      index: {

        type: Number,

        required: true,

        unique: true,

      },


      // ==========================================
      // BLOCK TIMESTAMP
      // ==========================================

      timestamp: {

        type: String,

        required: true,

      },


      // ==========================================
      // BLOCK DATA
      // ==========================================

      data: {

        type:
          mongoose.Schema.Types.Mixed,

        required: true,

      },


      // ==========================================
      // PREVIOUS BLOCK HASH
      // ==========================================

      previousHash: {

        type: String,

        required: true,

      },


      // ==========================================
      // CURRENT BLOCK HASH
      // ==========================================

      hash: {

        type: String,

        required: true,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// ANALYSIS ID INDEX
// ==========================================

blockchainBlockSchema.index({

  "data.analysisId": 1,

});


// ==========================================
// EXPORT MONGOOSE MODEL
// ==========================================

const BlockchainBlock =
  mongoose.model(
    "BlockchainBlock",
    blockchainBlockSchema
  );


module.exports =
  BlockchainBlock;
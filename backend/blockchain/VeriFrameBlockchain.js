const crypto = require("crypto");


// ==========================================
// BLOCK CLASS
// ==========================================

class Block {

  constructor(
    index,
    timestamp,
    data,
    previousHash = ""
  ) {

    this.index =
      index;

    this.timestamp =
      timestamp;

    this.data =
      data;

    this.previousHash =
      previousHash;

    this.hash =
      this.calculateHash();

  }


  // ==========================================
  // CREATE BLOCK HASH
  // ==========================================

  calculateHash() {

    return crypto
      .createHash("sha256")
      .update(

        this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash

      )
      .digest("hex");

  }

}


// ==========================================
// VERIFRAME BLOCKCHAIN
// ==========================================

class VeriFrameBlockchain {

  constructor() {

    this.chain = [];

  }


  // ==========================================
  // CREATE GENESIS BLOCK
  // ==========================================

  createGenesisBlock() {

    return new Block(

      0,

      new Date().toISOString(),

      {

        type:
          "GENESIS",

        message:
          "VeriFrame Blockchain Genesis Block",

      },

      "0"

    );

  }


  // ==========================================
  // INITIALIZE BLOCKCHAIN
  // ==========================================

  async initialize() {

    try {

      const BlockchainBlock =
        require("../models/BlockchainBlock");


      // ==========================================
      // GET ALL BLOCKS
      // ==========================================

      const blocks =
        await BlockchainBlock
          .find({})
          .sort({
            index: 1,
          });


      // ==========================================
      // NO BLOCKS
      // ==========================================

      if (
        blocks.length === 0
      ) {

        console.log(
          "🔗 No blockchain blocks found."
        );

        console.log(
          "🔗 Creating Genesis Block..."
        );


        const genesis =
          this.createGenesisBlock();


        await BlockchainBlock.create({

          index:
            genesis.index,

          timestamp:
            genesis.timestamp,

          data:
            genesis.data,

          previousHash:
            genesis.previousHash,

          hash:
            genesis.hash,

        });


        this.chain = [
          genesis
        ];


        console.log(
          "✅ Genesis Block created."
        );


        return this.chain;

      }


      // ==========================================
      // LOAD BLOCKCHAIN
      // ==========================================

      this.chain =
        blocks.map(
          (block) =>

            new Block(

              block.index,

              block.timestamp,

              block.data,

              block.previousHash

            )
        );


      // ==========================================
      // PRESERVE STORED HASH
      // ==========================================

      this.chain =
        blocks.map(
          (block) => {

            const restoredBlock =
              new Block(

                block.index,

                block.timestamp,

                block.data,

                block.previousHash

              );


            restoredBlock.hash =
              block.hash;


            return restoredBlock;

          }
        );


      console.log(
        `🔗 Blockchain loaded: ${this.chain.length} blocks`
      );


      return this.chain;


    } catch (error) {

      console.error(
        "❌ Blockchain initialization error:",
        error
      );


      throw error;

    }

  }


  // ==========================================
  // GET LATEST BLOCK
  // ==========================================

  getLatestBlock() {

    if (
      this.chain.length === 0
    ) {

      return null;

    }


    return this.chain[
      this.chain.length - 1
    ];

  }


  // ==========================================
  // ADD ANALYSIS BLOCK
  // ==========================================

  async addAnalysisBlock({

    analysisId,

    userId,

    imageHash,

    prediction,

    confidence,

    semanticDescription,

  }) {

    try {

      const BlockchainBlock =
        require("../models/BlockchainBlock");


      // ==========================================
      // MAKE SURE BLOCKCHAIN IS INITIALIZED
      // ==========================================

      if (
        this.chain.length === 0
      ) {

        await this.initialize();

      }


      // ==========================================
      // GET PREVIOUS BLOCK
      // ==========================================

      const previousBlock =
        this.getLatestBlock();


      if (!previousBlock) {

        throw new Error(
          "Previous blockchain block not found"
        );

      }


      // ==========================================
      // BLOCK DATA
      // ==========================================

      const blockData = {

        type:
          "IMAGE_ANALYSIS",

        analysisId:
          analysisId.toString(),

        userId:
          userId.toString(),

        imageHash:
          imageHash,

        prediction:
          prediction,

        confidence:
          confidence,

        semanticDescription:
          semanticDescription,

      };


      // ==========================================
      // CREATE BLOCK
      // ==========================================

      const newBlock =
        new Block(

          this.chain.length,

          new Date().toISOString(),

          blockData,

          previousBlock.hash

        );


      // ==========================================
      // SAVE BLOCK TO MONGODB
      // ==========================================

      await BlockchainBlock.create({

        index:
          newBlock.index,

        timestamp:
          newBlock.timestamp,

        data:
          newBlock.data,

        previousHash:
          newBlock.previousHash,

        hash:
          newBlock.hash,

      });


      // ==========================================
      // ADD TO MEMORY
      // ==========================================

      this.chain.push(
        newBlock
      );


      console.log(
        "🔗 Blockchain block created:",
        newBlock.index
      );


      console.log(
        "🔐 Block hash:",
        newBlock.hash
      );


      console.log(
        "↩️ Previous hash:",
        newBlock.previousHash
      );


      console.log(
        "💾 Blockchain block saved to MongoDB"
      );


      return newBlock;


    } catch (error) {

      console.error(
        "❌ Blockchain block creation error:",
        error
      );


      throw error;

    }

  }


  // ==========================================
  // VERIFY ENTIRE BLOCKCHAIN
  // ==========================================

  async isChainValid() {

    try {

      // ==========================================
      // LOAD LATEST DATABASE STATE
      // ==========================================

      await this.initialize();


      // ==========================================
      // CHECK BLOCKCHAIN
      // ==========================================

      for (
        let i = 0;
        i < this.chain.length;
        i++
      ) {

        const currentBlock =
          this.chain[i];


        // ==========================================
        // GENESIS BLOCK
        // ==========================================

        if (i === 0) {

          if (
            currentBlock.previousHash !==
            "0"
          ) {

            return false;

          }

        }


        // ==========================================
        // CURRENT HASH
        // ==========================================

        if (
          currentBlock.hash !==
          currentBlock.calculateHash()
        ) {

          console.log(
            "❌ Blockchain hash mismatch at block:",
            currentBlock.index
          );


          return false;

        }


        // ==========================================
        // PREVIOUS BLOCK
        // ==========================================

        if (i > 0) {

          const previousBlock =
            this.chain[i - 1];


          if (
            currentBlock.previousHash !==
            previousBlock.hash
          ) {

            console.log(
              "❌ Blockchain connection broken at block:",
              currentBlock.index
            );


            return false;

          }

        }

      }


      return true;


    } catch (error) {

      console.error(
        "❌ Blockchain validation error:",
        error
      );


      return false;

    }

  }


  // ==========================================
  // FIND BLOCK BY ANALYSIS ID
  // ==========================================

  async findByAnalysisId(
    analysisId
  ) {

    try {

      // ==========================================
      // SEARCH MEMORY FIRST
      // ==========================================

      const memoryBlock =
        this.chain.find(

          (block) =>

            block.data?.analysisId ===
            analysisId.toString()

        );


      if (memoryBlock) {

        return memoryBlock;

      }


      // ==========================================
      // SEARCH MONGODB
      // ==========================================

      const BlockchainBlock =
        require("../models/BlockchainBlock");


      const databaseBlock =
        await BlockchainBlock.findOne({

          "data.analysisId":
            analysisId.toString(),

        });


      if (!databaseBlock) {

        return null;

      }


      const block =
        new Block(

          databaseBlock.index,

          databaseBlock.timestamp,

          databaseBlock.data,

          databaseBlock.previousHash

        );


      block.hash =
        databaseBlock.hash;


      return block;


    } catch (error) {

      console.error(
        "❌ Find blockchain block error:",
        error
      );


      return null;

    }

  }


  // ==========================================
  // VERIFY IMAGE
  // ==========================================

  async verifyImage(
    analysisId,
    imageHash
  ) {

    try {

      // ==========================================
      // FIND BLOCK
      // ==========================================

      const block =
        await this.findByAnalysisId(
          analysisId
        );


      // ==========================================
      // NO BLOCK
      // ==========================================

      if (!block) {

        return {

          verified:
            false,

          reason:
            "No blockchain record found",

        };

      }


      // ==========================================
      // CHECK IMAGE HASH
      // ==========================================

      if (
        block.data.imageHash !==
        imageHash
      ) {

        return {

          verified:
            false,

          reason:
            "Image hash does not match blockchain record",

          block,

        };

      }


      // ==========================================
      // CHECK ENTIRE CHAIN
      // ==========================================

      const chainValid =
        await this.isChainValid();


      if (!chainValid) {

        return {

          verified:
            false,

          reason:
            "Blockchain integrity check failed",

          block,

        };

      }


      // ==========================================
      // VERIFIED
      // ==========================================

      return {

        verified:
          true,

        reason:
          "Image verified successfully",

        block,

      };


    } catch (error) {

      console.error(
        "❌ Image blockchain verification error:",
        error
      );


      return {

        verified:
          false,

        reason:
          "Blockchain verification failed",

      };

    }

  }

}


// ==========================================
// SINGLE VERIFRAME BLOCKCHAIN INSTANCE
// ==========================================

const veriFrameBlockchain =
  new VeriFrameBlockchain();


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  Block,

  VeriFrameBlockchain,

  veriFrameBlockchain,

};
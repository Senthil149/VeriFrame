const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();


// ==========================================
// BLOCKCHAIN
// ==========================================

const {
  veriFrameBlockchain,
} = require("./blockchain/VeriFrameBlockchain");


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
  require("./routes/authRoutes");

const uploadRoutes =
  require("./routes/uploadRoutes");

const newsRoutes =
  require("./routes/newsRoutes");


// ==========================================
// EXPRESS APP
// ==========================================

const app =
  express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors()
);

app.use(
  express.json()
);


// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);


// ==========================================
// API ROUTES
// ==========================================

// Authentication

app.use(
  "/api/auth",
  authRoutes
);


// Image upload / analysis

app.use(
  "/api/upload",
  uploadRoutes
);


// Fake News

app.use(
  "/api/news",
  newsRoutes
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(
    process.env.MONGO_URI
  )

  .then(
    async () => {

      console.log(
        "✅ MongoDB Connected Successfully"
      );


      // ==========================================
      // INITIALIZE PERSISTENT BLOCKCHAIN
      // ==========================================

      try {

        await veriFrameBlockchain.initialize();


        console.log(
          "🔗 Blockchain initialized successfully"
        );


      } catch (blockchainError) {

        console.log(
          "❌ Blockchain initialization failed:",
          blockchainError
        );

      }

    }
  )

  .catch(
    (err) => {

      console.log(
        "❌ MongoDB Connection Error:",
        err
      );

    }
  );


// ==========================================
// TEST ROUTE
// ==========================================

app.get(
  "/",
  (req, res) => {

    res.send(
      "VeriFrame Backend is Running 🚀"
    );

  }
);


// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server is running on port ${PORT}`
    );

  }
);
// Vercel Serverless Function Handler
// Import from compiled dist folder
const { app } = require("../dist/server");
const { connectMongoDB } = require("../dist/database/mongodb/connection");

// Initialize MongoDB connection for serverless
let isConnected = false;

module.exports = async (req, res) => {
  try {
    // Connect to MongoDB only once (reuse connection between invocations)
    if (!isConnected) {
      await connectMongoDB();
      isConnected = true;
    }

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

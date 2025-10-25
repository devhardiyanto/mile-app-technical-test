// Vercel Serverless Function Handler
import { app } from "../src/server";
import { connectMongoDB } from "../src/database/mongodb/connection";

// Initialize MongoDB connection for serverless
let isConnected = false;

const handler = async (req: any, res: any) => {
  // Connect to MongoDB only once (reuse connection between invocations)
  if (!isConnected) {
    await connectMongoDB();
    isConnected = true;
  }

  // Handle the request with Express app
  return app(req, res);
};

export default handler;

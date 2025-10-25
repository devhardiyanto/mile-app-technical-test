import { env } from "@/common/utils/env.config";
import { app, logger } from "@/server";
import { testMySQLConnection } from "@/database/mysql/connection";
import { connectMongoDB, disconnectMongoDB } from "@/database/mongodb/connection";

const server = app.listen(env.PORT, async () => {
  const { NODE_ENV, HOST, PORT } = env;
  
  // Test database connections
  await testMySQLConnection();
  await connectMongoDB();
  
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = async () => {
  logger.info("sigint received, shutting down");
  
  // Disconnect from databases
  await disconnectMongoDB();
  
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

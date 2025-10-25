import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { openAPIRouter } from "@/api-docs";
import errorHandler from "@/common/middleware/error-handler";
import rateLimiter from "@/common/middleware/rate-limiter";
import requestLogger from "@/common/middleware/request-logger";
import { env } from "@/common/utils/env.config";

// Routes
import { healthCheckRouter } from "@/api/health/health.router";
import { authRouter } from "@/api/auth/auth.router";
import { userRouter } from "@/api/user/user.router";
import { taskRouter } from "@/api/task/task.router";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
// app.set("trust proxy", true);
if (env.NODE_ENV === "production") {
  app.set("trust proxy", "loopback"); // atau sesuai setup production
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health", healthCheckRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };

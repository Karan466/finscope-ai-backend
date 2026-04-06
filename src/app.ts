import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import router from "./routes";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

// ✅ Security middlewares
app.use(helmet());

// ✅ CORS (PRODUCTION READY)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      env.CLIENT_URL, // 🔥 from Render env
    ],
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json());

// ✅ Cookies
app.use(cookieParser());

// ✅ Logger
app.use(morgan("dev"));

// ✅ Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// ✅ Health check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "FinScope AI Backend is running 🚀",
  });
});

// ✅ Routes
app.use("/api/v1", router);

// ✅ Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
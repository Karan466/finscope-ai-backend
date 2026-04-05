import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";


import router from "./routes";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.get("/", (_req: Request, res: Response) => {

  res.status(200).json({
    success: true,
    message: "FinScope AI Backend is running 🚀",
  });
});

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import authRoutes from "./routes/auth-routes.js";
import dashboardRoutes from "./routes/dashboard-routes.js";
import dataRoutes from "./routes/data-routes.js";
import logRoutes from "./routes/log-routes.js";
import settingsRoutes from "./routes/settings-routes.js";
import userRoutes from "./routes/user-routes.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Try again later." }
});

app.get("/api/health", (_req, res) => {
  return res.json({ success: true, message: "Admin backend is healthy" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/logs", logRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

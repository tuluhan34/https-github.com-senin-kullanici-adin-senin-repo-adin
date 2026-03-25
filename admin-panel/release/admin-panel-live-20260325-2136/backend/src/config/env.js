import dotenv from "dotenv";

dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET", "CSRF_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  csrfSecret: process.env.CSRF_SECRET
};

export const isProduction = env.nodeEnv === "production";

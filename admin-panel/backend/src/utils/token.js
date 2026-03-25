import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateCsrfToken() {
  return crypto.createHmac("sha256", env.csrfSecret).update(crypto.randomBytes(32)).digest("hex");
}

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { isProduction } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { authRequired, clearAuthCookies } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { writeLog } from "../utils/logger.js";
import { generateCsrfToken, signAccessToken } from "../utils/token.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

function setAuthCookies(res, token, csrfToken) {
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    sameSite: "strict",
    secure: isProduction,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });
}

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const existing = await prisma.user.findUnique({ where: { email: req.body.email } });

    if (existing) {
      return next({ status: 409, message: "Email already exists" });
    }

    const passwordHash = await hashPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        passwordHash,
        role: Role.USER
      }
    });

    await writeLog({
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
      message: `User registered: ${user.email}`,
      userId: user.id
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });

    if (!user || !user.isActive) {
      return next({ status: 401, message: "Invalid credentials" });
    }

    const isValid = await comparePassword(req.body.password, user.passwordHash);

    if (!isValid) {
      return next({ status: 401, message: "Invalid credentials" });
    }

    const csrfToken = generateCsrfToken();
    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      csrfToken
    });

    setAuthCookies(res, token, csrfToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    await writeLog({
      action: "LOGIN",
      entity: "Auth",
      message: `Login success for ${user.email}`,
      userId: user.id
    });

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        csrfToken
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", authRequired, async (req, res, next) => {
  try {
    clearAuthCookies(res);

    await writeLog({
      action: "LOGOUT",
      entity: "Auth",
      message: `Logout success for ${req.auth.email}`,
      userId: req.auth.sub
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.auth.sub) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return next({ status: 404, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

router.get("/csrf", authRequired, (req, res) => {
  return res.json({ success: true, data: { csrfToken: req.cookies?.csrf_token || null } });
});

export default router;

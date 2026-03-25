import { isProduction } from "../config/env.js";
import { verifyAccessToken } from "../utils/token.js";

export function authRequired(req, _res, next) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return next({ status: 401, message: "Unauthorized" });
    }

    const payload = verifyAccessToken(token);
    req.auth = payload;
    return next();
  } catch (_error) {
    return next({ status: 401, message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next({ status: 403, message: "Forbidden" });
    }

    return next();
  };
}

export function csrfProtection(req, _res, next) {
  const method = req.method.toUpperCase();
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(method)) {
    return next();
  }

  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = req.cookies?.csrf_token;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return next({ status: 403, message: "Invalid CSRF token" });
  }

  return next();
}

export function clearAuthCookies(res) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
    path: "/"
  };

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("csrf_token", {
    sameSite: "strict",
    secure: isProduction,
    path: "/"
  });
}

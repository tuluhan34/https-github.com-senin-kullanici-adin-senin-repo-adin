export function notFoundHandler(_req, _res, next) {
  return next({ status: 404, message: "Route not found" });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null
  });
}

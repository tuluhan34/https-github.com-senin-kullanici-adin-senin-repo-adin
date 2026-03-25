import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { getDashboardSummary } from "../services/dashboard-service.js";

const router = Router();

router.get("/summary", authRequired, async (_req, res, next) => {
  try {
    const summary = await getDashboardSummary();
    return res.json({ success: true, data: summary });
  } catch (error) {
    return next(error);
  }
});

export default router;

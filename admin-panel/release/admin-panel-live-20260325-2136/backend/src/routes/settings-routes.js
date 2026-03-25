import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authRequired, requireRole, csrfProtection } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { writeLog } from "../utils/logger.js";

const router = Router();

const upsertSchema = z.object({
  key: z.string().min(2).max(80),
  value: z.string().min(1).max(300),
  description: z.string().max(300).optional().nullable()
});

router.get("/", authRequired, async (_req, res, next) => {
  try {
    const items = await prisma.setting.findMany({
      orderBy: { key: "asc" },
      include: {
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
});

router.post("/", authRequired, requireRole(Role.ADMIN), csrfProtection, validate(upsertSchema), async (req, res, next) => {
  try {
    const setting = await prisma.setting.upsert({
      where: { key: req.body.key },
      update: {
        value: req.body.value,
        description: req.body.description,
        updatedById: Number(req.auth.sub)
      },
      create: {
        key: req.body.key,
        value: req.body.value,
        description: req.body.description,
        updatedById: Number(req.auth.sub)
      },
      include: {
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await writeLog({
      action: "UPSERT_SETTING",
      entity: "Setting",
      entityId: setting.id,
      message: `Setting updated: ${setting.key}`,
      userId: req.auth.sub
    });

    return res.status(201).json({ success: true, data: setting });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:key", authRequired, requireRole(Role.ADMIN), csrfProtection, async (req, res, next) => {
  try {
    await prisma.setting.delete({ where: { key: req.params.key } });

    await writeLog({
      action: "DELETE_SETTING",
      entity: "Setting",
      entityId: req.params.key,
      message: `Setting deleted: ${req.params.key}`,
      userId: req.auth.sub
    });

    return res.json({ success: true, message: "Setting deleted" });
  } catch (error) {
    return next(error);
  }
});

export default router;

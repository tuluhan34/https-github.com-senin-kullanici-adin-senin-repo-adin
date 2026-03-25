import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authRequired, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  level: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional()
});

router.get("/", authRequired, requireRole(Role.ADMIN), validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { page, pageSize, level, action, entity } = req.query;
    const where = {
      ...(level ? { level } : {}),
      ...(action ? { action } : {}),
      ...(entity ? { entity } : {})
    };

    const [items, total] = await Promise.all([
      prisma.logEntry.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.logEntry.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

export default router;

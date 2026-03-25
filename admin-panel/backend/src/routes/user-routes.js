import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authRequired, requireRole, csrfProtection } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { invalidateDashboardSummary } from "../services/dashboard-service.js";
import { writeLog } from "../utils/logger.js";
import { hashPassword } from "../utils/password.js";

const router = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.enum(["true", "false"]).optional()
});

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.nativeEnum(Role),
  isActive: z.boolean().default(true)
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).max(128).optional()
});

router.get("/", authRequired, requireRole(Role.ADMIN), validate(listQuerySchema, "query"), async (req, res, next) => {
  try {
    const { page, pageSize, search, role, isActive } = req.query;

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } }
            ]
          }
        : {}),
      ...(role ? { role } : {}),
      ...(typeof isActive === "string" ? { isActive: isActive === "true" } : {})
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true
        }
      }),
      prisma.user.count({ where })
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

router.post("/", authRequired, requireRole(Role.ADMIN), csrfProtection, validate(createUserSchema), async (req, res, next) => {
  try {
    const exists = await prisma.user.findUnique({ where: { email: req.body.email } });

    if (exists) {
      return next({ status: 409, message: "Email already exists" });
    }

    const passwordHash = await hashPassword(req.body.password);

    const created = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        passwordHash,
        role: req.body.role,
        isActive: req.body.isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    await writeLog({
      action: "CREATE_USER",
      entity: "User",
      entityId: created.id,
      message: `User created: ${created.email}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", authRequired, requireRole(Role.ADMIN), csrfProtection, validate(updateUserSchema), async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (Number.isNaN(userId)) {
      return next({ status: 400, message: "Invalid user id" });
    }

    const updateData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.role ? { role: req.body.role } : {}),
      ...(typeof req.body.isActive === "boolean" ? { isActive: req.body.isActive } : {})
    };

    if (req.body.password) {
      updateData.passwordHash = await hashPassword(req.body.password);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    await writeLog({
      action: "UPDATE_USER",
      entity: "User",
      entityId: updated.id,
      message: `User updated: ${updated.email}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.json({ success: true, data: updated });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", authRequired, requireRole(Role.ADMIN), csrfProtection, async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (Number.isNaN(userId)) {
      return next({ status: 400, message: "Invalid user id" });
    }

    if (userId === Number(req.auth.sub)) {
      return next({ status: 400, message: "You cannot delete your own account" });
    }

    await prisma.user.delete({ where: { id: userId } });

    await writeLog({
      action: "DELETE_USER",
      entity: "User",
      entityId: userId,
      message: `User deleted: ${userId}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return next(error);
  }
});

export default router;

import { RecordStatus } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authRequired, requireRole, csrfProtection } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { invalidateDashboardSummary } from "../services/dashboard-service.js";
import { writeLog } from "../utils/logger.js";

const router = Router();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(RecordStatus).optional()
});

const createSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.string().min(2).max(80),
  status: z.nativeEnum(RecordStatus),
  amount: z.coerce.number().nonnegative(),
  description: z.string().max(400).optional().nullable()
});

const updateSchema = createSchema.partial();

router.get("/", authRequired, validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { page, pageSize, search, category, status } = req.query;

    const where = {
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {}),
      ...(category ? { category: { contains: category } } : {}),
      ...(status ? { status } : {})
    };

    const [items, total] = await Promise.all([
      prisma.dataRecord.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.dataRecord.count({ where })
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

router.post("/", authRequired, csrfProtection, validate(createSchema), async (req, res, next) => {
  try {
    const created = await prisma.dataRecord.create({
      data: {
        ...req.body,
        createdById: Number(req.auth.sub)
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await writeLog({
      action: "CREATE_DATA_RECORD",
      entity: "DataRecord",
      entityId: created.id,
      message: `Data record created: ${created.title}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", authRequired, csrfProtection, validate(updateSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return next({ status: 400, message: "Invalid record id" });
    }

    const record = await prisma.dataRecord.findUnique({ where: { id } });

    if (!record) {
      return next({ status: 404, message: "Record not found" });
    }

    if (req.auth.role !== "ADMIN" && record.createdById !== Number(req.auth.sub)) {
      return next({ status: 403, message: "Forbidden" });
    }

    const updated = await prisma.dataRecord.update({
      where: { id },
      data: req.body,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await writeLog({
      action: "UPDATE_DATA_RECORD",
      entity: "DataRecord",
      entityId: updated.id,
      message: `Data record updated: ${updated.title}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.json({ success: true, data: updated });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", authRequired, csrfProtection, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return next({ status: 400, message: "Invalid record id" });
    }

    await prisma.dataRecord.delete({ where: { id } });

    await writeLog({
      action: "DELETE_DATA_RECORD",
      entity: "DataRecord",
      entityId: id,
      message: `Data record deleted: ${id}`,
      userId: req.auth.sub
    });

    invalidateDashboardSummary();

    return res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    return next(error);
  }
});

export default router;

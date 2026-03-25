import { prisma } from "../config/prisma.js";

const cache = new Map();
const CACHE_TTL_MS = 30 * 1000;

export async function getDashboardSummary() {
  const cacheKey = "dashboard:summary";
  const current = cache.get(cacheKey);

  if (current && current.expiresAt > Date.now()) {
    return current.payload;
  }

  const [userCount, activeUserCount, dataRecordCount, totalAmountAgg, latestLogs] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.dataRecord.count(),
    prisma.dataRecord.aggregate({ _sum: { amount: true } }),
    prisma.logEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  ]);

  const payload = {
    userCount,
    activeUserCount,
    dataRecordCount,
    totalAmount: totalAmountAgg._sum.amount || 0,
    latestLogs
  };

  cache.set(cacheKey, {
    payload,
    expiresAt: Date.now() + CACHE_TTL_MS
  });

  return payload;
}

export function invalidateDashboardSummary() {
  cache.delete("dashboard:summary");
}

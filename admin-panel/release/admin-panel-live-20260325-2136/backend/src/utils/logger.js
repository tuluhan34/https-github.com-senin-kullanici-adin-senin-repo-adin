import { prisma } from "../config/prisma.js";

export async function writeLog({ level = "INFO", action, entity, entityId, message, metadata, userId }) {
  try {
    await prisma.logEntry.create({
      data: {
        level,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId: userId || null
      }
    });
  } catch (error) {
    console.error("Failed to write log", error);
  }
}

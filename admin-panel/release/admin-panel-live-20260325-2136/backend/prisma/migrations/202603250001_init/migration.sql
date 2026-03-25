-- Create tables
CREATE TABLE "User" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Setting" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "updatedById" INTEGER,
  CONSTRAINT "Setting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "DataRecord" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "amount" REAL NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "createdById" INTEGER NOT NULL,
  CONSTRAINT "DataRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "LogEntry" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "level" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "message" TEXT NOT NULL,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" INTEGER,
  CONSTRAINT "LogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- Secondary indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Setting_key_idx" ON "Setting"("key");
CREATE INDEX "DataRecord_category_idx" ON "DataRecord"("category");
CREATE INDEX "DataRecord_status_idx" ON "DataRecord"("status");
CREATE INDEX "DataRecord_createdAt_idx" ON "DataRecord"("createdAt");
CREATE INDEX "LogEntry_level_idx" ON "LogEntry"("level");
CREATE INDEX "LogEntry_action_idx" ON "LogEntry"("action");
CREATE INDEX "LogEntry_entity_idx" ON "LogEntry"("entity");
CREATE INDEX "LogEntry_createdAt_idx" ON "LogEntry"("createdAt");

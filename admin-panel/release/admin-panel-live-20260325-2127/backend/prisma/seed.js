import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword = await bcrypt.hash("User123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  const operator = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Panel User",
      email: "user@example.com",
      passwordHash: userPassword,
      role: "USER"
    }
  });

  const settings = [
    {
      key: "company_name",
      value: "34 Kurye",
      description: "Shown in dashboard and reports"
    },
    {
      key: "support_email",
      value: "support@34kurye.com",
      description: "Support email on notifications"
    },
    {
      key: "default_currency",
      value: "TRY",
      description: "Monetary display currency"
    }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
        updatedById: admin.id
      },
      create: {
        ...setting,
        updatedById: admin.id
      }
    });
  }

  const existingRecords = await prisma.dataRecord.count();

  if (!existingRecords) {
    await prisma.dataRecord.createMany({
      data: [
        {
          title: "Morning Logistics Batch",
          category: "Logistics",
          status: "ACTIVE",
          amount: 12850,
          description: "Same-day city distribution",
          createdById: admin.id
        },
        {
          title: "Invoice Dispatch",
          category: "Finance",
          status: "PENDING",
          amount: 3200,
          description: "Monthly paper invoice dispatch",
          createdById: operator.id
        },
        {
          title: "Archive 2025",
          category: "Operations",
          status: "ARCHIVED",
          amount: 0,
          description: "Legacy archived operational batch",
          createdById: admin.id
        }
      ]
    });
  }

  console.log("Seed completed.\nAdmin: admin@example.com / Admin123!\nUser: user@example.com / User123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

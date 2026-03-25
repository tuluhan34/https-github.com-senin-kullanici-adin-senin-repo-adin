import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function bootstrap() {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      console.log(`Admin backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
}

bootstrap();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

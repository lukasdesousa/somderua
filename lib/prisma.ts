import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const isCloudflareWorker = process.env.DEPLOY_TARGET === "cloudflare";

export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
    ...(isCloudflareWorker ? { maxUses: 1 } : {}),
  });

  return new PrismaClient({ adapter });
}

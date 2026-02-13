import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let instance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!instance) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    instance = new PrismaClient({ adapter });
  }
  return instance;
}

export async function disconnectPrisma(): Promise<void> {
  if (instance) {
    await instance.$disconnect();
    instance = null;
  }
}

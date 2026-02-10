import { PrismaClient } from "../../prisma/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const accelerateUrl = process.env.PRISMA_DATABASE_URL;

if (!accelerateUrl) {
  throw new Error("PRISMA_DATABASE_URL is required to initialize PrismaClient.");
}

const prismaClient = new PrismaClient({ accelerateUrl });

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.__bonsaiPrisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__bonsaiPrisma = prisma;
}

export function isPrismaMode() {
    return process.env.BONSAI_DATA_MODE === "prisma" && Boolean(process.env.DATABASE_URL);
}

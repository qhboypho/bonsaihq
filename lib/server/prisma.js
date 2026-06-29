const globalForPrisma = globalThis;

export function isPrismaMode() {
    return process.env.BONSAI_DATA_MODE === "prisma" && Boolean(process.env.DATABASE_URL);
}

export async function getPrismaClient() {
    if (globalForPrisma.__bonsaiPrisma) return globalForPrisma.__bonsaiPrisma;

    const { PrismaClient } = await import("@prisma/client");
    const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.__bonsaiPrisma = client;
    }

    return client;
}

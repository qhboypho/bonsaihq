import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_ARTISANS, DEFAULT_TREES } from "../db";

const DATA_FILE_NAME = "bonsai-db.json";

function getDataDir() {
    return process.env.BONSAI_DATA_DIR
        ? path.resolve(process.env.BONSAI_DATA_DIR)
        : path.join(process.cwd(), ".data");
}

function getDataFile() {
    return path.join(getDataDir(), DATA_FILE_NAME);
}

function cloneSeed() {
    return {
        users: [
            {
                id: "dev-admin",
                username: "admin",
                email: "admin@bonsaihoiquan.local",
                name: "Dev Admin",
                role: "ADMIN",
                artisanId: "nguyen_van_ba",
                passwordHash: "dev:admin123",
                createdAt: new Date().toISOString(),
            },
            {
                id: "dev-artisan",
                username: "artisan",
                email: "artisan@bonsaihoiquan.local",
                name: "Ba Sanh",
                role: "ARTISAN",
                artisanId: "nguyen_van_ba",
                passwordHash: "dev:artisan123",
                createdAt: new Date().toISOString(),
            },
        ],
        artisans: structuredClone(DEFAULT_ARTISANS),
        trees: structuredClone(DEFAULT_TREES),
        moderationRequired: false,
        settings: {},
    };
}

function inferUsername(user) {
    if (user.username) return user.username;
    if (user.email === "admin@bonsaihoiquan.local") return "admin";
    if (user.email === "artisan@bonsaihoiquan.local") return "artisan";
    return String(user.email || user.name || user.id || "")
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 32);
}

async function ensureDataFile() {
    const dataFile = getDataFile();
    await mkdir(path.dirname(dataFile), { recursive: true });

    try {
        await readFile(dataFile, "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        await writeFile(dataFile, JSON.stringify(cloneSeed(), null, 2), "utf8");
    }
}

export async function readStore() {
    await ensureDataFile();
    const raw = await readFile(getDataFile(), "utf8");
    const state = JSON.parse(raw);
    return {
        users: (state.users || cloneSeed().users).map((user) => ({
            ...user,
            username: inferUsername(user),
        })),
        artisans: state.artisans || {},
        trees: state.trees || [],
        moderationRequired: Boolean(state.moderationRequired),
        settings: state.settings || {},
    };
}

export async function writeStore(nextState) {
    const dataFile = getDataFile();
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(nextState, null, 2), "utf8");
    return nextState;
}

export async function updateStore(updater) {
    const current = await readStore();
    const next = await updater(current);
    return writeStore(next);
}

export async function resetStore() {
    let current = { settings: {} };
    try {
        current = await readStore();
    } catch {
        current = { settings: {} };
    }
    return writeStore({
        ...cloneSeed(),
        settings: current.settings || {},
    });
}

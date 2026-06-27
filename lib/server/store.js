import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_ARTISANS, DEFAULT_TREES } from "../db";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "bonsai-db.json");

function cloneSeed() {
    return {
        artisans: structuredClone(DEFAULT_ARTISANS),
        trees: structuredClone(DEFAULT_TREES),
        moderationRequired: false,
    };
}

async function ensureDataFile() {
    await mkdir(DATA_DIR, { recursive: true });

    try {
        await readFile(DATA_FILE, "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        await writeFile(DATA_FILE, JSON.stringify(cloneSeed(), null, 2), "utf8");
    }
}

export async function readStore() {
    await ensureDataFile();
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
}

export async function writeStore(nextState) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(nextState, null, 2), "utf8");
    return nextState;
}

export async function updateStore(updater) {
    const current = await readStore();
    const next = await updater(current);
    return writeStore(next);
}

export async function resetStore() {
    return writeStore(cloneSeed());
}

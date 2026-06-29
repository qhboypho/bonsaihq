import { updateStore, readStore } from "./store";
import { getPrismaClient, isPrismaMode } from "./prisma";

const RUNTIME_CONFIG_KEYS = {
    GOOGLE_CLIENT_ID: "google_client_id",
    GOOGLE_CLIENT_SECRET: "google_client_secret",
    GOOGLE_REDIRECT_URI: "google_redirect_uri",
    SESSION_SECRET: "session_cookie_secret",
};

function getEnvValue(envKey) {
    return String(process.env[envKey] || "").trim();
}

function normalizeRuntimeValue(value) {
    return String(value ?? "").trim();
}

async function getPrismaRuntimeConfigValues(keys) {
    const prisma = await getPrismaClient();
    const settingKeys = keys.map((envKey) => RUNTIME_CONFIG_KEYS[envKey]).filter(Boolean);
    const rows = settingKeys.length
        ? await prisma.appSetting.findMany({ where: { key: { in: settingKeys } } })
        : [];
    const map = new Map(rows.map((row) => [row.key, normalizeRuntimeValue(row.value)]));
    const result = {};

    for (const envKey of keys) {
        const settingKey = RUNTIME_CONFIG_KEYS[envKey];
        const storedValue = normalizeRuntimeValue(map.get(settingKey));
        const envValue = getEnvValue(envKey);

        if (!storedValue && envValue) {
            await hydratePrismaRuntimeConfigValue(settingKey, envValue);
        }

        result[envKey] = storedValue || envValue;
    }

    return result;
}

async function hydratePrismaRuntimeConfigValue(key, value) {
    if (!key || !value) return;
    const prisma = await getPrismaClient();
    const existing = await prisma.appSetting.findUnique({ where: { key } });

    if (!existing) {
        await prisma.appSetting.create({ data: { key, value } });
        return;
    }

    if (!normalizeRuntimeValue(existing.value)) {
        await prisma.appSetting.update({ where: { key }, data: { value } });
    }
}

export async function getRuntimeConfigValues(envKeys) {
    const keys = Array.from(new Set(envKeys));

    if (isPrismaMode()) {
        return getPrismaRuntimeConfigValues(keys);
    }

    const db = await readStore();
    const settings = db.settings || {};
    const result = {};
    const hydrated = {};

    for (const envKey of keys) {
        const settingKey = RUNTIME_CONFIG_KEYS[envKey];
        const storedValue = normalizeRuntimeValue(settings[settingKey]);
        const envValue = getEnvValue(envKey);

        if (!storedValue && envValue) {
            hydrated[settingKey] = envValue;
        }

        result[envKey] = storedValue || envValue;
    }

    if (Object.keys(hydrated).length) {
        await updateStore((state) => ({
            ...state,
            settings: {
                ...(state.settings || {}),
                ...hydrated,
            },
        }));
    }

    return result;
}

export async function getRuntimeConfigValue(envKey, fallback = "") {
    const values = await getRuntimeConfigValues([envKey]);
    return values[envKey] || fallback;
}

export async function upsertRuntimeConfigValues(entries) {
    const safeEntries = {};

    for (const entry of entries) {
        const key = String(entry.key || "").trim();
        if (!key) continue;
        safeEntries[key] = normalizeRuntimeValue(entry.value);
    }

    if (isPrismaMode()) {
        const prisma = await getPrismaClient();
        await Promise.all(Object.entries(safeEntries).map(([key, value]) =>
            prisma.appSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        ));
        return;
    }

    await updateStore((state) => ({
        ...state,
        settings: {
            ...(state.settings || {}),
            ...safeEntries,
        },
    }));
}

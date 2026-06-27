import { updateStore, readStore } from "./store";

const RUNTIME_CONFIG_KEYS = {
    GOOGLE_CLIENT_ID: "google_client_id",
    GOOGLE_CLIENT_SECRET: "google_client_secret",
    GOOGLE_REDIRECT_URI: "google_redirect_uri",
    SESSION_SECRET: "session_cookie_secret",
};

function getEnvValue(envKey) {
    return String(process.env[envKey] || "").trim();
}

export async function getRuntimeConfigValues(envKeys) {
    const keys = Array.from(new Set(envKeys));
    const db = await readStore();
    const settings = db.settings || {};
    const result = {};
    const hydrated = {};

    for (const envKey of keys) {
        const settingKey = RUNTIME_CONFIG_KEYS[envKey];
        const storedValue = String(settings[settingKey] || "").trim();
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
        safeEntries[key] = String(entry.value || "").trim();
    }

    await updateStore((state) => ({
        ...state,
        settings: {
            ...(state.settings || {}),
            ...safeEntries,
        },
    }));
}

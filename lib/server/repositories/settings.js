import { readStore, resetStore, updateStore } from "../store";
import { getRuntimeConfigValues, upsertRuntimeConfigValues } from "../runtime-config";

export async function getSettings() {
    const db = await readStore();
    return { moderationRequired: Boolean(db.moderationRequired) };
}

export async function updateModerationRequired(moderationRequired) {
    const next = Boolean(moderationRequired);
    await updateStore((db) => ({ ...db, moderationRequired: next }));
    return { moderationRequired: next };
}

export async function getGoogleAuthSettings({ includeSecret = false } = {}) {
    const config = await getRuntimeConfigValues([
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REDIRECT_URI",
    ]);

    const clientId = String(config.GOOGLE_CLIENT_ID || "").trim();
    const clientSecret = String(config.GOOGLE_CLIENT_SECRET || "").trim();
    const redirectUri = String(config.GOOGLE_REDIRECT_URI || "").trim();

    return {
        clientId,
        redirectUri,
        configured: Boolean(clientId && clientSecret),
        hasClientSecret: Boolean(clientSecret),
        ...(includeSecret ? { clientSecret } : {}),
    };
}

export async function updateGoogleAuthSettings(input) {
    const clientId = String(input.clientId || "").trim();
    const redirectUri = String(input.redirectUri || "").trim();
    const clientSecret = String(input.clientSecret || "").trim();
    const keepSecret = Boolean(input.keepSecret);
    const entries = [
        { key: "google_client_id", value: clientId },
        { key: "google_redirect_uri", value: redirectUri },
    ];

    if (!keepSecret || clientSecret) {
        entries.push({ key: "google_client_secret", value: clientSecret });
    }

    await upsertRuntimeConfigValues(entries);
    return getGoogleAuthSettings({ includeSecret: true });
}

export async function resetData() {
    return resetStore();
}

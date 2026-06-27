import { readStore, resetStore, updateStore } from "../store";

export async function getSettings() {
    const db = await readStore();
    return { moderationRequired: Boolean(db.moderationRequired) };
}

export async function updateModerationRequired(moderationRequired) {
    const next = Boolean(moderationRequired);
    await updateStore((db) => ({ ...db, moderationRequired: next }));
    return { moderationRequired: next };
}

export async function resetData() {
    return resetStore();
}

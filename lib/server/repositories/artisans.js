import { readStore, updateStore } from "../store";

export async function listArtisans() {
    const db = await readStore();
    return Object.values(db.artisans);
}

export async function getArtisanById(id) {
    const db = await readStore();
    return db.artisans[id] || null;
}

export async function listArtisanTrees(id, includePending = false) {
    const db = await readStore();
    return db.trees.filter((tree) => tree.ownerId === id && (includePending || tree.approved));
}

export async function addGuestbookEntry(id, entry) {
    let newEntry;

    await updateStore((db) => {
        const artisan = db.artisans[id];
        if (!artisan) return db;

        const today = new Date();
        const date = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
        newEntry = { ...entry, date, createdAt: today.toISOString() };

        return {
            ...db,
            artisans: {
                ...db.artisans,
                [id]: {
                    ...artisan,
                    guestbook: [newEntry, ...(artisan.guestbook || [])],
                },
            },
        };
    });

    return newEntry || null;
}

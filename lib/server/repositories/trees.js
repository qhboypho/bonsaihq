import { updateStore, readStore } from "../store";

export async function listTrees(filters = {}) {
    const db = await readStore();
    return db.trees.filter((tree) => {
        if (filters.approvedOnly && !tree.approved) return false;
        if (filters.ownerId && tree.ownerId !== filters.ownerId) return false;
        if (filters.style && tree.style !== filters.style) return false;
        if (filters.size && tree.size !== filters.size) return false;
        return true;
    });
}

export async function getTreeById(id) {
    const db = await readStore();
    return db.trees.find((tree) => tree.id === id) || null;
}

export async function createTree(input) {
    let createdTree;

    await updateStore((db) => {
        createdTree = {
            id: `tree_${Date.now()}`,
            ...input,
            approved: !db.moderationRequired,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return {
            ...db,
            trees: [createdTree, ...db.trees],
        };
    });

    return createdTree;
}

export async function updateTreeApproval(id, approved) {
    let updatedTree = null;

    await updateStore((db) => {
        const trees = db.trees.map((tree) => {
            if (tree.id !== id) return tree;
            updatedTree = { ...tree, approved, updatedAt: new Date().toISOString() };
            return updatedTree;
        });

        return { ...db, trees };
    });

    return updatedTree;
}

export async function deleteTree(id) {
    let deleted = false;

    await updateStore((db) => {
        const trees = db.trees.filter((tree) => {
            if (tree.id === id) {
                deleted = true;
                return false;
            }
            return true;
        });

        return { ...db, trees };
    });

    return deleted;
}

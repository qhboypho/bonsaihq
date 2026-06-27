import { TREE_STATUSES } from "../shared/constants";

function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
}

function localized(value, fallback = "") {
    if (isObject(value)) {
        const vi = String(value.vi || fallback).trim();
        return {
            vi,
            en: String(value.en || vi).trim(),
            jp: String(value.jp || value.ja || vi).trim(),
        };
    }

    const text = String(value || fallback).trim();
    return { vi: text, en: text, jp: text };
}

export function validateTreePayload(payload) {
    const fields = {};

    if (!String(payload.title || payload.title?.vi || "").trim()) fields.title = ["Title is required."];
    if (!String(payload.species || payload.species?.vi || "").trim()) fields.species = ["Species is required."];
    if (!String(payload.style || "").trim()) fields.style = ["Style is required."];
    if (!String(payload.size || "").trim()) fields.size = ["Size is required."];

    const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : [];
    if (images.length === 0) fields.images = ["At least one image is required."];
    if (images.length > 5) fields.images = ["A maximum of five images is allowed."];

    if (Object.keys(fields).length > 0) {
        return { success: false, fields };
    }

    const status = Object.values(TREE_STATUSES).includes(payload.status)
        ? payload.status
        : TREE_STATUSES.SALE;

    return {
        success: true,
        data: {
            ownerId: payload.ownerId || "nguyen_van_ba",
            title: localized(payload.title),
            species: localized(payload.species),
            style: String(payload.style).trim(),
            size: String(payload.size).trim(),
            age: localized(payload.age, "Chưa xác định"),
            potAge: localized(payload.potAge, "Mới lên chậu"),
            origin: localized(payload.origin, "Việt Nam"),
            status,
            price: payload.price ? Number(payload.price) : 0,
            story: localized(payload.story, "Tác phẩm cây cảnh Bonsai nghệ thuật."),
            images,
            evolution: Array.isArray(payload.evolution)
                ? payload.evolution.map((step) => ({
                    year: String(step.year || "").trim(),
                    desc: localized(step.desc || step.description),
                })).filter((step) => step.year && step.desc.vi)
                : [],
        },
    };
}

export function validateGuestbookPayload(payload) {
    const name = String(payload.name || payload.authorName || "").trim();
    const content = String(payload.content || "").trim();

    if (!name || !content) {
        return {
            success: false,
            fields: {
                ...(!name ? { name: ["Name is required."] } : {}),
                ...(!content ? { content: ["Message is required."] } : {}),
            },
        };
    }

    return {
        success: true,
        data: {
            name,
            contact: String(payload.contact || "").trim(),
            content,
        },
    };
}

export function validateArtisanPayload(payload) {
    const name = String(payload.name || "").trim();
    const id = String(payload.id || payload.slug || name.toLowerCase().replace(/\s+/g, "_")).trim();

    if (!name) {
        return {
            success: false,
            fields: { name: ["Name is required."] },
        };
    }

    return {
        success: true,
        data: {
            id: id.replace(/[^a-zA-Z0-9_-]/g, "_"),
            name,
            rank: localized(payload.rank || "Nghệ nhân"),
            address: localized(payload.address || "Việt Nam"),
            bio: localized(payload.bio || "Tiểu sử nghệ nhân đang được cập nhật..."),
            avatar: String(payload.avatar || "").trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&fit=crop&q=80",
            cover: String(payload.cover || "").trim() || "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&fit=crop&q=80",
            phone: String(payload.phone || "").trim(),
            zalo: String(payload.zalo || "").trim(),
            guestbook: Array.isArray(payload.guestbook) ? payload.guestbook : [],
            blog: Array.isArray(payload.blog) ? payload.blog : [],
        },
    };
}

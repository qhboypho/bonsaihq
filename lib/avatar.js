const PLACEHOLDER_AVATARS = new Set([
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&fit=crop&q=80",
]);

export function getDisplayAvatar(value) {
    const avatar = String(value || "").trim();
    if (!avatar || PLACEHOLDER_AVATARS.has(avatar)) return "";
    return avatar;
}

export function getNameInitials(name) {
    const parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "BQ";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

export function normalizeSearchText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();
}

export function matchesSearch(parts, query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return true;

    return normalizeSearchText(parts.filter(Boolean).join(" ")).includes(normalizedQuery);
}

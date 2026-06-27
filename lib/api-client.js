async function request(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = payload.error?.message || "Request failed.";
        throw new Error(message);
    }

    return payload.data;
}

export const api = {
    bootstrap: () => request("/api/bootstrap"),
    listTrees: (params = "") => request(`/api/trees${params}`),
    getTree: (id) => request(`/api/trees/${id}`),
    createTree: (input) =>
        request("/api/trees", {
            method: "POST",
            body: JSON.stringify(input),
        }),
    addGuestbook: (artisanId, input) =>
        request(`/api/artisans/${artisanId}/guestbook`, {
            method: "POST",
            body: JSON.stringify(input),
        }),
    listAdminTrees: () => request("/api/admin/trees"),
    updateAdminTree: (id, input) =>
        request(`/api/admin/trees/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
        }),
    deleteAdminTree: (id) =>
        request(`/api/admin/trees/${id}`, {
            method: "DELETE",
        }),
    listAdminArtisans: () => request("/api/admin/artisans"),
    createAdminArtisan: (input) =>
        request("/api/admin/artisans", {
            method: "POST",
            body: JSON.stringify(input),
        }),
    updateAdminArtisan: (id, input) =>
        request(`/api/admin/artisans/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
        }),
    deleteAdminArtisan: (id) =>
        request(`/api/admin/artisans/${id}`, {
            method: "DELETE",
        }),
    updateModeration: (moderationRequired) =>
        request("/api/settings/moderation", {
            method: "PATCH",
            body: JSON.stringify({ moderationRequired }),
        }),
    listPendingTrees: () => request("/api/admin/moderation/trees"),
    moderateTree: (id, action) =>
        request(`/api/admin/moderation/trees/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ action }),
        }),
    resetData: () =>
        request("/api/settings/reset", {
            method: "POST",
        }),
    signUpload: (input) =>
        request("/api/uploads/sign", {
            method: "POST",
            body: JSON.stringify(input),
        }),
};

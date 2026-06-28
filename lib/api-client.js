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

async function upload(path, formData) {
    const response = await fetch(path, {
        method: "POST",
        body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = payload.error?.message || "Upload failed.";
        throw new Error(message);
    }

    return payload.data;
}

export const api = {
    login: (input) =>
        request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(input),
        }),
    register: (input) =>
        request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(input),
        }),
    logout: () =>
        request("/api/auth/logout", {
            method: "POST",
        }),
    me: () => request("/api/auth/me"),
    googleAuthStatus: () => request("/api/auth/google/status"),
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
    updateArtisan: (id, input) =>
        request(`/api/artisans/${id}`, {
            method: "PATCH",
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
    getGoogleSettings: () => request("/api/settings/google"),
    updateGoogleSettings: (input) =>
        request("/api/settings/google", {
            method: "PATCH",
            body: JSON.stringify(input),
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
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return upload("/api/uploads/local", formData);
    },
};

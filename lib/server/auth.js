import "server-only";

export async function getCurrentUser() {
    return {
        id: "dev-admin",
        email: "admin@bonsaihoiquan.local",
        name: "Dev Admin",
        role: "ADMIN",
        artisanId: "nguyen_van_ba",
    };
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        return { error: new Response(null, { status: 401 }) };
    }
    return { user };
}

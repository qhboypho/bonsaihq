import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "bh_session";
const DEFAULT_ADMIN_EMAIL = "admin@bonsaihoiquan.local";
const DEFAULT_ADMIN_PASSWORD = "admin123";

function getSecret() {
    return process.env.SESSION_SECRET || "bonsai-dev-session-secret-change-me";
}

function sign(value) {
    return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encodeSession(user) {
    const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
    return `${payload}.${sign(payload)}`;
}

function decodeSession(value) {
    if (!value) return null;
    const [payload, signature] = value.split(".");
    if (!payload || !signature || sign(payload) !== signature) return null;

    try {
        return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
        return null;
    }
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
    if (session) return session;

    // Keeps public demo uploads working while admin endpoints still require ADMIN.
    return {
        id: "dev-artisan",
        email: "artisan@bonsaihoiquan.local",
        name: "Dev Artisan",
        role: "ARTISAN",
        artisanId: "nguyen_van_ba",
    };
}

export async function getSessionUser() {
    const cookieStore = await cookies();
    return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function signInWithPassword(email, password) {
    if (email !== DEFAULT_ADMIN_EMAIL || password !== DEFAULT_ADMIN_PASSWORD) {
        return null;
    }

    const user = {
        id: "dev-admin",
        email: DEFAULT_ADMIN_EMAIL,
        name: "Dev Admin",
        role: "ADMIN",
        artisanId: "nguyen_van_ba",
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, encodeSession(user), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return user;
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        return { error: new Response(null, { status: 401 }) };
    }
    return { user };
}

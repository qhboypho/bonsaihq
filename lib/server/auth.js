import { cookies } from "next/headers";
import crypto from "node:crypto";
import { updateStore, readStore } from "./store";
import { saveArtisan } from "./repositories/artisans";
import { getRuntimeConfigValues, getRuntimeConfigValue, upsertRuntimeConfigValues } from "./runtime-config";

const SESSION_COOKIE = "bh_session";
const OAUTH_STATE_COOKIE = "bh_oauth_state";
const SESSION_SECRET_KEY = "session_cookie_secret";

function generateToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
}

export function timingSafeStringEqual(a, b) {
    const left = Buffer.from(String(a || ""));
    const right = Buffer.from(String(b || ""));
    if (left.length !== right.length) return false;
    return crypto.timingSafeEqual(left, right);
}

async function getSecret() {
    const envSecret = String(process.env.SESSION_SECRET || "").trim();
    const storedSecret = await getRuntimeConfigValue("SESSION_SECRET", "");
    if (storedSecret.length >= 32) return storedSecret;
    if (envSecret.length >= 32) {
        await upsertRuntimeConfigValues([{ key: SESSION_SECRET_KEY, value: envSecret }]);
        return envSecret;
    }

    const secret = generateToken();
    await upsertRuntimeConfigValues([{ key: SESSION_SECRET_KEY, value: secret }]);
    return secret;
}

async function sign(value) {
    return crypto.createHmac("sha256", await getSecret()).update(value).digest("base64url");
}

async function encodeSession(user) {
    const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
    return `${payload}.${await sign(payload)}`;
}

async function decodeSession(value) {
    if (!value) return null;
    const [payload, signature] = value.split(".");
    if (!payload || !signature || !timingSafeStringEqual(await sign(payload), signature)) return null;

    try {
        return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
        return null;
    }
}

function hashPassword(password) {
    if (String(password).startsWith("dev:")) return password;
    return crypto.createHash("sha256").update(`${process.env.PASSWORD_PEPPER || "bonsai-dev-password-pepper"}:${password}`).digest("hex");
}

export async function getSessionUser() {
    const cookieStore = await cookies();
    return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
    return getSessionUser();
}

function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
}

function isValidUsername(value) {
    return /^[a-z0-9._-]{3,32}$/.test(value);
}

function buildLocalEmail(username) {
    return `${username}@bonsaihoiquan.local`;
}

export async function signInWithPassword(identifier, password) {
    const normalizedIdentifier = normalizeUsername(identifier);
    const db = await readStore();
    const user = db.users.find((item) =>
        normalizeUsername(item.username) === normalizedIdentifier ||
        String(item.email || "").toLowerCase() === normalizedIdentifier
    );
    if (!user) return null;

    const validPassword = user.passwordHash?.startsWith("dev:")
        ? user.passwordHash === `dev:${password}`
        : user.passwordHash === hashPassword(password);

    if (!validPassword) return null;

    const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        artisanId: user.artisanId || "",
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, await encodeSession(sessionUser), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return sessionUser;
}

export async function setSessionUser(user) {
    const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        artisanId: user.artisanId || "",
        avatar: user.avatar || "",
    };
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, await encodeSession(sessionUser), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
    return sessionUser;
}

export async function registerArtisanAccount(input) {
    const name = String(input.name || "").trim();
    const username = normalizeUsername(input.username);
    const email = String(input.email || "").trim().toLowerCase();
    const password = String(input.password || "");

    if (!name || !isValidUsername(username) || password.length < 6) {
        return { error: "Tên nghệ nhân, tên đăng nhập hợp lệ và mật khẩu từ 6 ký tự là bắt buộc." };
    }

    const db = await readStore();
    if (db.users.some((user) => normalizeUsername(user.username) === username || String(user.email || "").toLowerCase() === email && email)) {
        return { error: "Tên đăng nhập hoặc email đã tồn tại." };
    }

    const artisanId = `artisan_${Date.now()}`;
    await saveArtisan({
        id: artisanId,
        name,
        rank: { vi: "Nghệ nhân", en: "Artisan", jp: "職人" },
        address: { vi: input.address || "Việt Nam", en: input.address || "Vietnam", jp: input.address || "ベトナム" },
        bio: { vi: "Tiểu sử nghệ nhân đang được cập nhật...", en: "Artisan biography is being updated...", jp: "職人の略歴は現在更新中です..." },
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&fit=crop&q=80",
        phone: String(input.phone || "").trim(),
        zalo: String(input.facebook || input.zalo || "").trim(),
        guestbook: [],
        blog: [],
    });

    const user = {
        id: `user_${Date.now()}`,
        username,
        email: email || buildLocalEmail(username),
        name,
        role: "ARTISAN",
        artisanId,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
    };

    await updateStore((state) => ({
        ...state,
        users: [...(state.users || []), user],
    }));

    return signInWithPassword(username, password);
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(OAUTH_STATE_COOKIE);
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        return { error: new Response(null, { status: 401 }) };
    }
    return { user };
}

function isGoogleOAuthClientId(clientId) {
    return /^[0-9A-Za-z_-]+\.apps\.googleusercontent\.com$/.test(String(clientId || "").trim());
}

function isLocalOAuthHostname(hostname) {
    return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
}

export function getGoogleRedirectUri(requestUrl, configuredRedirectUri) {
    const fallback = new URL("/api/auth/callback", requestUrl).toString();
    const configured = String(configuredRedirectUri || "").trim();
    if (!configured) return fallback;

    try {
        const request = new URL(requestUrl);
        const configuredUrl = new URL(configured);
        if (
            isLocalOAuthHostname(request.hostname) &&
            isLocalOAuthHostname(configuredUrl.hostname) &&
            request.host !== configuredUrl.host
        ) {
            return fallback;
        }
        return configuredUrl.toString();
    } catch {
        return fallback;
    }
}

export async function getGoogleOAuthConfig(requestUrl) {
    const config = await getRuntimeConfigValues([
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REDIRECT_URI",
    ]);

    return {
        clientId: String(config.GOOGLE_CLIENT_ID || "").trim(),
        clientSecret: String(config.GOOGLE_CLIENT_SECRET || "").trim(),
        redirectUri: getGoogleRedirectUri(requestUrl, config.GOOGLE_REDIRECT_URI),
    };
}

export function validateGoogleOAuthClientId(clientId) {
    return isGoogleOAuthClientId(clientId);
}

export async function setOAuthStateCookie(state) {
    const cookieStore = await cookies();
    cookieStore.set(OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 5,
    });
}

export async function consumeOAuthStateCookie() {
    const cookieStore = await cookies();
    const state = cookieStore.get(OAUTH_STATE_COOKIE)?.value || "";
    cookieStore.delete(OAUTH_STATE_COOKIE);
    return state;
}

function slugFromEmail(email) {
    return String(email || "")
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 32) || `google_${Date.now()}`;
}

export async function findOrCreateGoogleUser(profile) {
    const googleId = String(profile.id || profile.sub || "").trim();
    const email = String(profile.email || "").trim().toLowerCase();
    const name = String(profile.name || email || "Google User").trim();
    const avatar = String(profile.picture || "").trim();

    if (!email) return { error: "Google account did not return an email address." };

    const db = await readStore();
    const existing = db.users.find((user) => user.googleId === googleId || user.email.toLowerCase() === email);
    if (existing) {
        const updatedUser = {
            ...existing,
            googleId: existing.googleId || googleId,
            name: existing.name || name,
            avatar: existing.avatar || avatar,
        };
        await updateStore((state) => ({
            ...state,
            users: (state.users || []).map((user) => user.id === existing.id ? updatedUser : user),
        }));
        return setSessionUser(updatedUser);
    }

    const artisanId = `artisan_${slugFromEmail(email)}_${Date.now()}`;
    await saveArtisan({
        id: artisanId,
        name,
        rank: { vi: "Nghệ nhân", en: "Artisan", jp: "職人" },
        address: { vi: "Việt Nam", en: "Vietnam", jp: "ベトナム" },
        bio: { vi: "Tiểu sử nghệ nhân đang được cập nhật...", en: "Artisan biography is being updated...", jp: "職人の略歴は現在更新中です..." },
        avatar: avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&fit=crop&q=80",
        phone: "",
        zalo: "",
        guestbook: [],
        blog: [],
    });

    const user = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: "ARTISAN",
        artisanId,
        googleId,
        avatar,
        passwordHash: "",
        createdAt: new Date().toISOString(),
    };

    await updateStore((state) => ({
        ...state,
        users: [...(state.users || []), user],
    }));

    return setSessionUser(user);
}

import {
    consumeOAuthStateCookie,
    findOrCreateGoogleUser,
    getGoogleOAuthConfig,
    timingSafeStringEqual,
    validateGoogleOAuthClientId,
} from "../../../../lib/server/auth";

function redirectWithLoginState(requestUrl, status, params = {}) {
    const url = new URL("/", requestUrl);
    url.searchParams.set("login", status);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }
    return Response.redirect(url);
}

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code") || "";
    const queryState = url.searchParams.get("state") || "";
    const cookieState = await consumeOAuthStateCookie();

    if (!cookieState || !queryState || !timingSafeStringEqual(cookieState, queryState)) {
        return redirectWithLoginState(request.url, "error", { error: "OAUTH_STATE_MISMATCH" });
    }
    if (!code) {
        return redirectWithLoginState(request.url, "error", { error: "AUTH_CALLBACK_FAILED" });
    }

    const { clientId, clientSecret, redirectUri } = await getGoogleOAuthConfig(request.url);
    if (!clientId || !clientSecret) {
        return redirectWithLoginState(request.url, "error", { error: "GOOGLE_AUTH_NOT_CONFIGURED" });
    }
    if (!validateGoogleOAuthClientId(clientId)) {
        return redirectWithLoginState(request.url, "error", { error: "GOOGLE_AUTH_CLIENT_ID_INVALID" });
    }

    try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });
        const tokenData = await tokenResponse.json().catch(() => ({}));
        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("[auth] Google token exchange failed", tokenData);
            return redirectWithLoginState(request.url, "error", { error: "AUTH_PROVIDER_TOKEN_EXCHANGE_FAILED" });
        }

        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile = await userResponse.json().catch(() => ({}));
        if (!userResponse.ok || !profile.email) {
            console.error("[auth] Google profile fetch failed", profile);
            return redirectWithLoginState(request.url, "error", { error: "AUTH_PROVIDER_PROFILE_INVALID" });
        }

        const user = await findOrCreateGoogleUser(profile);
        if (!user || user.error) {
            return redirectWithLoginState(request.url, "error", { error: "DB_SYNC_FAILED" });
        }

        return redirectWithLoginState(request.url, "success");
    } catch (error) {
        console.error("[auth] Google callback failed", error);
        return redirectWithLoginState(request.url, "error", { error: "AUTH_CALLBACK_FAILED" });
    }
}

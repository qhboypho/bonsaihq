import { getGoogleOAuthConfig, setOAuthStateCookie, validateGoogleOAuthClientId } from "../../../../lib/server/auth";
import crypto from "node:crypto";

function buildLoginErrorRedirect(requestUrl, error) {
    const url = new URL("/login", requestUrl);
    url.searchParams.set("error", error);
    return url;
}

export async function GET(request) {
    const { clientId, clientSecret, redirectUri } = await getGoogleOAuthConfig(request.url);
    if (!clientId || !clientSecret) {
        return Response.redirect(buildLoginErrorRedirect(request.url, "GOOGLE_AUTH_NOT_CONFIGURED"));
    }

    if (!validateGoogleOAuthClientId(clientId)) {
        return Response.redirect(buildLoginErrorRedirect(request.url, "GOOGLE_AUTH_CLIENT_ID_INVALID"));
    }

    const state = crypto.randomUUID();
    await setOAuthStateCookie(state);
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account",
        state,
    }).toString();

    return Response.redirect(url);
}

import { describe, expect, it } from "vitest";
import { getGoogleRedirectUri, validateGoogleOAuthClientId } from "../../lib/server/auth";

describe("Google OAuth helpers", () => {
    it("accepts OAuth client ids and rejects plain API keys", () => {
        expect(validateGoogleOAuthClientId("123456.apps.googleusercontent.com")).toBe(true);
        expect(validateGoogleOAuthClientId("AIzaSyPlainApiKey")).toBe(false);
    });

    it("uses the current local origin when a configured localhost redirect has a stale port", () => {
        const redirectUri = getGoogleRedirectUri(
            "http://localhost:3001/api/auth/google",
            "http://localhost:3000/api/auth/callback"
        );

        expect(redirectUri).toBe("http://localhost:3001/api/auth/callback");
    });
});

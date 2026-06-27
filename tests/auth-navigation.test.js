import { describe, expect, it } from "vitest";
import { getSafePostAuthPath, getUserHomePath } from "../lib/auth-navigation";

const artisanUser = { role: "ARTISAN", artisanId: "le_hai_minh" };
const adminUser = { role: "ADMIN" };

describe("auth navigation", () => {
    it("sends admins and artisans to their own home areas", () => {
        expect(getUserHomePath(adminUser)).toBe("/admin/moderation");
        expect(getUserHomePath(artisanUser)).toBe("/artisan/le_hai_minh");
    });

    it("does not send a logged-in artisan back to login or admin-only pages", () => {
        expect(getSafePostAuthPath("/login?next=%2Fadmin%2Fmoderation", artisanUser)).toBe("/artisan/le_hai_minh");
        expect(getSafePostAuthPath("/admin/moderation", artisanUser)).toBe("/artisan/le_hai_minh");
        expect(getSafePostAuthPath("/settings", artisanUser)).toBe("/artisan/le_hai_minh");
    });

    it("keeps safe next paths for the right role", () => {
        expect(getSafePostAuthPath("/upload", artisanUser)).toBe("/upload");
        expect(getSafePostAuthPath("/admin/artisans", adminUser)).toBe("/admin/artisans");
    });

    it("rejects external redirect targets", () => {
        expect(getSafePostAuthPath("https://example.com", adminUser)).toBe("/admin/moderation");
        expect(getSafePostAuthPath("//example.com", artisanUser)).toBe("/artisan/le_hai_minh");
    });
});

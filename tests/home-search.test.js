import { describe, expect, it } from "vitest";
import { matchesSearch, normalizeSearchText } from "../lib/home-search";

describe("home search helpers", () => {
    it("normalizes Vietnamese accents and casing", () => {
        expect(normalizeSearchText("  Lê Hải Đăng  ")).toBe("le hai dang");
    });

    it("matches across combined searchable fields", () => {
        expect(matchesSearch(["Nguyễn Văn Ba", "Hải Hậu, Nam Định", "Dáng Trực"], "nam dinh")).toBe(true);
        expect(matchesSearch(["Sứ Cổ", "Linh Sam", "Giao lưu: 1"], "giao luu")).toBe(true);
    });

    it("treats an empty query as a match", () => {
        expect(matchesSearch(["Bonsai Hội Quán"], "")).toBe(true);
    });
});

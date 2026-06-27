import { describe, expect, it } from "vitest";
import { validateGuestbookPayload, validateTreePayload } from "../../lib/server/validation";

describe("validateTreePayload", () => {
    it("normalizes valid tree submissions into the current frontend shape", () => {
        const result = validateTreePayload({
            title: "Sanh thử nghiệm",
            species: "Sanh Nam Điền",
            style: "Trực",
            size: "Mini",
            status: "Đang giao lưu",
            images: ["https://example.com/tree.jpg"],
            price: "1200000",
            evolution: [{ year: "2026", desc: "Tạo tán lần đầu" }],
        });

        expect(result.success).toBe(true);
        expect(result.data.title).toEqual({
            vi: "Sanh thử nghiệm",
            en: "Sanh thử nghiệm",
            jp: "Sanh thử nghiệm",
        });
        expect(result.data.price).toBe(1200000);
        expect(result.data.evolution[0].desc.vi).toBe("Tạo tán lần đầu");
    });

    it("rejects missing required fields and empty image lists", () => {
        const result = validateTreePayload({
            title: "",
            species: "",
            style: "",
            size: "",
            images: [],
        });

        expect(result.success).toBe(false);
        expect(result.fields.title).toBeDefined();
        expect(result.fields.images).toBeDefined();
    });
});

describe("validateGuestbookPayload", () => {
    it("accepts valid guestbook entries", () => {
        const result = validateGuestbookPayload({
            name: "Khách chơi cây",
            contact: "0900000000",
            content: "Vườn rất đẹp.",
        });

        expect(result.success).toBe(true);
        expect(result.data.name).toBe("Khách chơi cây");
    });

    it("requires name and content", () => {
        const result = validateGuestbookPayload({ name: "", content: "" });

        expect(result.success).toBe(false);
        expect(result.fields.name).toBeDefined();
        expect(result.fields.content).toBeDefined();
    });
});

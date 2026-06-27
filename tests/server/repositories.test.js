import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import path from "node:path";
import { addGuestbookEntry, deleteArtisan, getArtisanById, saveArtisan } from "../../lib/server/repositories/artisans";
import { getSettings, updateModerationRequired } from "../../lib/server/repositories/settings";
import { createTree, listTrees, updateTreeApproval } from "../../lib/server/repositories/trees";

const dataDir = path.join(process.cwd(), ".data");

async function cleanData() {
    await rm(dataDir, { recursive: true, force: true });
}

beforeEach(cleanData);
afterEach(cleanData);

describe("server repositories", () => {
    it("seeds default data when the file store is empty", async () => {
        const trees = await listTrees({ approvedOnly: true });
        const artisan = await getArtisanById("nguyen_van_ba");

        expect(trees.length).toBeGreaterThan(0);
        expect(artisan.name).toBe("Nguyễn Văn Ba");
    });

    it("creates pending trees when moderation is enabled, then approves them", async () => {
        await updateModerationRequired(true);
        const settings = await getSettings();

        const created = await createTree({
            ownerId: "nguyen_van_ba",
            title: { vi: "Cây chờ duyệt", en: "Pending tree", jp: "保留中" },
            species: { vi: "Sanh", en: "Ficus", jp: "フィカス" },
            style: "Trực",
            size: "Mini",
            age: { vi: "5 năm", en: "5 years", jp: "5年" },
            potAge: { vi: "1 năm", en: "1 year", jp: "1年" },
            origin: { vi: "Việt Nam", en: "Vietnam", jp: "ベトナム" },
            status: "Đang giao lưu",
            price: 1000000,
            story: { vi: "Test", en: "Test", jp: "Test" },
            images: ["https://example.com/tree.jpg"],
            evolution: [],
        });

        expect(settings.moderationRequired).toBe(true);
        expect(created.approved).toBe(false);

        const approved = await updateTreeApproval(created.id, true);
        expect(approved.approved).toBe(true);
    });

    it("persists guestbook entries", async () => {
        const entry = await addGuestbookEntry("nguyen_van_ba", {
            name: "Visitor",
            contact: "Zalo",
            content: "Great garden.",
        });

        const artisan = await getArtisanById("nguyen_van_ba");

        expect(entry.name).toBe("Visitor");
        expect(artisan.guestbook[0].content).toBe("Great garden.");
    });

    it("creates and deletes artisans without owned trees", async () => {
        const artisan = await saveArtisan({
            id: "test_artisan",
            name: "Test Artisan",
            rank: { vi: "Nghệ nhân thử nghiệm", en: "Test artisan", jp: "テスト" },
            address: { vi: "Việt Nam", en: "Vietnam", jp: "ベトナム" },
            bio: { vi: "Bio", en: "Bio", jp: "Bio" },
            avatar: "https://example.com/avatar.jpg",
            cover: "https://example.com/cover.jpg",
            phone: "0900000000",
            zalo: "https://zalo.me/0900000000",
            guestbook: [],
            blog: [],
        });

        expect(artisan.name).toBe("Test Artisan");
        expect(await deleteArtisan("test_artisan")).toBe(true);
        expect(await getArtisanById("test_artisan")).toBeNull();
    });
});

import { PrismaClient } from "@prisma/client";
import { DEFAULT_ARTISANS, DEFAULT_TREES } from "../lib/db.js";

const prisma = new PrismaClient();

const STATUS_TO_ENUM = {
    "Trưng bày": "EXHIBIT",
    "Đang giao lưu": "SALE",
    "Đang tạo tác": "TRAINING",
};

async function main() {
    await prisma.appSetting.upsert({
        where: { key: "moderationRequired" },
        update: { value: false },
        create: { key: "moderationRequired", value: false },
    });

    for (const artisan of Object.values(DEFAULT_ARTISANS)) {
        await prisma.artisan.upsert({
            where: { slug: artisan.id },
            update: {
                name: artisan.name,
                rank: artisan.rank,
                address: artisan.address,
                bio: artisan.bio,
                phone: artisan.phone,
                zalo: artisan.zalo,
                avatarUrl: artisan.avatar,
                coverUrl: artisan.cover,
            },
            create: {
                id: artisan.id,
                slug: artisan.id,
                name: artisan.name,
                rank: artisan.rank,
                address: artisan.address,
                bio: artisan.bio,
                phone: artisan.phone,
                zalo: artisan.zalo,
                avatarUrl: artisan.avatar,
                coverUrl: artisan.cover,
            },
        });
    }

    for (const tree of DEFAULT_TREES) {
        await prisma.tree.upsert({
            where: { id: tree.id },
            update: {},
            create: {
                id: tree.id,
                ownerId: tree.ownerId,
                title: tree.title,
                species: tree.species,
                style: tree.style,
                size: tree.size,
                age: tree.age,
                potAge: tree.potAge,
                origin: tree.origin,
                status: STATUS_TO_ENUM[tree.status] || "TRAINING",
                price: tree.price || 0,
                story: tree.story,
                approved: tree.approved,
                images: {
                    create: tree.images.map((url, index) => ({ url, sortOrder: index })),
                },
                evolution: {
                    create: tree.evolution.map((step, index) => ({
                        year: step.year,
                        description: step.desc,
                        sortOrder: index,
                    })),
                },
            },
        });
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });

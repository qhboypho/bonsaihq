import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fail, ok, serverError } from "../../../../lib/server/errors";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function safeFileName(name) {
    const ext = path.extname(name || ".jpg").toLowerCase() || ".jpg";
    const base = path.basename(name || "bonsai", ext).replace(/[^a-zA-Z0-9_-]/g, "-");
    return `${Date.now()}-${base}${ext}`;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return fail(400, "VALIDATION_ERROR", "Image file is required.");
        }

        if (!file.type.startsWith("image/")) {
            return fail(400, "VALIDATION_ERROR", "Only image uploads are allowed.");
        }

        if (file.size > MAX_FILE_SIZE) {
            return fail(400, "VALIDATION_ERROR", "Image must be 5MB or smaller.");
        }

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const fileName = safeFileName(file.name);
        const bytes = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadsDir, fileName), bytes);

        return ok({
            url: `/uploads/${fileName}`,
            fileName,
            contentType: file.type,
            size: file.size,
        }, { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

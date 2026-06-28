import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { getArtisanById, saveArtisan } from "../../../../lib/server/repositories/artisans";
import { validateArtisanPayload } from "../../../../lib/server/validation";

export async function GET(_request, { params }) {
    try {
        const { id } = await params;
        const artisan = await getArtisanById(id);

        if (!artisan) {
            return fail(404, "NOT_FOUND", "Artisan was not found.");
        }

        return ok(artisan);
    } catch (error) {
        return serverError(error);
    }
}

export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return fail(401, "UNAUTHORIZED", "Please log in to update this profile.");
        }

        const { id } = await params;
        const existing = await getArtisanById(id);
        if (!existing) {
            return fail(404, "NOT_FOUND", "Artisan was not found.");
        }

        if (user.role !== "ADMIN" && user.artisanId !== id) {
            return fail(403, "FORBIDDEN", "You can only update your own profile.");
        }

        const payload = await request.json();
        const parsed = validateArtisanPayload({ ...existing, ...payload, id });
        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Invalid artisan profile data.", parsed.fields);
        }

        const saved = await saveArtisan(parsed.data);
        return ok(saved);
    } catch (error) {
        return serverError(error);
    }
}

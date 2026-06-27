import { fail, ok, serverError } from "../../../../../lib/server/errors";
import { getCurrentUser } from "../../../../../lib/server/auth";
import { canModerate } from "../../../../../lib/server/permissions";
import { deleteArtisan, getArtisanById, saveArtisan } from "../../../../../lib/server/repositories/artisans";
import { validateArtisanPayload } from "../../../../../lib/server/validation";

export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        const { id } = await params;
        const existing = await getArtisanById(id);
        if (!existing) return fail(404, "NOT_FOUND", "Artisan was not found.");

        const parsed = validateArtisanPayload({ ...existing, ...(await request.json()), id });
        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Artisan payload is invalid.", parsed.fields);
        }

        return ok(await saveArtisan(parsed.data));
    } catch (error) {
        return serverError(error);
    }
}

export async function DELETE(_request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        const { id } = await params;
        const deleted = await deleteArtisan(id);
        if (!deleted) {
            return fail(409, "ARTISAN_HAS_TREES", "Cannot delete an artisan that still owns trees.");
        }

        return ok({ id, deleted: true });
    } catch (error) {
        return serverError(error);
    }
}

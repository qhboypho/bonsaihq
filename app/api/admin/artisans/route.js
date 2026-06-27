import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { listArtisans, saveArtisan } from "../../../../lib/server/repositories/artisans";
import { validateArtisanPayload } from "../../../../lib/server/validation";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        return ok(await listArtisans());
    } catch (error) {
        return serverError(error);
    }
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        const parsed = validateArtisanPayload(await request.json());
        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Artisan payload is invalid.", parsed.fields);
        }

        return ok(await saveArtisan(parsed.data), { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

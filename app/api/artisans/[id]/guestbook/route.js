import { fail, ok, serverError } from "../../../../../lib/server/errors";
import { addGuestbookEntry } from "../../../../../lib/server/repositories/artisans";
import { validateGuestbookPayload } from "../../../../../lib/server/validation";

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = validateGuestbookPayload(body);

        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Guestbook payload is invalid.", parsed.fields);
        }

        const entry = await addGuestbookEntry(id, parsed.data);
        if (!entry) {
            return fail(404, "NOT_FOUND", "Artisan was not found.");
        }

        return ok(entry, { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

import { fail, ok, serverError } from "../../../../lib/server/errors";
import { createUploadTarget } from "../../../../lib/server/storage";

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.fileName || !body.contentType?.startsWith("image/")) {
            return fail(400, "VALIDATION_ERROR", "Only image uploads are allowed.");
        }

        const target = await createUploadTarget(body);
        return ok(target);
    } catch (error) {
        return serverError(error);
    }
}

import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { updateModerationRequired } from "../../../../lib/server/repositories/settings";

export async function PATCH(request) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can change moderation settings.");
        }

        const body = await request.json();
        const settings = await updateModerationRequired(Boolean(body.moderationRequired));
        return ok(settings);
    } catch (error) {
        return serverError(error);
    }
}

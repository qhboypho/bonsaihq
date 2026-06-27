import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { resetData } from "../../../../lib/server/repositories/settings";

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can reset data.");
        }

        const db = await resetData();
        return ok(db);
    } catch (error) {
        return serverError(error);
    }
}

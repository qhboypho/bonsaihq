import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { listTrees } from "../../../../lib/server/repositories/trees";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage trees.");
        }

        return ok(await listTrees({ approvedOnly: false }));
    } catch (error) {
        return serverError(error);
    }
}

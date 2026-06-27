import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { getGoogleAuthSettings, updateGoogleAuthSettings } from "../../../../lib/server/repositories/settings";

async function requireAdmin() {
    const user = await getCurrentUser();
    return canModerate(user);
}

export async function GET() {
    try {
        if (!(await requireAdmin())) {
            return fail(403, "FORBIDDEN", "Only administrators can view Google auth settings.");
        }
        return ok(await getGoogleAuthSettings());
    } catch (error) {
        return serverError(error);
    }
}

export async function PATCH(request) {
    try {
        if (!(await requireAdmin())) {
            return fail(403, "FORBIDDEN", "Only administrators can update Google auth settings.");
        }
        await updateGoogleAuthSettings(await request.json());
        return ok(await getGoogleAuthSettings());
    } catch (error) {
        return serverError(error);
    }
}

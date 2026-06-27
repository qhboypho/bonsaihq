import { ok, serverError } from "../../../../../lib/server/errors";
import { getGoogleAuthSettings } from "../../../../../lib/server/repositories/settings";

export async function GET() {
    try {
        return ok(await getGoogleAuthSettings());
    } catch (error) {
        return serverError(error);
    }
}

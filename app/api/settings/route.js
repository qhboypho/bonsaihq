import { ok, serverError } from "../../../lib/server/errors";
import { getSettings } from "../../../lib/server/repositories/settings";

export async function GET() {
    try {
        const settings = await getSettings();
        return ok(settings);
    } catch (error) {
        return serverError(error);
    }
}

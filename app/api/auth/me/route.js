import { ok, serverError } from "../../../../lib/server/errors";
import { getSessionUser } from "../../../../lib/server/auth";

export async function GET() {
    try {
        return ok(await getSessionUser());
    } catch (error) {
        return serverError(error);
    }
}

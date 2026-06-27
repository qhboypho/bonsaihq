import { ok, serverError } from "../../../lib/server/errors";
import { readStore } from "../../../lib/server/store";

export async function GET() {
    try {
        const db = await readStore();
        return ok(db);
    } catch (error) {
        return serverError(error);
    }
}

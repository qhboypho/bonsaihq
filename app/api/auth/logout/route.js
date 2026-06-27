import { ok, serverError } from "../../../../lib/server/errors";
import { signOut } from "../../../../lib/server/auth";

export async function POST() {
    try {
        await signOut();
        return ok({ signedOut: true });
    } catch (error) {
        return serverError(error);
    }
}

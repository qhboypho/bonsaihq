import { fail, ok, serverError } from "../../../../lib/server/errors";
import { signInWithPassword } from "../../../../lib/server/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const user = await signInWithPassword(String(body.email || ""), String(body.password || ""));

        if (!user) {
            return fail(401, "INVALID_CREDENTIALS", "Email or password is invalid.");
        }

        return ok(user);
    } catch (error) {
        return serverError(error);
    }
}

import { fail, ok, serverError } from "../../../../lib/server/errors";
import { registerArtisanAccount } from "../../../../lib/server/auth";

export async function POST(request) {
    try {
        const result = await registerArtisanAccount(await request.json());
        if (!result || result.error) {
            return fail(400, "REGISTRATION_FAILED", result?.error || "Unable to register account.");
        }

        return ok(result, { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

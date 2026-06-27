import { fail, ok, serverError } from "../../../../lib/server/errors";
import { createArtisanUserAccount, getCurrentUser, validateArtisanUserAccountInput } from "../../../../lib/server/auth";
import { canModerate } from "../../../../lib/server/permissions";
import { listArtisans, saveArtisan } from "../../../../lib/server/repositories/artisans";
import { validateArtisanPayload } from "../../../../lib/server/validation";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        return ok(await listArtisans());
    } catch (error) {
        return serverError(error);
    }
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage artisans.");
        }

        const body = await request.json();
        const parsed = validateArtisanPayload(body);
        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Artisan payload is invalid.", parsed.fields);
        }

        const accountUsername = String(body.accountUsername || "").trim();
        const accountPassword = String(body.accountPassword || "");
        if (accountUsername || accountPassword) {
            const accountValidation = await validateArtisanUserAccountInput({
                name: parsed.data.name,
                username: accountUsername,
                password: accountPassword,
                artisanId: parsed.data.id,
            });
            if (accountValidation.error) {
                return fail(400, "ACCOUNT_VALIDATION_ERROR", accountValidation.error);
            }
        }

        const artisan = await saveArtisan(parsed.data);
        if (accountUsername || accountPassword) {
            const account = await createArtisanUserAccount({
                name: artisan.name,
                username: accountUsername,
                password: accountPassword,
                artisanId: artisan.id,
            });

            if (account.error) {
                return fail(400, "ACCOUNT_VALIDATION_ERROR", account.error);
            }

            return ok({ ...artisan, accountCreated: true, accountUsername: account.username }, { status: 201 });
        }

        return ok(artisan, { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

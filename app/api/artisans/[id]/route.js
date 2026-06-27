import { fail, ok, serverError } from "../../../../lib/server/errors";
import { getArtisanById } from "../../../../lib/server/repositories/artisans";

export async function GET(_request, { params }) {
    try {
        const { id } = await params;
        const artisan = await getArtisanById(id);

        if (!artisan) {
            return fail(404, "NOT_FOUND", "Artisan was not found.");
        }

        return ok(artisan);
    } catch (error) {
        return serverError(error);
    }
}

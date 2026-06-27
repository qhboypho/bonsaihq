import { ok, serverError } from "../../../lib/server/errors";
import { listArtisans } from "../../../lib/server/repositories/artisans";

export async function GET() {
    try {
        const artisans = await listArtisans();
        return ok(artisans);
    } catch (error) {
        return serverError(error);
    }
}

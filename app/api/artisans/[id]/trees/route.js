import { ok, serverError } from "../../../../../lib/server/errors";
import { listArtisanTrees } from "../../../../../lib/server/repositories/artisans";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const includePending = request.nextUrl.searchParams.get("includePending") === "true";
        const trees = await listArtisanTrees(id, includePending);
        return ok(trees);
    } catch (error) {
        return serverError(error);
    }
}

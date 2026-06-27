import { fail, ok, serverError } from "../../../lib/server/errors";
import { getCurrentUser } from "../../../lib/server/auth";
import { canCreateTree } from "../../../lib/server/permissions";
import { createTree, listTrees } from "../../../lib/server/repositories/trees";
import { validateTreePayload } from "../../../lib/server/validation";

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const includePending = searchParams.get("includePending") === "true";

        const trees = await listTrees({
            approvedOnly: !includePending,
            ownerId: searchParams.get("ownerId") || undefined,
            style: searchParams.get("style") || undefined,
            size: searchParams.get("size") || undefined,
        });

        return ok(trees);
    } catch (error) {
        return serverError(error);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const parsed = validateTreePayload(body);

        if (!parsed.success) {
            return fail(400, "VALIDATION_ERROR", "Tree payload is invalid.", parsed.fields);
        }

        const user = await getCurrentUser();
        if (!canCreateTree(user, parsed.data.ownerId)) {
            return fail(403, "FORBIDDEN", "You are not allowed to create trees for this artisan.");
        }

        const tree = await createTree(parsed.data);
        return ok(tree, { status: 201 });
    } catch (error) {
        return serverError(error);
    }
}

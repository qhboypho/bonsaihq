import { fail, ok, serverError } from "../../../../../lib/server/errors";
import { getCurrentUser } from "../../../../../lib/server/auth";
import { canModerate } from "../../../../../lib/server/permissions";
import { deleteTree, updateTreeApproval } from "../../../../../lib/server/repositories/trees";

export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage trees.");
        }

        const { id } = await params;
        const body = await request.json();

        if (typeof body.approved !== "boolean") {
            return fail(400, "VALIDATION_ERROR", "approved must be a boolean.");
        }

        const tree = await updateTreeApproval(id, body.approved);
        if (!tree) return fail(404, "NOT_FOUND", "Tree was not found.");
        return ok(tree);
    } catch (error) {
        return serverError(error);
    }
}

export async function DELETE(_request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can manage trees.");
        }

        const { id } = await params;
        const deleted = await deleteTree(id);
        if (!deleted) return fail(404, "NOT_FOUND", "Tree was not found.");
        return ok({ id, deleted: true });
    } catch (error) {
        return serverError(error);
    }
}

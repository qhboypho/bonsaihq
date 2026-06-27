import { fail, ok, serverError } from "../../../../../../lib/server/errors";
import { getCurrentUser } from "../../../../../../lib/server/auth";
import { canModerate } from "../../../../../../lib/server/permissions";
import { deleteTree, updateTreeApproval } from "../../../../../../lib/server/repositories/trees";

export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!canModerate(user)) {
            return fail(403, "FORBIDDEN", "Only administrators can moderate trees.");
        }

        const { id } = await params;
        const body = await request.json();

        if (body.action !== "approve" && body.action !== "reject") {
            return fail(400, "VALIDATION_ERROR", "Action must be approve or reject.");
        }

        if (body.action === "reject") {
            const deleted = await deleteTree(id);
            if (!deleted) return fail(404, "NOT_FOUND", "Tree was not found.");
            return ok({ id, deleted: true });
        }

        const tree = await updateTreeApproval(id, true);
        if (!tree) return fail(404, "NOT_FOUND", "Tree was not found.");
        return ok(tree);
    } catch (error) {
        return serverError(error);
    }
}

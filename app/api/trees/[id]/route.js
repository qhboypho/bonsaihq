import { fail, ok, serverError } from "../../../../lib/server/errors";
import { deleteTree, getTreeById } from "../../../../lib/server/repositories/trees";
import { getCurrentUser } from "../../../../lib/server/auth";
import { canCreateTree } from "../../../../lib/server/permissions";

export async function GET(_request, { params }) {
    try {
        const { id } = await params;
        const tree = await getTreeById(id);

        if (!tree) {
            return fail(404, "NOT_FOUND", "Tree was not found.");
        }

        return ok(tree);
    } catch (error) {
        return serverError(error);
    }
}

export async function DELETE(_request, { params }) {
    try {
        const { id } = await params;
        const tree = await getTreeById(id);

        if (!tree) {
            return fail(404, "NOT_FOUND", "Tree was not found.");
        }

        const user = await getCurrentUser();
        if (!canCreateTree(user, tree.ownerId)) {
            return fail(403, "FORBIDDEN", "You are not allowed to delete this tree.");
        }

        await deleteTree(id);
        return ok({ id, deleted: true });
    } catch (error) {
        return serverError(error);
    }
}

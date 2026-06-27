import { fail, ok, serverError } from "../../../../lib/server/errors";
import { signInWithPassword } from "../../../../lib/server/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const user = await signInWithPassword(String(body.username || body.email || "").trim().toLowerCase(), String(body.password || ""));

        if (!user) {
            return fail(401, "INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        return ok(user);
    } catch (error) {
        return serverError(error);
    }
}

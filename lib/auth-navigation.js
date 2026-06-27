export function getUserHomePath(user) {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin/moderation";
    if (user.artisanId) return `/artisan/${user.artisanId}`;
    return "/upload";
}

export function getSafePostAuthPath(nextPath, user) {
    if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
        return getUserHomePath(user);
    }

    if (
        nextPath === "/login" ||
        nextPath.startsWith("/login?") ||
        nextPath === "/register" ||
        nextPath.startsWith("/register?")
    ) {
        return getUserHomePath(user);
    }

    const isAdminOnlyPath = nextPath.startsWith("/admin") || nextPath.startsWith("/settings");
    if (isAdminOnlyPath && user?.role !== "ADMIN") {
        return getUserHomePath(user);
    }

    return nextPath;
}

export function canCreateTree(user, ownerId) {
    return user?.role === "ADMIN" || user?.artisanId === ownerId;
}

export function canModerate(user) {
    return user?.role === "ADMIN";
}

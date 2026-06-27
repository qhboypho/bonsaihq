export function ok(data, init) {
    return Response.json({ data }, init);
}

export function fail(status, code, message, fields = {}) {
    return Response.json(
        { error: { code, message, fields } },
        { status }
    );
}

export function serverError(error) {
    console.error(error);
    return fail(500, "SERVER_ERROR", "The server could not complete the request.");
}

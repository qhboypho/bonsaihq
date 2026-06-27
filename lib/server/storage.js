export async function createUploadTarget({ fileName, contentType }) {
    const safeName = String(fileName || "bonsai-photo").replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `${Date.now()}-${safeName}`;

    return {
        uploadUrl: `/api/uploads/mock/${key}`,
        publicUrl: `/uploads/${key}`,
        contentType,
    };
}

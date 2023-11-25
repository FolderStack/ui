import { NextRequest } from "next/server";

export async function getRequestBody(req: NextRequest) {
    if (!req.body) return null;
    const reader = req.body.getReader();
    const data = await reader.read();
    const uintArr = data.value;

    try {
        if (uintArr) {
            const str = Buffer.from(uintArr).toString();
            return JSON.parse(str);
        }
    } catch (err) {
        console.warn(err);
    }

    return null;
}

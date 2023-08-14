import { randomBytes } from "crypto";
import { cookies } from "next/dist/client/components/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

export function getCsrfCookie(req: NextRequest, Cookies = cookies()) {
    const host = req.headers.get("host") ?? "";
    const cookieOptions: Partial<ResponseCookie> = {
        secure: true,
        sameSite: true,
        domain: host,
        httpOnly: false,
    };

    if (host?.length && host.length > 0) {
        Cookies.set(
            "fscsrf",
            randomBytes(16).toString("base64"),
            cookieOptions
        );
    }

    return Cookies;
}

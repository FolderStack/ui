import { config } from "@/config";
import {
    AccessTokenError,
    AccessTokenErrorCode,
    GetAccessTokenResult,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

const IS_TEST = true;

const handler = async (req: NextRequest) => {
    const url = new URL(req.url!);
    const pathname = url.pathname.split("/api/")[1];
    const query = url.search;

    const apiUrl = `${config.api.baseUrl}/${pathname}${query}`;

    let token: GetAccessTokenResult | null = null;
    try {
        const tokenCookie = req.cookies.get("_fsat")?.value;
        if (!tokenCookie) {
            throw new AccessTokenError(
                AccessTokenErrorCode.MISSING_ACCESS_TOKEN,
                "token missing"
            );
        }
        token = { accessToken: tokenCookie };
    } catch (err) {
        if (err instanceof AccessTokenError && !IS_TEST) {
            return new NextResponse(null, { status: 401 });
        }
    }

    if (token === null && !IS_TEST) {
        return new NextResponse(null, { status: 401 });
    }

    const rawBody = await (req as any).text();

    const headers = req.headers as unknown as Headers;

    if (IS_TEST) {
        headers.set(
            "X-Test-Authorizer",
            config.api.headers["X-Test-Authorizer"]
        );
    } else if (token) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
    }

    headers.delete("content-length");

    const method = req.method.trim().toUpperCase();

    if (["PATCH", "PUT", "DELETE", "POST"].includes(method)) {
        const cookieCsrf = req.cookies.get("_fscsrf");
        const reqCsrf = req.headers.get("X-CSRF");

        if (!cookieCsrf || !reqCsrf) {
            return new NextResponse(
                JSON.stringify({
                    error: "invalid_token",
                    error_description: "CSRF token validation failed.",
                }),
                {
                    status: 403,
                }
            );
        }
    }

    const response = await fetch(apiUrl, {
        method: req.method,
        body:
            !!rawBody && method !== "GET" && method !== "HEAD"
                ? rawBody
                : undefined,
        headers,
    });
    console.log(response);
    let result = {};
    try {
        result = await response.json();
    } catch (err) {
        console.log(err);
    }
    result = result ?? {};

    let status = response.status;
    if (response.status.toString().startsWith("20")) {
        status = 200;
    }

    return NextResponse.json(result, { status });
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
export const PATCH = handler;

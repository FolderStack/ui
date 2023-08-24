import { config } from "@/config";
import {
    AccessTokenError,
    AccessTokenErrorCode,
    GetAccessTokenResult,
} from "@auth0/nextjs-auth0";
import { Agent } from "https";
import * as JWT from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { getCsrfCookie } from "../getCsrfCookie";

const agent = new Agent({
    rejectUnauthorized: false,
});

const handler = async (req: NextRequest) => {
    const url = new URL(req.url!);
    const pathname = url.pathname.split("/api/")[1];
    const query = url.search;

    const apiUrl = `${config.api.baseUrl}/${pathname}${query}`;

    let token: Required<GetAccessTokenResult> | null = null;
    try {
        const tokenCookie = req.cookies.get("fsat")?.value;
        if (!tokenCookie) {
            throw new AccessTokenError(
                AccessTokenErrorCode.MISSING_ACCESS_TOKEN,
                "token missing"
            );
        }
        token = { accessToken: tokenCookie };
    } catch (err) {
        if (err instanceof AccessTokenError) {
            return new NextResponse(null, { status: 401 });
        }
    }

    const headers = req.headers as unknown as Headers;
    if (token === null) {
        return new NextResponse(null, { status: 401 });
    } else {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
    }

    const rawBody = await (req as any).text();

    headers.delete("content-length");

    const method = req.method.trim().toUpperCase();
    const tokenData = JWT.decode(token.accessToken) as JWT.JwtPayload;
    const realm = tokenData.rlm;

    if (realm !== "folderstack") {
        return new NextResponse(null, { status: 403 });
    }

    if (["PATCH", "PUT", "DELETE", "POST"].includes(method)) {
        const cookieCsrf = req.cookies.get("fscsrf")?.value;
        const reqCsrf =
            req.headers.get("X-CSRF") ??
            req.headers.get("X-Csrf") ??
            req.headers.get("x-csrf");

        const permissions = tokenData.permissions ?? "Nil";

        if (permissions !== "*") {
            return new NextResponse(null, { status: 403 });
        }

        if (!cookieCsrf || !reqCsrf || cookieCsrf !== reqCsrf) {
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
        agent,
    });

    let result: any = {};
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

    return NextResponse.json(result, {
        status,
        headers: {
            "Set-Cookie": getCsrfCookie(req).toString(),
        },
    });
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
export const PATCH = handler;

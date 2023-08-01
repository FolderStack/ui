import { config } from "@/config";
import {
    AccessTokenError,
    GetAccessTokenResult,
    getAccessToken,
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
        token = await getAccessToken(req, null as any);
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

    if (!IS_TEST && token) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
    }

    headers.set("X-Test-Authorizer", config.api.headers["X-Test-Authorizer"]);
    headers.delete("content-length");

    console.log(rawBody, !!rawBody);

    const method = req.method.toUpperCase();

    const response = await fetch(apiUrl, {
        method: req.method,
        body:
            !!rawBody && method !== "GET" && method !== "HEAD"
                ? rawBody
                : undefined,
        headers,
    });

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

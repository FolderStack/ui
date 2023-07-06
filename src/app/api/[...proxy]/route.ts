import { config } from "@/config";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextApiHandler, NextApiRequest } from "next";
import { NextResponse } from "next/server";

const handler: NextApiHandler = async (req: NextApiRequest) => {
    const url = new URL(req.url!);
    const pathname = url.pathname.split("/api/")[1];
    const query = url.search;

    const apiUrl = `${config.api.baseUrl}/${pathname}${query}`;
    const token = await getAccessToken(req, null as any);

    const rawBody = await (req as any).text();

    const response = await fetch(apiUrl, {
        method: req.method,
        body: ["POST", "PUT", "PATCH"].includes(req.method?.toUpperCase() ?? "")
            ? rawBody
            : undefined,
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            ...config.api.headers,
        },
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
export const PATCH = handler;

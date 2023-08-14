import { pseudoRandomBytes } from "crypto";
import { cookies } from "next/dist/client/components/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

function isValidUrl(url?: unknown) {
    try {
        new URL(url as any);
        return true;
    } catch {
        return false;
    }
}

export async function GET(
    req: NextRequest,
    ctx: { params: Record<string, string> }
) {
    let baseUrl: string = (req.headers as any).get("host") ?? req.url;
    if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
    }

    if (!baseUrl || !isValidUrl(baseUrl)) {
        return new Response(
            JSON.stringify({
                error: "invalid_request",
                error_description: "Missing required header: host",
            }),
            { status: 400 }
        );
    }

    const url = new URL(baseUrl);
    const res = new Response();

    const reqNonce = pseudoRandomBytes(12).toString("base64");
    const stateNonce = pseudoRandomBytes(12).toString("base64");
    const returnTo = ctx.params?.["returnTo"] ?? null;

    const expiry = new Date(new Date().getTime() + 1000 * 60 * 5); // 5 minutes

    const state = new URLSearchParams();
    state.set("nonce", stateNonce);
    state.set("expires", expiry.getTime().toString());
    if (returnTo) {
        state.set("returnTo", Array.isArray(returnTo) ? returnTo[0] : returnTo);
    }

    const stateStr = Buffer.from(state.toString()).toString("base64");

    const currentUrl = `${url.protocol}//${url.host}`;
    const authorize = new URL("https://auth.folderstack.io/oauth/authorize");
    authorize.searchParams.set("client_id", url.host);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("state", stateStr);
    authorize.searchParams.set("scope", "basic");
    authorize.searchParams.set("nonce", reqNonce);
    authorize.searchParams.set(
        "redirect_uri",
        `${currentUrl}/api/auth/callback`
    );

    const Cookies = cookies();
    const cookieOptions: Partial<ResponseCookie> = {
        secure: true,
        sameSite: true,
        domain: req.headers.get("host") ?? undefined,
        httpOnly: true,
        expires: expiry,
    };

    Cookies.set("fstrn", reqNonce, cookieOptions);
    Cookies.set("fsts", state.toString(), cookieOptions);
    Cookies.set("fsrt", "code", cookieOptions);

    res.headers.set("Location", authorize.toString());
    res.headers.set("Set-Cookie", Cookies.toString());

    return new Response(null, {
        status: 302,
        headers: res.headers,
    });
}

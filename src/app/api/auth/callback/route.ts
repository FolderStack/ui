import { pseudoRandomBytes } from "crypto";
import _ from "lodash";
import { NextApiRequest } from "next";
import { cookies } from "next/dist/client/components/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function GET(req: NextApiRequest) {
    const url = new URL(req.url!);
    const host: string = (req.headers as any).get("host") ?? url.host;

    url.port = "";
    url.protocol = "https:";
    url.host = host;

    const code = url.searchParams.get("code");

    const tokenParams = new URLSearchParams();
    tokenParams.set("code", String(code));
    tokenParams.set("client_id", host);
    tokenParams.set("grant_type", "authorization_code");
    tokenParams.set(
        "redirect_uri",
        `${url.protocol}//${host}/api/auth/callback`
    );

    const tokenResponse = await fetch(
        `https://auth.folderstack.io/oauth/token?${tokenParams.toString()}`,
        { method: "POST" }
    );

    const body = await tokenResponse.json();

    const accessToken = _.get(body, "access_token", null);
    const refreshToken = _.get(body, "refresh_token", null);

    const expiry = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

    const Cookies = cookies();
    const cookieOptions: Partial<ResponseCookie> = {
        secure: true,
        sameSite: "strict",
        domain: req.headers.host,
        httpOnly: true,
        expires: expiry,
    };

    if (accessToken) {
        Cookies.set("_fsat", accessToken, cookieOptions);
        if (refreshToken) {
            Cookies.set("_fsrt", refreshToken.toString(), {
                ...cookieOptions,
                expires: new Date(new Date().getTime() + 1000 * 60 * 24), // 24 hours
            });
        }
    } else {
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/auth/error?message=Authorization Failed&description=The authorization process failed, please try again.`,
            },
        });
    }

    const userState = JSON.stringify({ isAdmin: true });
    Cookies.set("_fsus", Buffer.from(userState).toString("base64"));

    const csrf = pseudoRandomBytes(32);
    Cookies.set("_fscsrf", Buffer.from(csrf).toString("base64"));

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
            "Set-Cookie": Cookies.toString(),
        },
    });
}

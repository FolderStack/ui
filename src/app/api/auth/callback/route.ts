import * as JWT from "jsonwebtoken";
import _ from "lodash";
import { cookies } from "next/dist/client/components/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";
import { getCsrfCookie } from "../../getCsrfCookie";

export async function GET(req: NextRequest) {
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
        domain: req.headers.get("host") ?? "",
        httpOnly: true,
        expires: expiry,
    };

    const userState: Record<string, any> = {};

    if (accessToken) {
        Cookies.set("fsat", accessToken, cookieOptions);

        try {
            const tokenBody = JWT.decode(accessToken);
            if (
                typeof tokenBody === "object" &&
                tokenBody &&
                "permissions" in tokenBody
            ) {
                if (tokenBody.permissions === "*") {
                    // FS Roles: 1 = administrator
                    userState.r = ["1"];
                }
            }
        } catch (err) {
            //
        }

        if (refreshToken) {
            Cookies.set("fsrt", refreshToken.toString(), {
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

    Cookies.set(
        "fsus",
        Buffer.from(JSON.stringify(userState))
            .toString("base64")
            .replace(/=+$/, "")
    );

    getCsrfCookie(req, Cookies);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
            "Set-Cookie": Cookies.toString(),
        },
    });
}

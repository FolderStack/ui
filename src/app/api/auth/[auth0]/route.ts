import {
    AccessTokenError,
    HandlerError,
    handleAuth,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = handleAuth({
    async onError(
        req: NextApiRequest,
        res: NextApiResponse,
        error: HandlerError
    ) {
        console.log(error, error?.code);
        if (error instanceof AccessTokenError) {
            res.redirect("/api/auth/login");
        }
    },
});

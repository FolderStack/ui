// import { handleAuth } from "@auth0/nextjs-auth0";
// import { AppRouteHandlerFnContext } from "@auth0/nextjs-auth0/dist/handlers";
// import { NextRequest } from "next/server";

// export const GET = handleAuth({
//     callback: async function (
//         req: NextRequest,
//         resOrOpts: AppRouteHandlerFnContext
//     ) {
//         console.log("callback...", req, resOrOpts, "...callback");

//         const params = new URL(req.url).searchParams;

//         const code = params.get("code");
//         const code_verifier = params.get("code_verifier");
//         const nonce = params.get("nonce");
//         const max_age = params.get("max_age");

//         return resOrOpts as unknown as Response;
//     } as any,
//     onError: async function (...args: any[]) {
//         console.log(...args);
//         // if (error instanceof AccessTokenError) {
//         //     res.redirect("/api/auth/login");
//         // }
//     },
// });

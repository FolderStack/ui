import { NextResponse, type NextRequest } from "next/server";

export function generateCsp() {
    // generate random nonce converted to base64. Must be different on every HTTP page load
    // const nonce = crypto.randomBytes(16).toString('base64')
    const nonce = crypto.randomUUID();

    const csp = [
        { name: "default-src", values: ["'self'"] },
        {
            name: "script-src",
            values: [
                "'report-sample'",
                "'self'",
                `'nonce-${nonce}'`,
                "'strict-dynamic'",
                "'unsafe-eval'",
            ],
        },
        {
            name: "style-src",
            values: [
                "'report-sample'",
                "'self'",
                // `'nonce-${nonce}'`,
                "'unsafe-inline'",
                "*.googleapis.com",
                "*.gstatic.com",
            ],
        },
        {
            name: "connect-src",
            values: [
                "'self'",
                "*.vercel-insights.com",
                "plausible.io",
                "*.googleapis.com",
            ],
        },
        {
            name: "font-src",
            values: ["'self'", "data:", "*.gstatic.com", "*.googleapis.com"],
        },
        {
            name: "img-src",
            values: ["'self'", "data:", "*.gstatic.com", "*.googleapis.com"],
        },
        { name: "worker-src", values: ["'self'", "blob:"] },
        { name: "frame-ancestors", values: ["'none'"] },
        { name: "form-action", values: ["*"] }, //'self'", "http://localhost:3000/api/auth/signin/australani
    ];

    const cspString = csp
        .map((directive) => {
            return `${directive.name} ${directive.values.join(" ")}`;
        })
        .join("; ");

    return { csp: cspString, nonce };
}

export async function middleware(request: NextRequest) {
    // generate CSP and nonce
    const { csp, nonce } = generateCsp();

    // Clone the request headers
    const requestHeaders = new Headers(request.headers);

    // set nonce request header to read in pages if needed
    requestHeaders.set("x-nonce", nonce);

    // set CSP header
    // switching for report-only or regular for repro on
    // https://github.com/vercel/next.js/issues/48966
    const headerKey =
        request.nextUrl.pathname === "/csp-report-only"
            ? "content-security-policy-report-only"
            : "content-security-policy";

    // Set the CSP header so that `app-render` can read it and generate tags with the nonce
    // requestHeaders.set(headerKey, csp);

    // create new response
    const response = NextResponse.next({
        // request: {
        //     // New request headers
        //     headers: requestHeaders,
        // },
    });

    // Also set the CSP so that it is outputted to the browser
    // response.headers.set(headerKey, csp);

    return response;
}

import { headers } from "next/headers";

export function useNonce() {
    const csp = headers().get("content-security-policy");
    return csp?.match(/'nonce-(.*?)'/)?.[1] ?? "";
}
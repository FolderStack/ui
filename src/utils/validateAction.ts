export function validateAction(csrf: string, nonce: string, e: FormData) {
    try {
        const formCSRF = e.get("$CSRF") as string;
        const formNonce = e.get("$NONCE") as string;
        if (formCSRF !== csrf) {
            throw new Error("CSRF token mismatch");
        }
        if (formNonce !== nonce) {
            throw new Error("Nonce mismatch");
        }
    } catch (err) {
        console.error(err);
        throw new Error("Failed to validate")
    }
}
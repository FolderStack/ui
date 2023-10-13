import { useNonce } from "./useNonce";

export function useSecureAction(serverAction: Function) {
    // TODO: Generate CSRF token or get it from cookie...
    const csrf = "1234567890";

    const nonce = useNonce();

    // Bind the CSRF so we can validate it in the action
    return [serverAction.bind(null, csrf, nonce), csrf, nonce];
}
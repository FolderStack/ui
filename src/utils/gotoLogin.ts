export function gotoLogin() {
    if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.pathname = `/api/auth/login`;
        window.location.href = url.toString();
    }
}

import Cookies from "js-cookie";
import { useEffect } from "react";

export function useAccessToken() {
    function getToken() {
        return "Bearer " + (Cookies.get("fsat") ?? "");
    }

    useEffect(() => {
        if (!getToken()) {
            const currentUrl = window.location.href;
            window.location.href = `/api/auth/login?returnTo=${encodeURI(
                currentUrl
            )}`;
        }
    }, []);

    return getToken;
}

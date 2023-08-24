import Cookies from "js-cookie";

export function useAccessToken() {
    function getToken() {
        return "Bearer " + (Cookies.get("fsat") ?? "");
    }

    return getToken;
}

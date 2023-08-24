import { config } from "@/config";
import { useAccessToken } from "./useAccessToken";

export function useRequestHeaders() {
    const getToken = useAccessToken();

    return (): any => ({
        Authorization: getToken(),
        ...config.api.headers,
    });
}

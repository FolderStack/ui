import { headers } from "next/headers";

export function usePathnameSSR() {
    const headersList = headers();
    const activePath = headersList.get("x-invoke-path");
    return activePath ?? '/'
}
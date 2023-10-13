"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useSortParams() {
    const router = useRouter();
    const params = useSearchParams();

    const sort = params.get("sort") ?? "asc";
    const sortBy = params.get("sortBy") ?? "name";

    const change = (key: "sort" | "sortBy", val: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, val);

        router.push(`/${url.pathname}?${url.searchParams.toString()}`);
    };

    return {
        sort,
        sortBy,
        change,
    };
}

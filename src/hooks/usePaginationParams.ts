"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function usePaginationParams() {
    const router = useRouter();
    const params = useSearchParams();

    const _page = params.get("page");
    const _pageSize = params.get("pageSize");

    const page = _page && !Number.isNaN(Number(_page)) ? Number(_page) : 1;
    const pageSize =
        _pageSize && !Number.isNaN(Number(_pageSize)) ? Number(_pageSize) : 20;

    const change = (p: number, ps: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(p));
        url.searchParams.set("pageSize", String(ps));

        router.push(`/${url.pathname}?${url.searchParams.toString()}`);
    };

    return {
        page,
        pageSize,
        change,
    };
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useFilterParams() {
    const router = useRouter();
    const params = useSearchParams();

    const from = params.get("from");
    const to = params.get("to");
    const fileTypes = params.get("fileTypes");

    const apply = (values: Record<string, any>) => {
        const url = new URL(window.location.href);

        for (const key in values) {
            const val = values[key];
            if (val) {
                url.searchParams.set(key, val);
            } else if (url.searchParams.has(key)) {
                url.searchParams.delete(key);
            }
        }

        router.push(`/${url.pathname}?${url.searchParams.toString()}`);
    };

    const clear = () => {
        apply({
            from: null,
            to: null,
            fileTypes: null,
        });
    };

    return {
        from,
        to,
        fileTypes,
        apply,
        clear,
    };
}

"use client";
import { PageData } from "@/types";
import { gotoLogin } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
import { useBoolean } from "./useBoolean";
import { useStableParams } from "./useStableParams";

export function useFetchPageData() {
    const [isLoading, loading] = useBoolean(false);
    const params = useStableParams();
    const filter = useFilter();
    const sort = useSort();
    const pagination = usePagination();
    const [data, setData] = useState<PageData | null>(null);
    const abortController = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (url: string) => {
        try {
            const res = await fetch(`/api/${url}`, {
                signal: abortController.current?.signal,
            });
            if (res.ok) {
                const data = await res.json();
                setData(data);
            } else if (res.status === 401) {
                gotoLogin();
            }
        } catch (err) {
            //
        }

        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reload = useCallback(() => {
        debugger;
        loading.on();
        const url = new URL(window.location.href);
        filter.toSearchParams(url.searchParams);
        sort.toSearchParams(url.searchParams);
        pagination.toSearchParams(url.searchParams);
        const qs = url.searchParams.toString();

        const folderId = params?.folderId;
        const fileId = params.fileId;

        let requestUrl = `folders/${folderId}`;
        if (fileId) requestUrl += `/files/${fileId}`;
        requestUrl += `?${qs}`;

        // Cancel the previous request
        abortController.current?.abort();
        // Create a new AbortController for the new request
        abortController.current = new AbortController();

        if (!params.folderId?.length) {
            setData({
                data: {
                    current: {},
                    items: [],
                },
            });
            return;
        }

        fetchData(requestUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, pagination, sort, params]);

    useEffect(() => {
        reload();
        return () => {
            // Abort ongoing fetch when the component is unmounted
            abortController.current?.abort();
        };
    }, [reload]);

    useEffect(() => {
        console.log("Page data", data);
    }, [data]);

    return { data, isLoading };
}

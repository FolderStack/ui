"use client";
import { config } from "@/config";
import { PageData } from "@/types";
import { gotoLogin } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
import { useBoolean } from "./useBoolean";
import { useRequestHeaders } from "./useRequestHeaders";
import { useStableParams } from "./useStableParams";

export function useFetchPageData() {
    const [isLoading, loading] = useBoolean(false);
    const getHeaders = useRequestHeaders();
    const params = useStableParams();
    const { toSearchParams: createFilterQuery } = useFilter();
    const { toSearchParams: createSortQuery } = useSort();
    const {
        page,
        pageSize,
        change,
        toSearchParams: createPaginationQuery,
    } = usePagination();

    const abortController = useRef<AbortController | null>(null);

    const [data, setData] = useState<PageData | null>(null);

    useEffect(() => {
        console.debug("useFetchPageData", "useEffect #1 (mount)");

        return () => {
            console.debug("useFetchPageData", "unmount & abort");
            // Abort ongoing fetch when the component is unmounted
            abortController.current?.abort();
        };
    }, []);

    const emptyData = useCallback(() => {
        console.debug("useFetchPageData", "emptyData");
        setData({
            pagination: data?.pagination ?? {},
            data: {
                current: data?.data.current ?? {},
                items: [],
            },
        });
    }, []);

    // Fallback to a lower page if the pageSize is increased beyond the total data size
    // so that we don't remain on a page that no longer exists.
    useEffect(() => {
        const totalItems = data?.pagination.totalItems ?? 0;
        if ((page - 1) * pageSize > totalItems && page > 1) {
            console.debug("useFetchPageData", "useEffect #2 (set pagination)");
            change(page - 1, pageSize);
        }
    }, [page, pageSize, change, data]);

    const fetchData = async (url: string) => {
        try {
            const res = await fetch(`${config.api.baseUrl}/${url}`, {
                signal: abortController.current?.signal,
                headers: getHeaders(),
            });

            if (!res.ok && res.status === 401) {
                gotoLogin();
            }

            const data = await res.json();
            console.debug("useFetchPageData", "fetchData", "setData");
            setData(data);
            abortController.current = null;
        } catch (err: any) {
            // Distinguish fetch abort error from other errors
            if (err.name === "AbortError") {
                console.log("Fetch aborted");
            } else {
                emptyData();
            }
        } finally {
            loading.off();
        }
    };

    const reload = useCallback(() => {
        console.debug("useFetchPageData", "reload");
        console.log([params, fetchData, emptyData]);
        loading.on();

        const url = new URL(window.location.href);
        createFilterQuery(url.searchParams);
        createSortQuery(url.searchParams);
        createPaginationQuery(url.searchParams);

        const qs = url.searchParams.toString();

        const folderId = params?.folderId;
        const fileId = params?.fileId;

        let requestUrl = `folders/${folderId}`;
        if (fileId) requestUrl += `/files/${fileId}`;
        requestUrl += `?${qs}`;

        // Cancel the previous request
        if (abortController.current) {
            console.debug("useFetchPageData", "reload", "abort previous");
            abortController.current.abort();
        }
        // Create a new AbortController for the new request
        abortController.current = new AbortController();

        if (!params.folderId?.length) {
            emptyData();
            return;
        }

        fetchData(requestUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        createFilterQuery,
        createSortQuery,
        createPaginationQuery,
        params,
        emptyData,
    ]);

    useEffect(() => {
        console.debug("useFetchPageData", "useEffect #3 (reload)");

        reload();
    }, [reload]);

    return useMemo(
        () => ({ data, isLoading, reload }),
        [data, isLoading, reload]
    );
}

"use client";
import { config } from "@/config";
import { PageData } from "@/types";
import { gotoLogin } from "@/utils";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
import { useBoolean } from "./useBoolean";
import { useCsrfToken } from "./useCsrfToken";
import { useStableParams } from "./useStableParams";

export function useFetchPageData() {
    const [isLoading, loading] = useBoolean(false);
    const params = useStableParams();
    const filter = useFilter();
    const sort = useSort();
    const pagination = usePagination();
    const csrf = useCsrfToken();

    const abortController = useRef<AbortController | null>(null);

    const [data, setData] = useState<PageData | null>(null);

    const emptyData = () => {
        setData({
            pagination: data?.pagination ?? {},
            data: {
                current: data?.data.current ?? {},
                items: [],
            },
        });
    };

    // Fallback to a lower page if the pageSize is increased beyond the total data size
    // so that we don't remain on a page that no longer exists.
    useEffect(() => {
        const totalItems = data?.pagination.totalItems ?? 0;
        const { page, pageSize } = pagination;
        if ((page - 1) * pageSize > totalItems && page > 1) {
            pagination.change(page - 1, pageSize);
        }
    }, [pagination, data]);

    const fetchData = useCallback(
        async (url: string) => {
            try {
                const res = await fetch(`${config.api.baseUrl}/${url}`, {
                    signal: abortController.current?.signal,
                    headers: {
                        "X-CSRF": csrf,
                        Authorization: Cookies.get("fsat") ?? "",
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setData(data);
                    loading.off();
                    return;
                } else if (res.status === 401) {
                    gotoLogin();
                }
            } catch (err) {
                //
            }
            emptyData();

            loading.off();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const reload = useCallback(() => {
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
            emptyData();
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

    return { data, isLoading, reload };
}

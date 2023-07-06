"use client";
import { PageData } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
import { useBoolean } from "./useBoolean";
const dummyData = require("../../dummy-data.json");

export function useFetchPageData() {
    const [isLoading, loading] = useBoolean(false);
    const params = useParams();
    const filter = useFilter();
    const sort = useSort();
    const pagination = usePagination();

    const [data, setData] = useState<PageData | null>(null);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    useEffect(() => {
        const _folderId = params.folderId;
        const _fileId = params.fileId;

        if (_folderId && !!_folderId?.trim?.()?.length) {
            setFolderId(_folderId);
        }

        if (_fileId && !!_fileId?.trim?.()?.length) {
            setFileId(_fileId);
        }
    }, [params]);

    async function fetchData(url: string) {
        const response = await fetch(`/api/${url}`);
        const data = await response.json();
        return data;
    }

    const request = useCallback(async () => {
        if (!folderId) return;
        loading.on();
        const url = new URL(window.location.href);
        filter.toSearchParams(url.searchParams);
        sort.toSearchParams(url.searchParams);
        pagination.toSearchParams(url.searchParams);
        const qs = url.searchParams.toString();

        let requestUrl = `folders/${folderId}`;
        if (fileId) requestUrl += `/files/${fileId}`;
        requestUrl += `?${qs}`;

        fetchData(requestUrl)
            .then((data) => {
                setData(data);
            })
            .finally(() => {
                loading.off();
            });

        // Using filter.filter to avoid triggering a call every time
        // filter.isVisible is changed etc..
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.filter, sort, pagination, folderId, fileId]);

    useEffect(() => {
        request();
    }, [request]);

    return { data, isLoading };
}

"use client";
import { PageData } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
import { useBoolean } from "./useBoolean";
const dummyData = require('../../dummy-data.json');

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
    }, [params])

    const request = useCallback(async () => {
        loading.on()
        const url = new URL(window.location.href);
        filter.toSearchParams(url.searchParams);
        sort.toSearchParams(url.searchParams);
        pagination.toSearchParams(url.searchParams);
        const qs = url.searchParams.toString();

        loading.off();
        
        // Using filter.filter to avoid triggering a call every time
        // filter.isVisible is changed etc..
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.filter, sort, pagination])

    const dummyRequest = useCallback(async function() {
        if (!folderId && !fileId) return;

        const folder = dummyData.find((f: any) => String(f.id) === folderId && f.type === 'folder');
        if (folder) {
            if (fileId) {
                const file = dummyData.find((c: any) => String(c.id) === fileId && c.type === 'file' && String(c.parent) === folderId);
                return { folder, file };
            } else {
                const children = dummyData.filter((c: any) => String(c.parent) === folderId);
                return { folder, children };
            }
        }
        return {};
    }, [folderId, fileId]);

    useEffect(() => {
        request()
    }, [request])

    return { data, isLoading };
}
"use client";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFilter } from "./Filter";
import { usePagination } from "./Pagination";
import { useSort } from "./Sort";
const dummyData = require('../../dummy-data.json');

export function useFetchPageData() {
    const params = useParams();
    const filter = useFilter();
    const sort = useSort();
    const { page, pageSize } = usePagination();

    const [data, setData] = useState<any | null>(null);
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
        const params = filter.toSearchParams();
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());


    }, [])

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

    return data;
}
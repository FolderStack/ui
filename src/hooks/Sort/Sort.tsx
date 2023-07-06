"use client";
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useBoolean } from "../useBoolean";

interface SortContext {
    sort: "asc" | "desc";
    sortBy?: string;
    change(sortBy?: string, sort?: "asc" | "desc"): void;
    toSearchParams(qs?: URLSearchParams): URLSearchParams;
}

const SortContext = createContext<SortContext>({
    sort: "desc",
    change(sortBy, sort) {
        //
    },
    toSearchParams(qs) {
        return new URLSearchParams();
    },
});

const SORT_KEYS = ["name", "size", "createdAt", "updatedAt"];

export function SortProvider({ children }: PropsWithChildren) {
    const [sortBy, setSortBy] = useState<string>();
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [isLoading, loading] = useBoolean();

    function change(sb?: string, st?: "asc" | "desc") {
        if (sb !== sortBy && sb) {
            setSortBy(sb);
        }

        if (st !== sort && st) {
            setSort(st);
        }
    }

    function fromSearchParams() {
        const url = new URL(window.location.href);
        const _sortBy = url.searchParams.get("sortBy");
        const _sort = url.searchParams.get("sort");

        if (_sortBy) setSortBy(_sortBy);
        if (_sort) setSort(_sort as any);
    }

    const toSearchParams = useCallback(
        function (qs = new URLSearchParams()) {
            if (sortBy) qs.set("sortBy", sortBy);
            if (sort) qs.set("sort", sort);

            return qs;
        },
        [sortBy, sort]
    );

    useEffect(() => {
        fromSearchParams();
        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sortBy && !SORT_KEYS.includes(sortBy)) {
            setSortBy("name");
        }
    }, [sortBy]);

    useEffect(() => {
        if (sort && !["asc", "desc"].includes(sort)) {
            setSort("asc");
        }
    }, [sort]);

    useEffect(() => {
        if (isLoading) return;
        const url = new URL(window.location.href);
        toSearchParams(url.searchParams);
        window.history.replaceState(null, "", url.toString());
    }, [toSearchParams, isLoading]);

    return (
        <SortContext.Provider value={{ sortBy, sort, change, toSearchParams }}>
            {children}
        </SortContext.Provider>
    );
}

export function useSort() {
    return useContext(SortContext);
}

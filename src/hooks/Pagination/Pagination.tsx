import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useBoolean } from "../useBoolean";

const PaginationContext = createContext({
    page: 1,
    pageSize: 20,
    change(page: number, pageSize: number) {
        //
    },
    toSearchParams(qs?: URLSearchParams) {
        return new URLSearchParams();
    },
});

export function PaginationProvider({ children }: PropsWithChildren) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isLoading, loading] = useBoolean(true);

    function change(p: number, ps: number) {
        const url = new URL(window.location.href);
        const search = new URLSearchParams(url.search);

        search.set("page", p.toString());
        search.set("pageSize", ps.toString());

        url.search = search.toString();
        window.history.pushState(null, "", url.toString());
    }

    function fromSearchParams() {
        const url = new URL(window.location.href);
        const _page = Number(url.searchParams.get("page"));
        const _pageSize = Number(url.searchParams.get("pageSize"));

        if (!Number.isNaN(_page) && _page > 0) {
            setPage(_page);
        }

        if (!Number.isNaN(_pageSize) && _pageSize > 0) {
            setPageSize(_pageSize);
        }
    }

    const toSearchParams = useCallback(
        (qs = new URLSearchParams()) => {
            qs.set("page", page.toString());
            qs.set("pageSize", pageSize.toString());

            return qs;
        },
        [page, pageSize]
    );

    useEffect(() => {
        fromSearchParams();
        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const url = new URL(window.location.href);
        toSearchParams(url.searchParams);
        window.history.replaceState(null, "", url.toString());
    }, [toSearchParams, isLoading]);

    return (
        <PaginationContext.Provider
            value={{ page, pageSize, change, toSearchParams }}
        >
            {children}
        </PaginationContext.Provider>
    );
}

export function usePagination() {
    return useContext(PaginationContext);
}

import { useParams } from "next/navigation";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const PaginationContext = createContext({
    page: 1,
    pageSize: 20,
    change(page: number, pageSize: number) {
        //
    },
});

export function PaginationProvider({ children }: PropsWithChildren) {
    const params = useParams();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    function change(p: number, ps: number) {
        const url = new URL(window.location.href);
        const search = new URLSearchParams(url.search);

        search.set("page", p.toString());
        search.set("pageSize", ps.toString());

        url.search = search.toString();
        window.history.pushState(null, "", url.toString());
    }

    useEffect(() => {
        const _page = params.page;
        const _pageSize = params.pageSize;

        if (_page && !Number.isNaN(Number(_page))) {
            setPage(Number(_page));
        }

        if (_pageSize && !Number.isNaN(Number(_pageSize))) {
            setPageSize(Number(_pageSize));
        }
    }, [params]);

    return (
        <PaginationContext.Provider value={{ page, pageSize, change }}>
            {children}
        </PaginationContext.Provider>
    );
}

export function usePagination() {
    return useContext(PaginationContext);
}

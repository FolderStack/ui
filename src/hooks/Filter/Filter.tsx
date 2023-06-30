import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useBoolean } from "../useBoolean";

interface Filters {
    from?: Date;
    to?: Date;
    fileTypes?: string[];
}

const FilterContext = createContext({
    filter: {} as Filters,
    apply(filters: Filters) {
        //
    },
    clear() {
        //
    },
    toSearchParams(): URLSearchParams {
        return new URLSearchParams();
    },
    isVisible: false,
    visible: {
        on() {
            //
        },
        off() {
            //
        },
        toggle() {
            //
        },
    },
});

const FILTER_QUERY_KEYS = ["from", "to", "fileTypes"];

export function FilterProvider({ children }: PropsWithChildren) {
    const [isLoading, loading] = useBoolean(true);
    const [filter, setFilter] = useState<Filters>({});
    const [isVisible, visible] = useBoolean(false);

    function apply(newFilters: Filters) {
        setFilter(newFilters);
    }

    function clear() {
        setFilter({});
    }

    function fromSearchParams() {
        const url = new URL(window.location.href);
        const _filters: Record<string, string[] | Date> = {};

        for (const [key, value] of Array.from(url.searchParams.entries())) {
            const k = key as keyof Filters;

            if (value && FILTER_QUERY_KEYS.includes(k)) {
                if (!Number.isNaN(new Date(value ?? "").getTime())) {
                    _filters[k] = new Date(value!);
                } else {
                    _filters[k] = value?.split(",") ?? [];
                }
            }
        }

        return _filters as Filters;
    }

    function toSearchParams() {
        const qs = new URLSearchParams();

        for (const key in filter) {
            const k = key as keyof Filters;
            if (!filter[k]) continue;

            const value = filter[k];

            if (typeof value === "object") {
                if (!Number.isNaN(new Date(value as any).getTime())) {
                    qs.set(k, new Date(value as any).toISOString());
                } else if (Array.isArray(value)) {
                    qs.set(k, value.join(","));
                }
            }
        }

        return qs;
    }

    useEffect(() => {
        const urlFilters = fromSearchParams();
        if (Object.keys(urlFilters).length) {
            visible.on();
            setFilter(urlFilters);
        }
        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const url = new URL(window.location.href);
        const filterSearch = toSearchParams();

        for (const key of FILTER_QUERY_KEYS) {
            if (!filterSearch.has(key) && url.searchParams.has(key)) {
                url.searchParams.delete(key);
            } else if (filterSearch.has(key) && !!filterSearch.get(key)) {
                url.searchParams.set(key, filterSearch.get(key)!);
            }
        }

        window.history.replaceState(null, "", url.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, isLoading]);

    return (
        <FilterContext.Provider
            value={{ filter, apply, clear, isVisible, visible, toSearchParams }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    return useContext(FilterContext);
}

import { PageParamProps } from "@/types/params";

interface Sort {
    sort: string;
    sortBy: string;
}

interface Filter {
    filterVisible: "1";
    from?: string;
    to?: string;
    fileTypes?: string[];
}

interface NoFilter {
    filterVisible?: "0";
}

interface Pagination {
    page: number;
    pageSize: number;
}

export type SortFilterAndPaginationParams =
    | (Sort & Filter & Pagination)
    | (Sort & NoFilter & Pagination);

type Params = {
    searchParams: PageParamProps["searchParams"];
};

export function getSortFilterAndPaginationParams({
    searchParams,
}: Params): SortFilterAndPaginationParams {
    if (searchParams instanceof URLSearchParams) {
        searchParams = Array.from(searchParams.entries()).reduce(
            (acc, [key, value]) => {
                Object.assign(acc, {
                    [key]: Array.isArray(value)
                        ? value.join(",")
                        : String(value),
                });
                return acc;
            },
            {} as PageParamProps["searchParams"]
        ) as { [key: string]: string | string[] | undefined };
    }

    const sort = String(searchParams["sort"] ?? "asc");
    const sortBy = String(searchParams["sortBy"] ?? "name");
    const page = Number(searchParams["page"] ?? "1");
    const pageSize = Number(searchParams["pageSize"] ?? "20");
    const filterVisible = String(searchParams["filterVisible"] ?? "0");
    const from = searchParams["from"];
    const to = searchParams["to"];
    const fileTypes = searchParams["fileTypes"];

    const result: SortFilterAndPaginationParams = {
        sort,
        sortBy,
        page,
        pageSize,
        filterVisible: filterVisible === "1" ? "1" : "0",
    };

    // We do this to allow filters to remain in the URL but have
    // no effect on the API call.
    if (result.filterVisible === "1") {
        if (from && typeof from === "string" && !Number.isNaN(new Date(from))) {
            result.from = from;
        }
        if (to && typeof to === "string" && !Number.isNaN(new Date(to))) {
            result.to = to;
        }
        if (fileTypes) {
            if (typeof fileTypes === "string") {
                result.fileTypes = fileTypes.split(",");
            } else if (fileTypes instanceof Array) {
                result.fileTypes = fileTypes;
            }
        }
    }

    return result;
}

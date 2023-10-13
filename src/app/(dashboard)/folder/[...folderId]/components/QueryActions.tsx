import { Heading } from "@/components/Typography";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { FilterActions } from "./Filter/FilterActions";
import { FilterDisplayAction } from "./Filter/FilterDisplayAction";
import { SortActions } from "./Sort/SortActions";

export function QueryActions({
    title,
    searchParams,
}: PageParamProps & { title: string }) {
    const { sort, sortBy, page, pageSize, ...rest } =
        getSortFilterAndPaginationParams({
            searchParams,
        });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-row space-between items-center w-full">
                <span>
                    <Heading>{title || "Home"}</Heading>
                </span>
                <span className="flex flex-row space-x-2 ml-auto">
                    <SortActions {...{ sort, sortBy }} />
                    <FilterDisplayAction filterVisible={rest.filterVisible} />
                </span>
            </div>
            {rest.filterVisible === "1" && (
                <div className="flex justify-end">
                    <FilterActions
                        from={rest.from}
                        to={rest.to}
                        fileTypes={rest.fileTypes}
                    />
                </div>
            )}
        </div>
    );
}

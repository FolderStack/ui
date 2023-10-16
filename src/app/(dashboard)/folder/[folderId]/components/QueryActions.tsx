import { Heading } from "@/components/Typography";
import { flags } from "@/config/flags";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { Suspense } from "react";
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs";
import { FilterActions } from "./Filter/FilterActions";
import { FilterDisplayAction } from "./Filter/FilterDisplayAction";
import { SortActions } from "./Sort/SortActions";

interface QueryActionsProps {
    title: string;
    params: PageParamProps;
}

export function QueryActions({ title = "", params }: QueryActionsProps) {
    const { sort, sortBy, page, pageSize, ...rest } =
        getSortFilterAndPaginationParams(params);

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-row space-between items-center w-full">
                <span className="w-[80%]">
                    <Suspense>
                        <Breadcrumbs {...params} />
                    </Suspense>
                    <Heading>{title || "Home"}</Heading>
                </span>
                <span className="flex flex-row space-x-2 ml-auto">
                    {flags.showSort && <SortActions {...{ sort, sortBy }} />}
                    {flags.showFilters && (
                        <FilterDisplayAction
                            filterVisible={rest.filterVisible}
                        />
                    )}
                </span>
            </div>
            {flags.showFilters && rest.filterVisible === "1" && (
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

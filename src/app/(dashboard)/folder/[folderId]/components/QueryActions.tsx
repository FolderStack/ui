import { Heading } from "@/components/Typography";
import { flags } from "@/config/flags";
import { Node } from "@/utils/buildTree";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs";
import { FilterActions } from "./Filter/FilterActions";
import { FilterDisplayAction } from "./Filter/FilterDisplayAction";
import { SortActions } from "./Sort/SortActions";

interface QueryActionsProps {
    title: string;
    tree: Node[];
}

export function QueryActions({ title = "", tree = [] }: QueryActionsProps) {
    const [currTitle, setTitle] = useState(title);

    const searchParams = useSearchParams();

    const { sort, sortBy, page, pageSize, ...rest } =
        getSortFilterAndPaginationParams({
            searchParams: Object.fromEntries(searchParams),
        });

    useEffect(() => {
        if (title && title.length > 0) {
            window.localStorage.setItem("lastTitle", title);
            setTitle(title);
        } else {
            setTitle(window.localStorage.getItem("lastTitle") || title);
        }
    }, [title]);

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-row space-between items-center w-full">
                <span className="w-[80%]">
                    <Breadcrumbs tree={tree} />
                    <Heading>{currTitle}&nbsp;</Heading>
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

"use client";

import { flags } from "@/config/flags";
import { Node } from "@/utils/buildTree";
import { AdminActions } from "../components/Admin/AdminActions";
import { PaginationActions } from "../components/Pagination/PaginationActions";
import { QueryActions } from "../components/QueryActions";
import { SelectActions } from "../components/Select/SelectActions";

export function FolderPageTopArea({
    currentPage = {} as any,
    pageData = {} as any,
    tree = [] as Node[],
}) {
    const title =
        currentPage && currentPage.root ? "Home" : currentPage?.name || "";

    const pagination = pageData?.pagination ?? {
        totalItems: 0,
        page: 1,
        pageSize: 20,
    };
    const items = pageData?.items ?? [];

    return (
        <section id="query-actions" className="w-full space-y-8">
            <QueryActions tree={tree} title={title} />
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                    <AdminActions />
                    {flags.showSelectActions && <SelectActions items={items} />}
                </div>
                {flags.showPagination && (
                    <PaginationActions {...(pagination ?? {})} />
                )}
            </div>
        </section>
    );
}

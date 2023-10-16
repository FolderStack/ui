import { Sidebar } from "@/components/Sidebar/Sidebar";
import { flags } from "@/config/flags";
import { getFolder } from "@/services/db/queries/getFolder";
import { getFolderContents } from "@/services/db/queries/getFolderContents";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { AdminActions } from "./components/Admin/AdminActions";
import { FolderPageContent } from "./components/FolderPageContent";
import { PaginationActions } from "./components/Pagination/PaginationActions";
import { QueryActions } from "./components/QueryActions";
import { SelectActions } from "./components/Select/SelectActions";
import { SelectionProvider } from "./components/Select/SelectContext";

export default async function FolderPage(pageParams: PageParamProps) {
    const [currentPage, pageData] = await Promise.allSettled([
        getFolder(pageParams),
        getFolderContents(pageParams),
    ]);

    const { page, pageSize } = getSortFilterAndPaginationParams({
        searchParams: pageParams.searchParams,
    });

    const title =
        currentPage.status === "fulfilled"
            ? currentPage?.value?.name || ""
            : "";

    const data = pageData.status === "fulfilled" ? pageData?.value : null;

    return (
        <main className="w-full flex flex-row">
            <Sidebar {...pageParams} />
            <section className="p-6 flex-1">
                <SelectionProvider items={data?.items ?? []}>
                    <section id="query-actions" className="w-full space-y-8">
                        <QueryActions params={pageParams} title={title} />
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="flex flex-row space-x-4">
                                <AdminActions />
                                {flags.showSelectActions && (
                                    <SelectActions items={data?.items ?? []} />
                                )}
                            </div>
                            {flags.showPagination && (
                                <PaginationActions
                                    {...{
                                        page,
                                        pageSize,
                                        totalItems:
                                            data?.pagination?.totalItems ?? 0,
                                    }}
                                />
                            )}
                        </div>
                    </section>
                    <div className="h-8" />
                    <section id="folder-contents">
                        {data && <FolderPageContent items={data.items ?? []} />}
                    </section>
                </SelectionProvider>
            </section>
        </main>
    );
}

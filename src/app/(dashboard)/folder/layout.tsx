"use client";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarLoading } from "@/components/Sidebar/SidebarLoading";
import { flags } from "@/config/flags";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { SelectionProvider } from "../../../hooks/SelectContext";
import { AdminActions } from "./[folderId]/components/Admin/AdminActions";
import { PaginationActions } from "./[folderId]/components/Pagination/PaginationActions";
import { PaginationActionsLoading } from "./[folderId]/components/Pagination/PaginationActionsLoading";
import { QueryActions } from "./[folderId]/components/QueryActions";
import { QueryActionsLoading } from "./[folderId]/components/QueryActionsLoading";
import { SelectActions } from "./[folderId]/components/Select/SelectActions";
import { SelectActionsLoading } from "./[folderId]/components/Select/SelectActionsLoading";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FolderPageLayout(props: any) {
    const params = useParams();

    const { data: treeData, isLoading: loadingTree } = useSWR(
        `/api/v1/tree`,
        fetcher
    );
    const { data: folderData, isLoading: loadingContent } = useSWR(
        `/api/v1/folders/${String(params.folderId)}/contents`,
        fetcher
    );
    const { data: pageInfo, isLoading: loadingPage } = useSWR(
        `/api/v1/folders/${String(params.folderId)}`,
        fetcher
    );

    const tree = treeData?.tree ?? [];
    const items = folderData?.items ?? [];
    const title = pageInfo && pageInfo.root ? "Home" : pageInfo?.name || "";
    const pagination = folderData?.pagination ?? {
        totalItems: 0,
        page: 1,
        pageSize: 20,
    };

    return (
        <SelectionProvider items={folderData?.items ?? []}>
            <main className="w-full flex flex-row">
                {loadingTree ? <SidebarLoading /> : <Sidebar {...{ tree }} />}
                <section className="p-6 flex-1">
                    <section id="query-actions" className="w-full space-y-8">
                        {loadingTree ? (
                            <QueryActionsLoading />
                        ) : (
                            <QueryActions {...{ tree }} title={title} />
                        )}
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="flex flex-row space-x-4">
                                <AdminActions />
                                {flags.showSelectActions &&
                                    (loadingContent ? (
                                        <SelectActionsLoading />
                                    ) : (
                                        <SelectActions {...{ items }} />
                                    ))}
                            </div>
                            {flags.showPagination &&
                                (loadingPage ? (
                                    <PaginationActionsLoading />
                                ) : (
                                    <PaginationActions {...pagination} />
                                ))}
                        </div>
                    </section>
                    <div className="h-8" />
                    <section id="folder-contents">{props.children}</section>
                </section>
            </main>
        </SelectionProvider>
    );
}

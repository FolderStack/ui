"use client";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { SelectionProvider } from "../../../hooks/SelectContext";
import { FolderPageTopArea } from "./[folderId]/sections/TopArea";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FolderPageLayout(props: any) {
    const params = useParams();

    const { data: treeData } = useSWR(`/api/v1/tree`, fetcher);
    const { data: folderData } = useSWR(
        `/api/v1/folders/${String(params.folderId)}/contents`,
        fetcher
    );
    const { data: pageInfo } = useSWR(
        `/api/v1/folders/${String(params.folderId)}`,
        fetcher
    );

    return (
        <SelectionProvider items={folderData?.items ?? []}>
            <main className="w-full flex flex-row">
                <Sidebar tree={treeData?.tree ?? []} />
                <section className="p-6 flex-1">
                    <FolderPageTopArea
                        currentPage={pageInfo}
                        pageData={folderData}
                        tree={treeData?.tree ?? []}
                    />
                    <div className="h-8" />
                    <section id="folder-contents">{props.children}</section>
                </section>
            </main>
        </SelectionProvider>
    );
}

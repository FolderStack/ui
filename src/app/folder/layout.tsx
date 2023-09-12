"use client";
import { DropZone } from "@/components";
import { usePageData, useUpload } from "@/hooks";
import { PropsWithChildren } from "react";

export default function FolderLayout({ children }: PropsWithChildren) {
    const pageData = usePageData();
    const upload = useUpload();

    return (
        <DropZone onDrop={upload.openModal}>
            {pageData.isLoading ? <>Loading...</> : children}
        </DropZone>
    );
}
